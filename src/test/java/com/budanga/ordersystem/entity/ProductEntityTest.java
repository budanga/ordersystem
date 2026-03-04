package com.budanga.ordersystem.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import java.time.temporal.ChronoUnit;

@DisplayName("Product Entity")
class ProductEntityTest {

    // Default values
    @Test
    @DisplayName("active defaults to true on a new instance")
    void defaultActiveIsTrue() {
        Product product = new Product();
        assertThat(product.getActive()).isTrue();
    }

    @Test
    @DisplayName("createdAt is null before prePersist is called")
    void createdAtIsNullBeforePersist() {
        Product product = new Product();
        assertThat(product.getCreationDate()).isNull();
    }

    // @PrePersist lifecycle hook
    @Test
    @DisplayName("prePersist sets createdAt to the current time")
    void prePersistSetsCreatedAt() {
        Product product = new Product();
        LocalDateTime before = LocalDateTime.now();

        product.prePersist();

        LocalDateTime after = LocalDateTime.now();
        assertThat(product.getCreationDate())
                .isAfterOrEqualTo(before)
                .isBeforeOrEqualTo(after);
    }

    @Test
    @DisplayName("prePersist sets createdAt within 1 second of now")
    void prePersistTimestampIsRecent() {
        Product product = new Product();
        product.prePersist();

        assertThat(product.getCreationDate())
                .isCloseTo(LocalDateTime.now(), within(1, ChronoUnit.SECONDS));
    }

    // Setters / getters basic contract
    @Test
    @DisplayName("setters propagate values correctly to getters")
    void settersAndGetters() {
        Product product = new Product();
        product.setName("Widget");
        product.setPrice(new BigDecimal("9.99"));
        product.setStock(50);
        product.setActive(false);

        assertThat(product.getName()).isEqualTo("Widget");
        assertThat(product.getPrice()).isEqualByComparingTo("9.99");
        assertThat(product.getStock()).isEqualTo(50);
        assertThat(product.getActive()).isFalse();
    }
}
