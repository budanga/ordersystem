package com.budanga.ordersystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String customerName;
    private BigDecimal totalAmount;
    private Boolean completed;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}
