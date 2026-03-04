package com.budanga.ordersystem.repository;

import com.budanga.ordersystem.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ProductRepository.
 *
 * Uses @SpringBootTest to load the full application context backed by H2
 * (configured in application-test.properties). Every test method runs inside
 * a transaction that is automatically rolled back after the test, so each
 * method starts with a clean database state without manual cleanup.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("ProductRepository (integration)")
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    // Fixture builder — delegates to @PrePersist via JPA lifecycle
    private Product save(String name, BigDecimal price, Integer stock, Boolean active) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        p.setActive(active);
        return productRepository.saveAndFlush(p);
    }

    // findByName
    @Nested
    @DisplayName("findByName")
    class FindByName {

        @Test
        @DisplayName("returns product when name matches exactly")
        void found_whenNameMatches() {
            save("Laptop", new BigDecimal("999.99"), 10, true);

            Optional<Product> result = productRepository.findByName("Laptop");

            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Laptop");
        }

        @Test
        @DisplayName("returns empty when name does not match")
        void empty_whenNameDoesNotMatch() {
            save("Laptop", new BigDecimal("999.99"), 10, true);

            Optional<Product> result = productRepository.findByName("Tablet");

            assertThat(result).isEmpty();
        }
    }

    // findByActiveTrue
    @Nested
    @DisplayName("findByActiveTrue")
    class FindByActiveTrue {

        @Test
        @DisplayName("returns only active products")
        void returnsOnlyActive() {
            save("Active Product", new BigDecimal("10.00"), 5, true);
            save("Inactive Product", new BigDecimal("20.00"), 3, false);

            List<Product> results = productRepository.findByActiveTrue();

            assertThat(results).hasSize(1);
            assertThat(results.get(0).getActive()).isTrue();
        }

        @Test
        @DisplayName("returns empty list when no active products exist")
        void empty_whenNoActiveProducts() {
            save("Inactive", new BigDecimal("5.00"), 1, false);

            assertThat(productRepository.findByActiveTrue()).isEmpty();
        }
    }

    // Price queries
    @Nested
    @DisplayName("price queries")
    class PriceQueries {

        @BeforeEach
        void seedPrices() {
            save("Cheap", new BigDecimal("5.00"), 10, true);
            save("Mid", new BigDecimal("50.00"), 10, true);
            save("Expensive", new BigDecimal("500.00"), 10, true);
        }

        @Test
        @DisplayName("findByPriceGreaterThan returns products above the threshold")
        void findByPriceGreaterThan() {
            List<Product> results = productRepository.findByPriceGreaterThan(new BigDecimal("49.99"));

            assertThat(results).hasSize(2)
                    .extracting(Product::getName)
                    .containsExactlyInAnyOrder("Mid", "Expensive");
        }

        @Test
        @DisplayName("findByPriceLessThan returns products below the threshold")
        void findByPriceLessThan() {
            List<Product> results = productRepository.findByPriceLessThan(new BigDecimal("50.00"));

            assertThat(results).hasSize(1)
                    .extracting(Product::getName)
                    .containsExactly("Cheap");
        }

        @Test
        @DisplayName("findByPriceBetween returns products within the range (inclusive)")
        void findByPriceBetween() {
            List<Product> results = productRepository.findByPriceBetween(
                    new BigDecimal("5.00"), new BigDecimal("50.00"));

            assertThat(results).hasSize(2)
                    .extracting(Product::getName)
                    .containsExactlyInAnyOrder("Cheap", "Mid");
        }

        @Test
        @DisplayName("findByPriceBetween returns empty when no products are in range")
        void findByPriceBetween_empty() {
            List<Product> results = productRepository.findByPriceBetween(
                    new BigDecimal("1000.00"), new BigDecimal("2000.00"));

            assertThat(results).isEmpty();
        }
    }

    // Stock queries
    @Nested
    @DisplayName("stock queries")
    class StockQueries {

        @BeforeEach
        void seedStock() {
            save("LowStock", new BigDecimal("10.00"), 2, true);
            save("MidStock", new BigDecimal("10.00"), 10, true);
            save("HighStock", new BigDecimal("10.00"), 100, true);
        }

        @Test
        @DisplayName("findByStockGreaterThan returns products with stock above threshold")
        void findByStockGreaterThan() {
            List<Product> results = productRepository.findByStockGreaterThan(9);

            assertThat(results).hasSize(2)
                    .extracting(Product::getName)
                    .containsExactlyInAnyOrder("MidStock", "HighStock");
        }

        @Test
        @DisplayName("findByStockLessThan returns products with stock below threshold")
        void findByStockLessThan() {
            List<Product> results = productRepository.findByStockLessThan(10);

            assertThat(results).hasSize(1)
                    .extracting(Product::getName)
                    .containsExactly("LowStock");
        }
    }

    // Date queries
    @Nested
    @DisplayName("date queries (createdAt)")
    class DateQueries {

        private Product oldProduct;
        private LocalDateTime cutoff;
        private Product recentProduct;

        @BeforeEach
        void seedDates() throws InterruptedException {
            oldProduct = save("OldProduct", BigDecimal.ONE, 1, true);
            productRepository.flush();

            // Capture a cutoff timestamp slightly after the first save
            Thread.sleep(10);
            cutoff = LocalDateTime.now();
            Thread.sleep(10);

            recentProduct = save("RecentProduct", BigDecimal.TEN, 1, true);
            productRepository.flush();
        }

        @Test
        @DisplayName("findByCreatedAtBefore returns products created before the cutoff")
        void findByCreatedAtBefore() {
            List<Product> results = productRepository.findByCreatedAtBefore(cutoff);

            assertThat(results)
                    .extracting(Product::getName)
                    .containsExactly("OldProduct");
        }

        @Test
        @DisplayName("findByCreatedAtAfter returns products created after the cutoff")
        void findByCreatedAtAfter() {
            List<Product> results = productRepository.findByCreatedAtAfter(cutoff);

            assertThat(results)
                    .extracting(Product::getName)
                    .containsExactly("RecentProduct");
        }
    }

    // Ordering
    @Nested
    @DisplayName("findAllByOrderByPriceDesc")
    class OrderByPrice {

        @Test
        @DisplayName("returns products sorted by price descending")
        void sortedDescending() {
            save("Cheap", new BigDecimal("10.00"), 1, true);
            save("Mid", new BigDecimal("50.00"), 1, true);
            save("Expensive", new BigDecimal("200.00"), 1, true);

            List<Product> results = productRepository.findAllByOrderByPriceDesc();

            assertThat(results).hasSize(3);
            assertThat(results.get(0).getPrice()).isEqualByComparingTo("200.00");
            assertThat(results.get(1).getPrice()).isEqualByComparingTo("50.00");
            assertThat(results.get(2).getPrice()).isEqualByComparingTo("10.00");
        }

        @Test
        @DisplayName("returns empty list when no products exist")
        void empty_whenNoProducts() {
            assertThat(productRepository.findAllByOrderByPriceDesc()).isEmpty();
        }
    }

    // Aggregate @Query methods
    @Nested
    @DisplayName("aggregate queries")
    class Aggregates {

        @Test
        @DisplayName("countActiveProducts returns the number of active products")
        void countActiveProducts() {
            save("Active1", new BigDecimal("10.00"), 5, true);
            save("Active2", new BigDecimal("20.00"), 3, true);
            save("Inactive", new BigDecimal("30.00"), 1, false);

            Long count = productRepository.countActiveProducts();

            assertThat(count).isEqualTo(2L);
        }

        @Test
        @DisplayName("countActiveProducts returns 0 when no active products exist")
        void countActiveProducts_zero() {
            save("Inactive", new BigDecimal("10.00"), 1, false);

            assertThat(productRepository.countActiveProducts()).isEqualTo(0L);
        }

        @Test
        @DisplayName("averagePrice returns the correct average across all products")
        void averagePrice() {
            save("P1", new BigDecimal("10.00"), 1, true);
            save("P2", new BigDecimal("20.00"), 1, true);
            save("P3", new BigDecimal("30.00"), 1, false);

            // (10 + 20 + 30) / 3 = 20.00
            BigDecimal avg = productRepository.averagePrice();

            assertThat(avg).isEqualByComparingTo("20.00");
        }

        @Test
        @DisplayName("averagePrice returns null when table is empty")
        void averagePrice_nullWhenEmpty() {
            assertThat(productRepository.averagePrice()).isNull();
        }

        @Test
        @DisplayName("totalStock returns the sum of stock across all products")
        void totalStock() {
            save("P1", new BigDecimal("1.00"), 10, true);
            save("P2", new BigDecimal("2.00"), 20, false);
            save("P3", new BigDecimal("3.00"), 5, true);

            Long total = productRepository.totalStock();

            assertThat(total).isEqualTo(35L);
        }

        @Test
        @DisplayName("totalStock returns null when table is empty")
        void totalStock_nullWhenEmpty() {
            assertThat(productRepository.totalStock()).isNull();
        }
    }
}
