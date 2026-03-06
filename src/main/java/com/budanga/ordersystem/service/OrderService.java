package com.budanga.ordersystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.budanga.ordersystem.dto.CreateOrderDTO;
import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.OrderItemDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;
import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.exception.ResourceNotFoundException;
import com.budanga.ordersystem.mapper.OrderMapper;
import com.budanga.ordersystem.repository.OrderRepository;
import com.budanga.ordersystem.repository.ProductRepository;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.entity.NotificationType;

import jakarta.transaction.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, 
                        OrderMapper orderMapper, NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderMapper = orderMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderDTO createDTO, User user) {

        Order order = new Order();
        order.setCustomerName(createDTO.getCustomerName());
        order.setUser(user);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : createDTO.getOrderItems()) {
            Product product = productRepository
                    .findByName(itemDTO.getProductName())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemDTO.getProductName()));

            if (product.getStock() < itemDTO.getQuantity())
                throw new IllegalStateException("Not enough stock for product: " + product.getName());

            product.setStock(product.getStock() - itemDTO.getQuantity());

            // Low stock notification
            if (product.getStock() < 5) {
                notificationService.createNotification(user, NotificationType.LOW_STOCK, 
                    "Limited stock alert! " + product.getName() + " has only " + product.getStock() + " units left.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductName(product.getName());
            orderItem.setProductImageUrl(product.getImageUrl());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);
            orderItem.setProduct(product);

            orderItems.add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Notify user
        notificationService.createNotification(user, NotificationType.ORDER_SUCCESS, 
            "Your order #" + savedOrder.getId() + " has been confirmed! We are now preparing your package for shipment.");

        return orderMapper.toDTO(savedOrder);
    }

    public OrderDTO updateOrder(Long orderId, UpdateOrderDTO updateDTO, User user) {
        // Check if the order exists
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        // Apply the changes from the DTO to the entity
        orderMapper.updateFromDTO(order, updateDTO);

        // Save the updated order to the database
        Order savedOrder = orderRepository.save(order);

        // Return the updated order converted to DTO
        return orderMapper.toDTO(savedOrder);
    }

    public void deleteOrder(Long orderId, User user) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        if (order.getCompleted() != null && order.getCompleted()) {
            throw new IllegalStateException("Completed orders cannot be deleted.");
        }

        orderRepository.delete(order);

        // Notify user if they are the owner or an admin
        if (order.getUser() != null) {
            notificationService.createNotification(order.getUser(), NotificationType.ORDER_CANCELLED, 
                "Order #" + order.getId() + " cancelled: The order has been removed from our system.");
        }
    }

    public OrderDTO getOrderById(Long orderId) {
        // Check if the order exists
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        return orderMapper.toDTO(order);
    }

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);

        return orderPage.map(orderMapper::toDTO);
    }

    public Page<OrderDTO> getCompletedOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByCompletedTrue(pageable);

        return orderPage.map(orderMapper::toDTO);
    }

    public Page<OrderDTO> getUncompletedOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByCompletedFalse(pageable);

        return orderPage.map(orderMapper::toDTO);
    }

    public List<OrderDTO> getOrdersByCustomer(String customerName) {
        return orderMapper.toDTOList(orderRepository.findByCustomerName(customerName));
    }

    public List<OrderDTO> getOrdersByTotalAmountLessThan(BigDecimal totalAmount) {
        return orderMapper.toDTOList(orderRepository.findByTotalAmountLessThan(totalAmount));
    }

    public List<OrderDTO> getOrdersByTotalAmountGreaterThan(BigDecimal totalAmount) {
        return orderMapper.toDTOList(orderRepository.findByTotalAmountGreaterThan(totalAmount));
    }

    public List<OrderDTO> getOrdersByTotalAmountDesc() {
        return orderMapper.toDTOList(orderRepository.findAllByOrderByTotalAmountDesc());
    }

    public List<OrderDTO> getOrdersByTotalAmountAsc() {
        return orderMapper.toDTOList(orderRepository.findAllByOrderByTotalAmountAsc());
    }

    public List<OrderDTO> getOrdersByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return orderMapper.toDTOList(orderRepository.findByCreatedAtBetween(start, end));
    }

    public List<OrderDTO> getOrdersByCreatedAtBefore(LocalDateTime date) {
        return orderMapper.toDTOList(orderRepository.findByCreatedAtBefore(date));
    }

    public List<OrderDTO> getOrdersByCreatedAtAfter(LocalDateTime date) {
        return orderMapper.toDTOList(orderRepository.findByCreatedAtAfter(date));
    }

    public List<OrderDTO> getOrdersByProductName(String productName) {
        return orderMapper.toDTOList(orderRepository.findByOrderItemsProductNameContaining(productName));
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

    public OrderDTO markAsCompleted(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
        order.setCompleted(true);
        Order savedOrder = orderRepository.save(order);

        if (savedOrder.getUser() != null) {
            notificationService.createNotification(savedOrder.getUser(), NotificationType.ORDER_COMPLETED, 
                "Order #" + savedOrder.getId() + " Completed: Your order has been delivered!");
        }

        return orderMapper.toDTO(savedOrder);
    }

    public OrderDTO markAsUncompleted(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
        order.setCompleted(false);
        return orderMapper.toDTO(orderRepository.save(order));
    }
}
