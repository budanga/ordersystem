package com.budanga.ordersystem.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderDTO {
    private String customerName;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> orderItems;
}
