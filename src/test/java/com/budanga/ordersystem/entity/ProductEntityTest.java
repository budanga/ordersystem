package com.budanga.ordersystem.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Product Entity")
class ProductEntityTest {

    @Test
    @DisplayName("active defaults to true on a new instance")
    void defaultActiveIsTrue() {
        Product product = new Product();
        assertThat(product.getActive()).isTrue();
    }

    @Test
<<<<<<< Updated upstream
    @DisplayName("createdAt and updatedAt are null before being persisted by the container")
    void auditFieldsAreNullInitially() {
=======
<<<<<<< Updated upstream
    @DisplayName("createdAt is null before prePersist is called")
    void createdAtIsNullBeforePersist() {
>>>>>>> Stashed changes
        Product product = new Product();
<<<<<<< Updated upstream
        assertThat(product.getCreatedAt()).isNull();
=======
<<<<<<< Updated upstream
        assertThat(product.getCreationDate()).isNull();
>>>>>>> Stashed changes
    }

    // @PrePersist lifecycle hook
    @Test
    @DisplayName("prePersist sets createdAt to the current time")
    void prePersistSetsCreatedAt() {
        Product product = new Product();
        LocalDateTime before = LocalDateTime.now();

        product.prePersist();

        LocalDateTime after = LocalDateTime.now();
        assertThat(product.getCreatedAt())
                .isAfterOrEqualTo(before)
                .isBeforeOrEqualTo(after);
    }

    @Test
    @DisplayName("prePersist sets createdAt within 1 second of now")
    void prePersistTimestampIsRecent() {
        Product product = new Product();
        product.prePersist();

        assertThat(product.getCreatedAt())
                .isCloseTo(LocalDateTime.now(), within(1, ChronoUnit.SECONDS));
=======
<<<<<<< Updated upstream
=======
    @DisplayName("audit fields are null initially before persistence")
    void auditFieldsAreNullInitially() {
        Product product = new Product();
>>>>>>> Stashed changes
        assertThat(product.getCreatedAt()).isNull();
        assertThat(product.getUpdatedAt()).isNull();
>>>>>>> Stashed changes
    }

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
