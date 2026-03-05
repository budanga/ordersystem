package com.budanga.ordersystem.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.budanga.ordersystem.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByCompletedTrue(Pageable pageable);

    Page<Order> findByCompletedFalse(Pageable pageable);

    List<Order> findByCustomerName(String name);

    List<Order> findByTotalAmountLessThan(BigDecimal totalAmount);

    List<Order> findByTotalAmountGreaterThan(BigDecimal totalAmount);

    List<Order> findAllByOrderByTotalAmountDesc();

    List<Order> findAllByOrderByTotalAmountAsc();

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Order> findByCreatedAtBefore(LocalDateTime date);

    List<Order> findByCreatedAtAfter(LocalDateTime date);

    List<Order> findByOrderItemsProductNameContaining(String productName);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.completed = true")
    Long countCompletedOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.completed = false")
    Long countUncompletedOrders();

    @Query("SELECT AVG(o.totalAmount) FROM Order o")
    BigDecimal getAverageTotalAmount();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.completed = true")
    BigDecimal getTotalRevenue();
}
