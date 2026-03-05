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
    @DisplayName("audit fields are null initially before persistence")
    void auditFieldsAreNullInitially() {
        Product product = new Product();
        assertThat(product.getCreatedAt()).isNull();
        assertThat(product.getUpdatedAt()).isNull();
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
