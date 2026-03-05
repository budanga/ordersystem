package com.budanga.ordersystem.controller;

import com.budanga.ordersystem.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 *
 * Verifies register/login flows and that protected endpoints return 401 without
 * a token.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("AuthController (integration)")
class AuthControllerTest {

        private static final String BASE = "/api/auth";

        @Autowired
        private WebApplicationContext webApplicationContext;

        @Autowired
        private UserRepository userRepository;

        private MockMvc mockMvc;

        @BeforeEach
        void setupMockMvc() {
                mockMvc = MockMvcBuilders
                                .webAppContextSetup(webApplicationContext)
                                .apply(SecurityMockMvcConfigurers.springSecurity())
                                .build();
        }

        // ─── POST /api/auth/register ─────────────────────────────────────────────

        @Nested
        @DisplayName("POST /api/auth/register")
        class Register {

                @Test
                @DisplayName("201: registers a new user and returns a JWT token")
                void success() throws Exception {
                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"newuser","password":"password123"}
                                                        """))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.token").isString())
                                        .andExpect(jsonPath("$.token").isNotEmpty());
                }

                @Test
                @DisplayName("409: returns conflict when username already exists")
                void duplicateUsername() throws Exception {
                        String body = """
                                        {"username":"existing","password":"password123"}
                                        """;

                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(body))
                                        .andExpect(status().isCreated());

                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(body))
                                        .andExpect(status().isConflict());
                }

                @Test
                @DisplayName("400: returns bad request when username is blank")
                void blankUsername() throws Exception {
                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"","password":"password123"}
                                                        """))
                                        .andExpect(status().isBadRequest());
                }

                @Test
                @DisplayName("400: returns bad request when password is blank")
                void blankPassword() throws Exception {
                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"validuser","password":""}
                                                        """))
                                        .andExpect(status().isBadRequest());
                }
        }

        // ─── POST /api/auth/login ────────────────────────────────────────────────

        @Nested
        @DisplayName("POST /api/auth/login")
        class Login {

                @BeforeEach
                void registerUser() throws Exception {
                        mockMvc.perform(post(BASE + "/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"loginuser","password":"correctpass"}
                                                        """))
                                        .andExpect(status().isCreated());
                }

                @Test
                @DisplayName("200: returns JWT token for valid credentials")
                void success() throws Exception {
                        mockMvc.perform(post(BASE + "/login")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"loginuser","password":"correctpass"}
                                                        """))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.token").isString())
                                        .andExpect(jsonPath("$.token").isNotEmpty());
                }

                @Test
                @DisplayName("401: returns unauthorized for wrong password")
                void wrongPassword() throws Exception {
                        mockMvc.perform(post(BASE + "/login")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"loginuser","password":"wrongpass"}
                                                        """))
                                        .andExpect(status().isUnauthorized());
                }

                @Test
                @DisplayName("401: returns unauthorized for non-existent user")
                void unknownUser() throws Exception {
                        mockMvc.perform(post(BASE + "/login")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("""
                                                        {"username":"nobody","password":"password123"}
                                                        """))
                                        .andExpect(status().isUnauthorized());
                }
        }

        // ─── Protected endpoint - no token ────────────────────────────────────────

        @Nested
        @DisplayName("Protected endpoints without token")
        class Unauthorized {

                @Test
                @DisplayName("401: GET /api/orders returns unauthorized without token")
                void ordersWithoutToken() throws Exception {
                        mockMvc.perform(get("/api/orders"))
                                        .andExpect(status().isUnauthorized());
                }

                @Test
                @DisplayName("401: GET /api/products returns unauthorized without token")
                void productsWithoutToken() throws Exception {
                        mockMvc.perform(get("/api/products"))
                                        .andExpect(status().isUnauthorized());
                }
        }
}
