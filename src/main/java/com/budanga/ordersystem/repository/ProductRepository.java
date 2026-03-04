package com.budanga.ordersystem.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.budanga.ordersystem.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByName(String name);

    List<Product> findByActiveTrue();

    List<Product> findByPriceLessThan(BigDecimal price);

    List<Product> findByPriceGreaterThan(BigDecimal price);

    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);

    List<Product> findByStockLessThan(Integer stock);

    List<Product> findByStockGreaterThan(Integer stock);

    List<Product> findAllByOrderByPriceDesc();

    List<Product> findByCreatedAtBefore(LocalDateTime date);

    List<Product> findByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true")
    Long countActiveProducts();

    @Query("SELECT AVG(p.price) FROM Product p")
    BigDecimal averagePrice();

    @Query("SELECT SUM(p.stock) FROM Product p")
    Long totalStock();
}