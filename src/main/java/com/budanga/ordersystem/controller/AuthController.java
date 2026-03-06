package com.budanga.ordersystem.controller;

import com.budanga.ordersystem.dto.AuthRequestDTO;
import com.budanga.ordersystem.dto.RegisterRequestDTO;
import com.budanga.ordersystem.dto.RefreshTokenRequestDTO;
import com.budanga.ordersystem.dto.TokenResponseDTO;
import com.budanga.ordersystem.entity.RefreshToken;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.repository.UserRepository;
import com.budanga.ordersystem.security.JwtService;
import com.budanga.ordersystem.service.LoginAttemptService;
import com.budanga.ordersystem.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final LoginAttemptService loginAttemptService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtService jwtService, AuthenticationManager authenticationManager,
            RefreshTokenService refreshTokenService, LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        boolean usernameExists = userRepository.existsByUsername(request.getUsername());
        boolean emailExists = userRepository.existsByEmail(request.getEmail());

        if (usernameExists && emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username and Email are already taken");
        } else if (usernameExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        } else if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already taken");
        }

        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .roles(roles)
                .build();

        user = userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(TokenResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        if (loginAttemptService.isBlocked(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            loginAttemptService.loginSucceeded(request.getUsername());
        } catch (BadCredentialsException | InternalAuthenticationServiceException e) {
            loginAttemptService.loginFailed(request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(TokenResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return ResponseEntity.ok(TokenResponseDTO.builder()
                            .accessToken(accessToken)
                            .refreshToken(request.getRefreshToken())
                            .build());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(@Valid @RequestBody RefreshTokenRequestDTO request) {
        refreshTokenService.findByToken(request.getRefreshToken())
                .map(RefreshToken::getUser)
                .ifPresent(user -> refreshTokenService.deleteByUserId(user.getId()));
        return ResponseEntity.noContent().build();
    }
}
