package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.OrderItemDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        if (order == null)
            return null;

        return new OrderDTO(
                order.getId(),
                order.getCustomerName(),
                order.getTotalAmount(),
                order.getCompleted(),
                order.getCreatedAt(),
                order.getOrderItems() != null ? order.getOrderItems().stream()
                        .map(OrderMapper::toOrderItemDTO)
                        .collect(Collectors.toList()) : null);
    }

    public static OrderItemDTO toOrderItemDTO(OrderItem item) {
        if (item == null)
            return null;

        return new OrderItemDTO(
                item.getProductName(),
                item.getQuantity(),
                item.getPrice());
    }

    public static OrderItem fromOrderItemDTO(OrderItemDTO dto, Order order) {
        if (dto == null)
            return null;

        OrderItem item = new OrderItem();
        item.setProductName(dto.getProductName());
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setOrder(order);
        return item;
    }

    public static void updateFromDTO(Order order, UpdateOrderDTO dto) {
        if (dto.getCompleted() != null)
            order.setCompleted(dto.getCompleted());
    }
}
