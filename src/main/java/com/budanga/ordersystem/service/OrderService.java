package com.budanga.ordersystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.budanga.ordersystem.dto.CreateOrderDTO;
import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.exception.ResourceNotFoundException;
import com.budanga.ordersystem.mapper.OrderMapper;
import com.budanga.ordersystem.repository.OrderRepository;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderDTO createOrder(CreateOrderDTO createDTO) {
        // Convert the DTO to an entity
        Order order = OrderMapper.fromCreateDTO(createDTO);

        // Save the product to the database
        Order savedOrder = orderRepository.save(order);

        // Return the saved product converted to DTO
        return OrderMapper.toDTO(savedOrder);
    }

    public OrderDTO updateOrder(Long orderId, UpdateOrderDTO updateDTO) {
        // Check if the order exists
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        // Apply the changes from the DTO to the entity
        OrderMapper.updateFromDTO(order, updateDTO);

        // Save the updated order to the database
        Order savedOrder = orderRepository.save(order);

        // Return the updated order converted to DTO
        return OrderMapper.toDTO(savedOrder);
    }

    public void deleteOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        if (order.getCompleted()) {
            throw new IllegalStateException("Completed orders cannot be deleted.");
        }

        orderRepository.delete(order);
    }

    public OrderDTO getOrderById(Long orderId) {
        // Check if the order exists
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        return OrderMapper.toDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        return mapToDTOList(orderRepository.findAll());
    }

    public List<OrderDTO> getCompletedOrders() {
        return mapToDTOList(orderRepository.findByCompletedTrue());
    }

    public List<OrderDTO> getUncompletedOrders() {
        return mapToDTOList(orderRepository.findByCompletedFalse());
    }

    public List<OrderDTO> getOrdersByCustomer(String customerName) {
        return mapToDTOList(orderRepository.findByCustomerName(customerName));
    }

    public List<OrderDTO> getOrdersByTotalAmountLessThan(BigDecimal totalAmount) {
        return mapToDTOList(orderRepository.findByTotalAmountLessThan(totalAmount));
    }

    public List<OrderDTO> getOrdersByTotalAmountGreaterThan(BigDecimal totalAmount) {
        return mapToDTOList(orderRepository.findByTotalAmountGreaterThan(totalAmount));
    }

    public List<OrderDTO> getOrdersByTotalAmountDesc() {
        return mapToDTOList(orderRepository.findAllByOrderByTotalAmountDesc());
    }

    public List<OrderDTO> getOrdersByTotalAmountAsc() {
        return mapToDTOList(orderRepository.findAllByOrderByTotalAmountAsc());
    }

    public List<OrderDTO> getOrdersByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return mapToDTOList(orderRepository.findByCreatedAtBetween(start, end));
    }

    public List<OrderDTO> getOrdersByCreatedAtBefore(LocalDateTime date) {
        return mapToDTOList(orderRepository.findByCreatedAtBefore(date));
    }

    public List<OrderDTO> getOrdersByCreatedAtAfter(LocalDateTime date) {
        return mapToDTOList(orderRepository.findByCreatedAtAfter(date));
    }

    public List<OrderDTO> getOrdersByProductName(String productName) {
        return mapToDTOList(orderRepository.findByOrderItemsProductNameContaining(productName));
    }

    public Long countCompletedOrders() {
        return orderRepository.countCompletedOrders();
    }

    public Long countUncompletedOrders() {
        return orderRepository.countUncompletedOrders();
    }

    public BigDecimal getAverageTotalAmount() {
        BigDecimal average = orderRepository.getAverageTotalAmount();
        if (average != null)
            return average;
        else
            return BigDecimal.ZERO;
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = orderRepository.getTotalRevenue();
        if (revenue != null)
            return revenue;
        else
            return BigDecimal.ZERO;
    }

    public OrderDTO markAsCompleted(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
        order.setCompleted(true);
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    public OrderDTO markAsUncompleted(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found."));
        order.setCompleted(false);
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    private final List<OrderDTO> mapToDTOList(List<Order> orders) {
        // Convert each order entity to a DTO
        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order o : orders)
            dtoList.add(OrderMapper.toDTO(o));
        return dtoList;
    }
}
