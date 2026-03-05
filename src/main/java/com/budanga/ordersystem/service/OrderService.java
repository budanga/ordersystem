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

import jakarta.transaction.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderDTO createDTO) {

        Order order = new Order();
        order.setCustomerName(createDTO.getCustomerName());
        order.setCompleted(false);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : createDTO.getOrderItems()) {
            Product product = productRepository
                    .findByName(itemDTO.getProductName())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemDTO.getProductName()));

            if (product.getStock() < itemDTO.getQuantity())
                throw new IllegalStateException("Not enough stock for product: " + product.getName());

            product.setStock(product.getStock() - itemDTO.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);

            orderItems.add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

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

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);

        return orderPage.map(OrderMapper::toDTO);
    }

    public Page<OrderDTO> getCompletedOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByCompletedTrue(pageable);

        return orderPage.map(OrderMapper::toDTO);
    }

    public Page<OrderDTO> getUncompletedOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByCompletedFalse(pageable);

        return orderPage.map(OrderMapper::toDTO);
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
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));
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
