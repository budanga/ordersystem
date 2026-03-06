package com.budanga.ordersystem.controller;

import com.budanga.ordersystem.dto.NotificationDTO;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for managing user notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get current user notifications")
    public List<NotificationDTO> getMyNotifications(@AuthenticationPrincipal User user) {
        return notificationService.getUserNotifications(user);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications")
    public long getUnreadCount(@AuthenticationPrincipal User user) {
        return notificationService.getUnreadCount(user);
    }

    @PatchMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read for current user")
    public void markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
    }

    @PatchMapping("/clear-all")
    @Operation(summary = "Clear all notifications from dropdown for current user")
    public void clearAll(@AuthenticationPrincipal User user) {
        notificationService.clearAll(user);
    }
}
