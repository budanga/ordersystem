package com.budanga.ordersystem.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.budanga.ordersystem.dto.CreateOrderDTO;
import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderDTO createOrder(@Valid @RequestBody CreateOrderDTO createDTO) {
        return orderService.createOrder(createDTO);
    }

    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}")
    public OrderDTO updateOrder(@PathVariable("id") Long orderId, @Valid @RequestBody UpdateOrderDTO updateDTO) {
        return orderService.updateOrder(orderId, updateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/uncompleted")
    public List<OrderDTO> getUncompletedOrders() {
        return orderService.getUncompletedOrders();
    }

    @GetMapping("/completed")
    public List<OrderDTO> getCompletedOrders() {
        return orderService.getCompletedOrders();
    }

    @GetMapping("/customer")
    public List<OrderDTO> getOrdersByCustomerName(@RequestParam String customerName) {
        return orderService.getOrdersByCustomer(customerName);
    }

    @GetMapping("/totalamount/less")
    public List<OrderDTO> getOrdersByTotalAmountLessThan(@RequestParam BigDecimal totalAmount) {
        return orderService.getOrdersByTotalAmountLessThan(totalAmount);
    }

    @GetMapping("/totalamount/more")
    public List<OrderDTO> getOrdersByTotalAmountGreaterThan(@RequestParam BigDecimal totalAmount) {
        return orderService.getOrdersByTotalAmountGreaterThan(totalAmount);
    }

    @GetMapping("/totalamount/desc")
    public List<OrderDTO> getOrdersByTotalAmountDesc() {
        return orderService.getOrdersByTotalAmountDesc();
    }

    @GetMapping("/totalamount/asc")
    public List<OrderDTO> getOrdersByTotalAmountAsc() {
        return orderService.getOrdersByTotalAmountAsc();
    }

    @GetMapping("/created/between")
    public List<OrderDTO> getOrdersByCreatedAtBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return orderService.getOrdersByCreatedAtBetween(start, end);
    }

    @GetMapping("/created/before")
    public List<OrderDTO> getOrdersByCreatedAtBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return orderService.getOrdersByCreatedAtBefore(date);
    }

    @GetMapping("/created/after")
    public List<OrderDTO> getOrdersByCreatedAtAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return orderService.getOrdersByCreatedAtAfter(date);
    }

    @GetMapping("/search/item")
    public List<OrderDTO> getOrdersByProductName(@RequestParam String productName) {
        return orderService.getOrdersByProductName(productName);
    }

    @GetMapping("/completed/count")
    public Long countCompletedOrders() {
        return orderService.countCompletedOrders();
    }

    @GetMapping("/uncompleted/count")
    public Long countUncompletedOrders() {
        return orderService.countUncompletedOrders();
    }

    @PatchMapping("/{id}/complete")
    public OrderDTO markOrderAsCompleted(@PathVariable("id") Long orderId) {
        return orderService.markAsCompleted(orderId);
    }

    @PatchMapping("/{id}/uncomplete")
    public OrderDTO markOrderAsUncompleted(@PathVariable("id") Long orderId) {
        return orderService.markAsUncompleted(orderId);
    }

    @GetMapping("/stats/average")
    public BigDecimal getOrdersAverageAmount() {
        return orderService.getAverageTotalAmount();
    }

    @GetMapping("/stats/revenue")
    public BigDecimal getOrdersTotalRevenue() {
        return orderService.getTotalRevenue();
    }
}
