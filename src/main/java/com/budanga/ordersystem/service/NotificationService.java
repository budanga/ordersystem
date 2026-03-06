package com.budanga.ordersystem.service;

import com.budanga.ordersystem.dto.NotificationDTO;
import com.budanga.ordersystem.entity.Notification;
import com.budanga.ordersystem.entity.NotificationType;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.mapper.NotificationMapper;
import com.budanga.ordersystem.repository.NotificationRepository;
import com.budanga.ordersystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserRepository userRepository;

    public List<NotificationDTO> getUserNotifications(User user) {
        return notificationMapper.toDTOList(notificationRepository.findByUserOrderByCreatedAtDesc(user));
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void clearAll(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setCleared(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void createNotification(User user, NotificationType type, String text) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .text(text)
                .build();
        notificationRepository.save(notification);
    }
    @Transactional
    public void createNotificationForAllUsers(NotificationType type, String text) {
        List<User> users = userRepository.findAll();
        List<Notification> notifications = users.stream()
                .map(user -> Notification.builder()
                        .user(user)
                        .type(type)
                        .text(text)
                        .build())
                .toList();
        notificationRepository.saveAll(notifications);
    }
}
