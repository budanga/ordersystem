package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.entity.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ProductMapper")
class ProductMapperTest {

    // Helper: build a fully-populated Product entity
    private Product buildProduct(Long id, String name, BigDecimal price,
            Integer stock, Boolean active, String imageUrl, LocalDateTime createdAt) {
        Product p = new Product();
        // Reflectively set id since there is no public setter
        try {
            var field = Product.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(p, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        p.setActive(active);
        p.setImageUrl(imageUrl);
        // Reflectively set createdAt (no public setter)
        try {
            var field = Product.class.getDeclaredField("createdAt");
            field.setAccessible(true);
            field.set(p, createdAt);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return p;
    }

    // toDTO
    @Test
    @DisplayName("toDTO maps every field from entity to DTO")
    void toDTO_mapsAllFields() {
        LocalDateTime now = LocalDateTime.of(2024, 1, 15, 10, 30);
        Product product = buildProduct(1L, "Laptop", new BigDecimal("999.99"), 10, true, "img.jpg", now);

        ProductDTO dto = ProductMapper.toDTO(product);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Laptop");
        assertThat(dto.getPrice()).isEqualByComparingTo("999.99");
        assertThat(dto.getStock()).isEqualTo(10);
        assertThat(dto.getActive()).isTrue();
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getImageUrl()).isEqualTo("img.jpg");
    }

    @Test
    @DisplayName("toDTO correctly maps active=false")
    void toDTO_mapsInactiveProduct() {
        Product product = buildProduct(2L, "Discontinued", BigDecimal.TEN, 0, false, null, null);

        ProductDTO dto = ProductMapper.toDTO(product);

        assertThat(dto.getActive()).isFalse();
        assertThat(dto.getCreatedAt()).isNull();
    }

    // fromCreateDTO
    @Test
    @DisplayName("fromCreateDTO sets name, price, and stock from DTO")
    void fromCreateDTO_mapsAllFields() {
        CreateProductDTO createDTO = new CreateProductDTO("Monitor", new BigDecimal("299.50"), 25, "img.jpg");

        Product product = ProductMapper.fromCreateDTO(createDTO);

        assertThat(product.getName()).isEqualTo("Monitor");
        assertThat(product.getPrice()).isEqualByComparingTo("299.50");
        assertThat(product.getStock()).isEqualTo(25);
        assertThat(product.getImageUrl()).isEqualTo("img.jpg");
    }

    @Test
    @DisplayName("fromCreateDTO leaves id and createdAt unset (managed by JPA)")
    void fromCreateDTO_doesNotSetIdOrCreatedAt() {
        CreateProductDTO createDTO = new CreateProductDTO("Keyboard", new BigDecimal("49.99"), 100, null);

        Product product = ProductMapper.fromCreateDTO(createDTO);

        assertThat(product.getId()).isNull();
        assertThat(product.getCreatedAt()).isNull();
    }

    @Test
    @DisplayName("fromCreateDTO preserves the default active=true from the entity")
    void fromCreateDTO_activeDefaultIsTrue() {
        CreateProductDTO createDTO = new CreateProductDTO("Mouse", new BigDecimal("19.99"), 200, null);

        Product product = ProductMapper.fromCreateDTO(createDTO);

        assertThat(product.getActive()).isTrue();
    }

    // updateFromDTO
    @Test
    @DisplayName("updateFromDTO updates all fields when none are null")
    void updateFromDTO_updatesAllNonNullFields() {
        Product product = buildProduct(3L, "OldName", new BigDecimal("10.00"), 5, true, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO("NewName", new BigDecimal("20.00"), 10, false, "new.jpg");

        ProductMapper.updateFromDTO(product, updateDTO);

        assertThat(product.getName()).isEqualTo("NewName");
        assertThat(product.getPrice()).isEqualByComparingTo("20.00");
        assertThat(product.getStock()).isEqualTo(10);
        assertThat(product.getActive()).isFalse();
        assertThat(product.getImageUrl()).isEqualTo("new.jpg");
    }

    @Test
    @DisplayName("updateFromDTO does not overwrite name when it is null")
    void updateFromDTO_skipNullName() {
        Product product = buildProduct(4L, "OriginalName", new BigDecimal("5.00"), 3, true, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO(null, new BigDecimal("7.00"), null, null, null);

        ProductMapper.updateFromDTO(product, updateDTO);

        assertThat(product.getName()).isEqualTo("OriginalName");
        assertThat(product.getPrice()).isEqualByComparingTo("7.00");
        assertThat(product.getStock()).isEqualTo(3); // unchanged
        assertThat(product.getActive()).isTrue(); // unchanged
    }

    @Test
    @DisplayName("updateFromDTO does not overwrite price when it is null")
    void updateFromDTO_skipNullPrice() {
        Product product = buildProduct(5L, "Widget", new BigDecimal("50.00"), 8, true, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO("Widget Pro", null, 12, null, null);

        ProductMapper.updateFromDTO(product, updateDTO);

        assertThat(product.getName()).isEqualTo("Widget Pro");
        assertThat(product.getPrice()).isEqualByComparingTo("50.00"); // unchanged
        assertThat(product.getStock()).isEqualTo(12);
    }

    @Test
    @DisplayName("updateFromDTO does not overwrite stock when it is null")
    void updateFromDTO_skipNullStock() {
        Product product = buildProduct(6L, "Gadget", new BigDecimal("15.00"), 20, true, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO(null, null, null, false, null);

        ProductMapper.updateFromDTO(product, updateDTO);

        assertThat(product.getStock()).isEqualTo(20); // unchanged
        assertThat(product.getActive()).isFalse();
    }

    @Test
    @DisplayName("updateFromDTO does not overwrite active when it is null")
    void updateFromDTO_skipNullActive() {
        Product product = buildProduct(7L, "Tool", new BigDecimal("8.00"), 15, false, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO(null, null, null, null, null);

        ProductMapper.updateFromDTO(product, updateDTO);

        // Nothing changed
        assertThat(product.getName()).isEqualTo("Tool");
        assertThat(product.getPrice()).isEqualByComparingTo("8.00");
        assertThat(product.getStock()).isEqualTo(15);
        assertThat(product.getActive()).isFalse();
    }

    @Test
    @DisplayName("updateFromDTO can flip active from false to true")
    void updateFromDTO_flipsActiveToTrue() {
        Product product = buildProduct(8L, "Retired", new BigDecimal("1.00"), 0, false, null, null);
        UpdateProductDTO updateDTO = new UpdateProductDTO(null, null, null, true, null);

        ProductMapper.updateFromDTO(product, updateDTO);

        assertThat(product.getActive()).isTrue();
    }
}
