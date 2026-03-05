package com.budanga.ordersystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Order information including customer and item details")
public class OrderDTO {
    @Schema(description = "Unique identifier of the order", example = "101")
    private Long id;

    @Schema(description = "Name of the customer who placed the order", example = "Jane Smith")
    private String customerName;

    @Schema(description = "Calculated total amount for the order", example = "250.00")
    private BigDecimal totalAmount;

    @Schema(description = "Status of the order", example = "false")
    private Boolean completed;

    @Schema(description = "Timestamp when the order was created", example = "2024-03-05T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "List of items included in the order")
    private List<OrderItemDTO> items;
}
