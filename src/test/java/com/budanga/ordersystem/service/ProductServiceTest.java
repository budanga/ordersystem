package com.budanga.ordersystem.service;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.exception.ResourceNotFoundException;
import com.budanga.ordersystem.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    // Shared fixtures
    /** Creates a minimal Product with a fixed id, simulating a persisted entity. */
    private Product buildPersistedProduct(Long id, String name, BigDecimal price,
            Integer stock, String category, Boolean active, String imageUrl) {
        Product p = new Product();
        try {
            var field = Product.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(p, id);
            var createdAtField = Product.class.getDeclaredField("createdAt");
            createdAtField.setAccessible(true);
            createdAtField.set(p, LocalDateTime.of(2024, 1, 1, 0, 0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        p.setCategory(category);
        p.setActive(active);
        p.setImageUrl(imageUrl);
        return p;
    }

    // createProduct
    @Nested
    @DisplayName("createProduct")
    class CreateProduct {

        @Test
        @DisplayName("persists and returns DTO when name is unique")
        void success_whenNameIsUnique() {
            CreateProductDTO dto = new CreateProductDTO("Laptop", new BigDecimal("999.99"), 10, "Laptops",
                    "laptop.jpg");
            Product saved = buildPersistedProduct(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true,
                    "laptop.jpg");

            when(productRepository.findByName("Laptop")).thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(saved);

            ProductDTO result = productService.createProduct(dto);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getName()).isEqualTo("Laptop");
            assertThat(result.getPrice()).isEqualByComparingTo("999.99");
            assertThat(result.getStock()).isEqualTo(10);
            assertThat(result.getActive()).isTrue();
            assertThat(result.getImageUrl()).isEqualTo("laptop.jpg");

            // Verify that save was called once
            verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("throws IllegalArgumentException when name already exists")
        void throws_whenNameAlreadyExists() {
            CreateProductDTO dto = new CreateProductDTO("Laptop", new BigDecimal("999.99"), 10, "Laptops", null);
            Product existing = buildPersistedProduct(99L, "Laptop", new BigDecimal("500.00"), 5, "Laptops", true, null);

            when(productRepository.findByName("Laptop")).thenReturn(Optional.of(existing));

            assertThatThrownBy(() -> productService.createProduct(dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("already exists");

            // save must never be called on a duplicate name
            verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("the product saved has the correct name from the DTO")
        void savedProductHasCorrectName() {
            CreateProductDTO dto = new CreateProductDTO("Monitor", new BigDecimal("300.00"), 5, "Electronics", null);
            Product saved = buildPersistedProduct(2L, "Monitor", new BigDecimal("300.00"), 5, "Electronics", true,
                    null);

            when(productRepository.findByName("Monitor")).thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(saved);

            ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
            productService.createProduct(dto);

            verify(productRepository).save(captor.capture());
            assertThat(captor.getValue().getName()).isEqualTo("Monitor");
        }
    }

    // updateProduct
    @Nested
    @DisplayName("updateProduct")
    class UpdateProduct {

        @Test
        @DisplayName("updates and returns DTO when product exists and name is free")
        void success_whenProductExistsAndNameIsFree() {
            Product existing = buildPersistedProduct(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true,
                    "old.jpg");
            UpdateProductDTO updateDTO = new UpdateProductDTO("Laptop Pro", new BigDecimal("1099.99"), 8, true,
                    "Laptops",
                    "new.jpg");
            Product updated = buildPersistedProduct(1L, "Laptop Pro", new BigDecimal("1099.99"), 8, "Laptops", true,
                    "new.jpg");

            when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(productRepository.findByName("Laptop Pro")).thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(updated);

            ProductDTO result = productService.updateProduct(1L, updateDTO);

            assertThat(result.getName()).isEqualTo("Laptop Pro");
            assertThat(result.getPrice()).isEqualByComparingTo("1099.99");
            assertThat(result.getImageUrl()).isEqualTo("new.jpg");
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when product id does not exist")
        void throws_whenProductNotFound() {
            when(productRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.updateProduct(999L, new UpdateProductDTO()))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("not found");
        }

        @Test
        @DisplayName("throws when new name conflicts with another product")
        void throws_whenNewNameConflictsWithAnotherProduct() {
            Product existing = buildPersistedProduct(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true, null);
            Product conflict = buildPersistedProduct(2L, "Monitor", new BigDecimal("300.00"), 5, "Electronics", true,
                    null);
            UpdateProductDTO updateDTO = new UpdateProductDTO("Monitor", null, null, null, null, null);

            when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(productRepository.findByName("Monitor")).thenReturn(Optional.of(conflict));

            assertThatThrownBy(() -> productService.updateProduct(1L, updateDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("already exists");

            verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("does not check name collision when name is unchanged")
        void doesNotCheckNameCollision_whenNameUnchanged() {
            Product existing = buildPersistedProduct(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true, null);
            UpdateProductDTO updateDTO = new UpdateProductDTO("Laptop", new BigDecimal("899.99"), null, null, null,
                    null);

            when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(productRepository.save(any(Product.class))).thenReturn(existing);

            productService.updateProduct(1L, updateDTO);

            // findByName must NOT be called because the name did not change
            verify(productRepository, never()).findByName(any());
        }

        @Test
        @DisplayName("does not check name collision when name is null in update DTO")
        void doesNotCheckNameCollision_whenNameIsNull() {
            Product existing = buildPersistedProduct(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true, null);
            UpdateProductDTO updateDTO = new UpdateProductDTO(null, new BigDecimal("799.99"), null, null, null, null);

            when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(productRepository.save(any(Product.class))).thenReturn(existing);

            productService.updateProduct(1L, updateDTO);

            verify(productRepository, never()).findByName(any());
        }
    }

    // getProductById
    @Nested
    @DisplayName("getProductById")
    class GetProductById {

        @Test
        @DisplayName("returns DTO when product exists")
        void success_whenProductExists() {
            Product product = buildPersistedProduct(5L, "Keyboard", new BigDecimal("79.99"), 50, "Electronics", true,
                    "key.jpg");
            when(productRepository.findById(5L)).thenReturn(Optional.of(product));

            ProductDTO result = productService.getProductById(5L);

            assertThat(result.getId()).isEqualTo(5L);
            assertThat(result.getName()).isEqualTo("Keyboard");
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when product does not exist")
        void throws_whenProductNotFound() {
            when(productRepository.findById(42L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.getProductById(42L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("not found");
        }
    }

    // List / filter methods
    @Nested
    @DisplayName("list and filter methods")
    class ListAndFilter {

        private final Product p1 = buildPersistedProduct(1L, "A", new BigDecimal("10.00"), 5, "Cat1", true, "a.jpg");
        private final Product p2 = buildPersistedProduct(2L, "B", new BigDecimal("20.00"), 3, "Cat2", false, "b.jpg");

        @Test
        @DisplayName("getAllProducts returns all products as DTOs")
        void getAllProducts_returnsAllProducts() {
            when(productRepository.findAll()).thenReturn(List.of(p1, p2));

            List<ProductDTO> results = productService.getAllProducts();

            assertThat(results).hasSize(2);
            assertThat(results).extracting(ProductDTO::getName).containsExactly("A", "B");
        }

        @Test
        @DisplayName("getAllActiveProducts delegates to findByActiveTrue")
        void getAllActiveProducts_returnsOnlyActiveProducts() {
            when(productRepository.findByActiveTrue()).thenReturn(List.of(p1));

            List<ProductDTO> results = productService.getAllActiveProducts();

            assertThat(results).hasSize(1);
            assertThat(results.get(0).getActive()).isTrue();
        }

        @Test
        @DisplayName("getProductsByPriceBetween delegates with correct bounds")
        void getProductsByPriceBetween() {
            BigDecimal min = new BigDecimal("5.00");
            BigDecimal max = new BigDecimal("15.00");
            when(productRepository.findByPriceBetween(min, max)).thenReturn(List.of(p1));

            List<ProductDTO> results = productService.getProductsByPriceBetween(min, max);

            assertThat(results).hasSize(1);
            verify(productRepository).findByPriceBetween(min, max);
        }

        @Test
        @DisplayName("getProductsCheaperThan delegates to findByPriceLessThan")
        void getProductsCheaperThan() {
            BigDecimal threshold = new BigDecimal("15.00");
            when(productRepository.findByPriceLessThan(threshold)).thenReturn(List.of(p1));

            List<ProductDTO> results = productService.getProductsCheaperThan(threshold);

            assertThat(results).hasSize(1);
            verify(productRepository).findByPriceLessThan(threshold);
        }

        @Test
        @DisplayName("getProductsMoreExpensiveThan delegates to findByPriceGreaterThan")
        void getProductsMoreExpensiveThan() {
            BigDecimal threshold = new BigDecimal("15.00");
            when(productRepository.findByPriceGreaterThan(threshold)).thenReturn(List.of(p2));

            List<ProductDTO> results = productService.getProductsMoreExpensiveThan(threshold);

            assertThat(results).hasSize(1);
            verify(productRepository).findByPriceGreaterThan(threshold);
        }

        @Test
        @DisplayName("getProductsWithStockLessThan delegates to findByStockLessThan")
        void getProductsWithStockLessThan() {
            when(productRepository.findByStockLessThan(4)).thenReturn(List.of(p2));

            List<ProductDTO> results = productService.getProductsWithStockLessThan(4);

            assertThat(results).hasSize(1);
            verify(productRepository).findByStockLessThan(4);
        }

        @Test
        @DisplayName("getProductsWithStockGreaterThan delegates to findByStockGreaterThan")
        void getProductsWithStockGreaterThan() {
            when(productRepository.findByStockGreaterThan(4)).thenReturn(List.of(p1));

            List<ProductDTO> results = productService.getProductsWithStockGreaterThan(4);

            assertThat(results).hasSize(1);
            verify(productRepository).findByStockGreaterThan(4);
        }

        @Test
        @DisplayName("getProductsCreatedBefore delegates to findByCreatedAtBefore")
        void getProductsCreatedBefore() {
            LocalDateTime cutoff = LocalDateTime.of(2025, 1, 1, 0, 0);
            when(productRepository.findByCreatedAtBefore(cutoff)).thenReturn(List.of(p1));

            List<ProductDTO> results = productService.getProductsCreatedBefore(cutoff);

            assertThat(results).hasSize(1);
            verify(productRepository).findByCreatedAtBefore(cutoff);
        }

        @Test
        @DisplayName("getProductsCreatedAfter delegates to findByCreatedAtAfter")
        void getProductsCreatedAfter() {
            LocalDateTime cutoff = LocalDateTime.of(2023, 6, 1, 0, 0);
            when(productRepository.findByCreatedAtAfter(cutoff)).thenReturn(List.of(p1, p2));

            List<ProductDTO> results = productService.getProductsCreatedAfter(cutoff);

            assertThat(results).hasSize(2);
            verify(productRepository).findByCreatedAtAfter(cutoff);
        }

        @Test
        @DisplayName("getAllProductsOrderByPriceDesc delegates to findAllByOrderByPriceDesc")
        void getAllProductsOrderByPriceDesc() {
            // Return products already sorted descending
            when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(p2, p1));

            List<ProductDTO> results = productService.getAllProductsOrderByPriceDesc();

            assertThat(results).hasSize(2);
            assertThat(results.get(0).getPrice()).isGreaterThan(results.get(1).getPrice());
            verify(productRepository).findAllByOrderByPriceDesc();
        }

        @Test
        @DisplayName("list methods return empty list when repository returns nothing")
        void returnsEmptyList_whenRepositoryEmpty() {
            when(productRepository.findAll()).thenReturn(List.of());

            assertThat(productService.getAllProducts()).isEmpty();
        }
    }

    // Aggregate methods
    @Nested
    @DisplayName("aggregate methods")
    class Aggregates {

        @Test
        @DisplayName("countActiveProducts delegates to repository and returns value")
        void countActiveProducts() {
            when(productRepository.countActiveProducts()).thenReturn(7L);

            assertThat(productService.countActiveProducts()).isEqualTo(7L);
            verify(productRepository).countActiveProducts();
        }

        @Test
        @DisplayName("averagePrice delegates to repository and returns value")
        void averagePrice() {
            when(productRepository.averagePrice()).thenReturn(new BigDecimal("149.99"));

            assertThat(productService.averagePrice()).isEqualByComparingTo("149.99");
            verify(productRepository).averagePrice();
        }

        @Test
        @DisplayName("totalStock delegates to repository and returns value")
        void totalStock() {
            when(productRepository.totalStock()).thenReturn(500L);

            assertThat(productService.totalStock()).isEqualTo(500L);
            verify(productRepository).totalStock();
        }
    }
}
