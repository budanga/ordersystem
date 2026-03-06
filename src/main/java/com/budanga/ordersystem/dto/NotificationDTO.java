package com.budanga.ordersystem.dto;

import com.budanga.ordersystem.entity.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Notification information for the user")
public class NotificationDTO {
    @Schema(description = "Unique identifier of the notification", example = "1")
    private Long id;

    @Schema(description = "Type of the notification", example = "ORDER_SUCCESS")
    private NotificationType type;

    @Schema(description = "Text content of the notification", example = "Your order #12345 has been confirmed!")
    private String text;

    @Schema(description = "Timestamp when the notification was created", example = "2024-03-05T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Whether the notification has been read", example = "false")
    private boolean read;

    @Schema(description = "Whether the notification has been cleared from the dropdown", example = "false")
    private boolean cleared;
}
