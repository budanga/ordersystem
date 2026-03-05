package com.budanga.ordersystem.controller;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.exception.GlobalExceptionHandler;
import com.budanga.ordersystem.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link ProductController}.
 *
 * <p>
 * Uses {@code MockMvcBuilders.standaloneSetup} so no Spring context is loaded,
 * keeping tests fast. The {@link GlobalExceptionHandler} is registered
 * explicitly
 * so all error-handling paths are exercised. Bean Validation is enabled through
 * a {@link LocalValidatorFactoryBean} added to the standalone configuration.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProductController")
class ProductControllerTest {

        @Mock
        private ProductService productService;

        @InjectMocks
        private ProductController productController;

        private MockMvc mockMvc;
        private ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
                LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
                validator.afterPropertiesSet();

                mockMvc = MockMvcBuilders
                                .standaloneSetup(productController)
                                .setControllerAdvice(new GlobalExceptionHandler())
                                .setValidator(validator)
                                .build();

                objectMapper = new ObjectMapper();
        }

        // Shared fixture helpers
        private ProductDTO buildProductDTO(Long id, String name, BigDecimal price,
                        Integer stock, String category, Boolean active, String imageUrl) {
                ProductDTO dto = new ProductDTO();
                dto.setId(id);
                dto.setName(name);
                dto.setPrice(price);
                dto.setStock(stock);
                dto.setCategory(category);
                dto.setActive(active);
                dto.setCreatedAt(LocalDateTime.of(2024, 1, 1, 0, 0));
                dto.setImageUrl(imageUrl);
                return dto;
        }

        private String json(Object obj) throws Exception {
                return objectMapper.writeValueAsString(obj);
        }

        // POST /api/products
        @Nested
        @DisplayName("POST /api/products")
        class CreateProduct {

                @Test
                @DisplayName("returns 200 with product DTO when request is valid")
                void success_withValidRequest() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Laptop", new BigDecimal("999.99"), 10,
                                        "Laptops",
                                        "https://example.com/img.jpg");
                        ProductDTO response = buildProductDTO(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops",
                                        true,
                                        "https://example.com/img.jpg");

                        when(productService.createProduct(any(CreateProductDTO.class))).thenReturn(response);

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.id").value(1))
                                        .andExpect(jsonPath("$.name").value("Laptop"))
                                        .andExpect(jsonPath("$.price").value(999.99))
                                        .andExpect(jsonPath("$.stock").value(10))
                                        .andExpect(jsonPath("$.active").value(true))
                                        .andExpect(jsonPath("$.imageUrl").value("https://example.com/img.jpg"));
                }

                @Test
                @DisplayName("returns 400 when name is blank")
                void returns400_whenNameIsBlank() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("", new BigDecimal("10.00"), 5, "Electronics",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        .andExpect(jsonPath("$.message").value(containsString("name")));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when name is null")
                void returns400_whenNameIsNull() throws Exception {
                        CreateProductDTO request = new CreateProductDTO(null, new BigDecimal("10.00"), 5, "Electronics",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when price is null")
                void returns400_whenPriceIsNull() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Widget", null, 5, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        .andExpect(jsonPath("$.message").value(
                                                        anyOf(containsString("price"), containsString("Image"))));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when price is zero (not strictly positive)")
                void returns400_whenPriceIsZero() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Widget", BigDecimal.ZERO, 5, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when price is negative")
                void returns400_whenPriceIsNegative() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Widget", new BigDecimal("-1.00"), 5, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when stock is null")
                void returns400_whenStockIsNull() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Widget", new BigDecimal("10.00"), null, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        .andExpect(jsonPath("$.message").value(
                                                        anyOf(containsString("stock"), containsString("Image"))));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when stock is negative")
                void returns400_whenStockIsNegative() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Widget", new BigDecimal("10.00"), -1, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 with aggregated errors when multiple fields are invalid")
                void returns400_withAllValidationErrors_whenMultipleFieldsInvalid() throws Exception {
                        // Both price and stock are null on an otherwise valid name body
                        CreateProductDTO request = new CreateProductDTO("Widget", null, null, "Misc",
                                        "https://example.com/img.jpg");

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        // GlobalExceptionHandler joins all field errors; both must appear
                                        .andExpect(jsonPath("$.message").value(allOf(
                                                        containsString("price"),
                                                        containsString("stock"))));

                        verify(productService, never()).createProduct(any());
                }

                @Test
                @DisplayName("returns 400 when service throws IllegalArgumentException (duplicate name)")
                void returns400_whenServiceThrowsIllegalArgument() throws Exception {
                        CreateProductDTO request = new CreateProductDTO("Laptop", new BigDecimal("999.99"), 10,
                                        "Laptops",
                                        "https://example.com/img.jpg");

                        when(productService.createProduct(any())).thenThrow(
                                        new IllegalArgumentException("A product with that name already exists."));

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        .andExpect(jsonPath("$.message").value(containsString("already exists")));
                }

                @Test
                @DisplayName("returns 200 with a very long (255-char) valid name")
                void returns200_withVeryLongValidName() throws Exception {
                        // No @Size max on CreateProductDTO; long names must be accepted
                        String longName = "A".repeat(255);
                        CreateProductDTO request = new CreateProductDTO(longName, new BigDecimal("1.00"), 1, "Stuff",
                                        "https://example.com/img.jpg");
                        ProductDTO response = buildProductDTO(1L, longName, new BigDecimal("1.00"), 1, "Stuff", true,
                                        "https://example.com/img.jpg");

                        when(productService.createProduct(any())).thenReturn(response);

                        mockMvc.perform(post("/api/products")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.name").value(longName));
                }
        }

        // PUT /api/products/{id}
        @Nested
        @DisplayName("PUT /api/products/{id}")
        class UpdateProduct {

                @Test
                @DisplayName("returns 200 with updated DTO when request is valid")
                void success_withValidRequest() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO("Laptop Pro", new BigDecimal("1099.99"), 8,
                                        true, "Laptops",
                                        "https://example.com/new-img.jpg");
                        ProductDTO response = buildProductDTO(1L, "Laptop Pro", new BigDecimal("1099.99"), 8, "Laptops",
                                        true,
                                        "https://example.com/new-img.jpg");

                        when(productService.updateProduct(eq(1L), any(UpdateProductDTO.class))).thenReturn(response);

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.name").value("Laptop Pro"))
                                        .andExpect(jsonPath("$.price").value(1099.99));
                }

                @Test
                @DisplayName("returns 200 with all-null fields (no-op partial update)")
                void success_withAllNullFields() throws Exception {
                        // UpdateProductDTO has all optional fields; all-null is valid
                        UpdateProductDTO request = new UpdateProductDTO(null, null, null, null, null, null);
                        ProductDTO response = buildProductDTO(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops",
                                        true, null);

                        when(productService.updateProduct(eq(1L), any(UpdateProductDTO.class))).thenReturn(response);

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.name").value("Laptop"));
                }

                @Test
                @DisplayName("returns 400 when name is empty string (violates @Size min=1)")
                void returns400_whenNameIsEmptyString() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO("", new BigDecimal("10.00"), 5, null, null,
                                        null);

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400))
                                        .andExpect(jsonPath("$.message").value(containsString("name")));

                        verify(productService, never()).updateProduct(any(), any());
                }

                @Test
                @DisplayName("returns 400 when price is zero in UpdateProductDTO")
                void returns400_whenPriceIsZero() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO(null, BigDecimal.ZERO, null, null, null, null);

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).updateProduct(any(), any());
                }

                @Test
                @DisplayName("returns 400 when stock is negative in UpdateProductDTO")
                void returns400_whenStockIsNegative() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO(null, null, -5, null, null, null);

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.status").value(400));

                        verify(productService, never()).updateProduct(any(), any());
                }

                @Test
                @DisplayName("returns 400 when service throws IllegalArgumentException (product not found)")
                void returns400_whenProductNotFound() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO("X", new BigDecimal("1.00"), 1, true, "Y",
                                        null);

                        when(productService.updateProduct(eq(999L), any()))
                                        .thenThrow(new IllegalArgumentException("Product not found."));

                        mockMvc.perform(put("/api/products/999")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message").value(containsString("not found")));
                }

                @Test
                @DisplayName("returns 400 when service throws IllegalArgumentException (name collision)")
                void returns400_whenNameCollision() throws Exception {
                        UpdateProductDTO request = new UpdateProductDTO("Monitor", null, null, null, null, null);

                        when(productService.updateProduct(eq(1L), any()))
                                        .thenThrow(new IllegalArgumentException(
                                                        "A product with that name already exists."));

                        mockMvc.perform(put("/api/products/1")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(json(request)))
                                        .andExpect(status().isBadRequest())
                                        .andExpect(jsonPath("$.message").value(containsString("already exists")));
                }
        }

        // GET /api/products
        @Nested
        @DisplayName("GET /api/products")
        class GetAllProducts {

                @Test
                @DisplayName("returns 200 with list of all products")
                void returnsAllProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true,
                                                        "img1.jpg"),
                                        buildProductDTO(2L, "Mouse", new BigDecimal("29.99"), 50, "Accessories", true,
                                                        "img2.jpg"));

                        when(productService.getAllProducts()).thenReturn(products);

                        mockMvc.perform(get("/api/products"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(2)))
                                        .andExpect(jsonPath("$[0].name").value("Laptop"))
                                        .andExpect(jsonPath("$[1].name").value("Mouse"));
                }

                @Test
                @DisplayName("returns 200 with empty list when no products exist")
                void returnsEmptyList() throws Exception {
                        when(productService.getAllProducts()).thenReturn(List.of());

                        mockMvc.perform(get("/api/products"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(0)));
                }
        }

        // GET /api/products/active
        @Nested
        @DisplayName("GET /api/products/active")
        class GetAllActiveProducts {

                @Test
                @DisplayName("returns 200 with only active products")
                void returnsActiveProducts() throws Exception {
                        List<ProductDTO> activeProducts = List.of(
                                        buildProductDTO(1L, "Laptop", new BigDecimal("999.99"), 10, "Laptops", true,
                                                        "img.jpg"));

                        when(productService.getAllActiveProducts()).thenReturn(activeProducts);

                        mockMvc.perform(get("/api/products/active"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(1)))
                                        .andExpect(jsonPath("$[0].active").value(true));
                }
        }

        // GET /api/products/price?minPrice=&maxPrice=
        @Nested
        @DisplayName("GET /api/products/price")
        class GetProductsByPriceBetween {

                @Test
                @DisplayName("returns 200 with products within the price range")
                void returnsProductsInRange() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Widget", new BigDecimal("10.00"), 5, "Misc", true,
                                                        "img.jpg"));

                        when(productService.getProductsByPriceBetween(
                                        new BigDecimal("5.00"), new BigDecimal("15.00")))
                                        .thenReturn(products);

                        mockMvc.perform(get("/api/products/price")
                                        .param("minPrice", "5.00")
                                        .param("maxPrice", "15.00"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(1)))
                                        .andExpect(jsonPath("$[0].name").value("Widget"));
                }
        }

        // GET /api/products/price/less?price=
        @Nested
        @DisplayName("GET /api/products/price/less")
        class GetProductsCheaperThan {

                @Test
                @DisplayName("returns 200 with products cheaper than the given price")
                void returnsCheaperProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Cheap", new BigDecimal("5.00"), 10, "Misc", true,
                                                        "img.jpg"));

                        when(productService.getProductsCheaperThan(new BigDecimal("50.00"))).thenReturn(products);

                        mockMvc.perform(get("/api/products/price/less").param("price", "50.00"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].name").value("Cheap"));
                }
        }

        // GET /api/products/price/more?price=
        @Nested
        @DisplayName("GET /api/products/price/more")
        class GetProductsMoreExpensiveThan {

                @Test
                @DisplayName("returns 200 with products more expensive than the given price")
                void returnsExpensiveProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Premium", new BigDecimal("500.00"), 2, "Luxury", true,
                                                        "img.jpg"));

                        when(productService.getProductsMoreExpensiveThan(new BigDecimal("100.00")))
                                        .thenReturn(products);

                        mockMvc.perform(get("/api/products/price/more").param("price", "100.00"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].name").value("Premium"));
                }
        }

        // GET /api/products/stock/less?stock=
        @Nested
        @DisplayName("GET /api/products/stock/less")
        class GetProductsWithStockLessThan {

                @Test
                @DisplayName("returns 200 with products that have low stock")
                void returnsLowStockProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Scarce", new BigDecimal("10.00"), 1, "Misc", true,
                                                        "img.jpg"));

                        when(productService.getProductsWithStockLessThan(5)).thenReturn(products);

                        mockMvc.perform(get("/api/products/stock/less").param("stock", "5"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].stock").value(1));
                }
        }

        // GET /api/products/stock/greater?stock=
        @Nested
        @DisplayName("GET /api/products/stock/greater")
        class GetProductsWithStockGreaterThan {

                @Test
                @DisplayName("returns 200 with products that have high stock")
                void returnsHighStockProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "Plentiful", new BigDecimal("5.00"), 200, "Misc", true,
                                                        "img.jpg"));

                        when(productService.getProductsWithStockGreaterThan(100)).thenReturn(products);

                        mockMvc.perform(get("/api/products/stock/greater").param("stock", "100"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].stock").value(200));
                }
        }

        // GET /api/products/created/before?date=
        @Nested
        @DisplayName("GET /api/products/created/before")
        class GetProductsCreatedBefore {

                @Test
                @DisplayName("returns 200 with products created before the date")
                void returnsOlderProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "OldProduct", new BigDecimal("1.00"), 1, "Vintage", true,
                                                        "img.jpg"));

                        LocalDateTime cutoff = LocalDateTime.of(2025, 1, 1, 0, 0);
                        when(productService.getProductsCreatedBefore(cutoff)).thenReturn(products);

                        mockMvc.perform(get("/api/products/created/before")
                                        .param("date", "2025-01-01T00:00:00"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].name").value("OldProduct"));
                }
        }

        // GET /api/products/created/after?date=
        @Nested
        @DisplayName("GET /api/products/created/after")
        class GetProductsCreatedAfter {

                @Test
                @DisplayName("returns 200 with products created after the date")
                void returnsNewerProducts() throws Exception {
                        List<ProductDTO> products = List.of(
                                        buildProductDTO(1L, "NewProduct", new BigDecimal("1.00"), 1, "Modern", true,
                                                        "img.jpg"));

                        LocalDateTime cutoff = LocalDateTime.of(2024, 6, 1, 0, 0);
                        when(productService.getProductsCreatedAfter(cutoff)).thenReturn(products);

                        mockMvc.perform(get("/api/products/created/after")
                                        .param("date", "2024-06-01T00:00:00"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].name").value("NewProduct"));
                }
        }

        // GET /api/products/price/desc
        @Nested
        @DisplayName("GET /api/products/price/desc")
        class GetAllProductsOrderByPriceDesc {

                @Test
                @DisplayName("returns 200 with products sorted by price descending")
                void returnsSortedProducts() throws Exception {
                        List<ProductDTO> sorted = List.of(
                                        buildProductDTO(1L, "Expensive", new BigDecimal("500.00"), 1, "Luxury", true,
                                                        "img1.jpg"),
                                        buildProductDTO(2L, "Cheap", new BigDecimal("10.00"), 5, "Misc", true,
                                                        "img2.jpg"));

                        when(productService.getAllProductsOrderByPriceDesc()).thenReturn(sorted);

                        mockMvc.perform(get("/api/products/price/desc"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(2)))
                                        .andExpect(jsonPath("$[0].name").value("Expensive"))
                                        .andExpect(jsonPath("$[1].name").value("Cheap"));
                }
        }

        // GET /api/products/active/count
        @Nested
        @DisplayName("GET /api/products/active/count")
        class CountActiveProducts {

                @Test
                @DisplayName("returns 200 with the count of active products")
                void returnsCount() throws Exception {
                        when(productService.countActiveProducts()).thenReturn(7L);

                        mockMvc.perform(get("/api/products/active/count"))
                                        .andExpect(status().isOk())
                                        .andExpect(content().string("7"));
                }
        }

        // GET /api/products/price/average
        @Nested
        @DisplayName("GET /api/products/price/average")
        class AveragePrice {

                @Test
                @DisplayName("returns 200 with the average price of all products")
                void returnsAverage() throws Exception {
                        when(productService.averagePrice()).thenReturn(new BigDecimal("149.99"));

                        mockMvc.perform(get("/api/products/price/average"))
                                        .andExpect(status().isOk())
                                        .andExpect(content().string("149.99"));
                }
        }

        // GET /api/products/stock/total
        @Nested
        @DisplayName("GET /api/products/stock/total")
        class TotalStock {

                @Test
                @DisplayName("returns 200 with the total stock across all products")
                void returnsTotal() throws Exception {
                        when(productService.totalStock()).thenReturn(1500L);

                        mockMvc.perform(get("/api/products/stock/total"))
                                        .andExpect(status().isOk())
                                        .andExpect(content().string("1500"));
                }
        }

        // GlobalExceptionHandler — general exception fallback
        @Nested
        @DisplayName("GlobalExceptionHandler fallback")
        class GlobalExceptionHandlerFallback {

                @Test
                @DisplayName("returns 500 when service throws an unexpected RuntimeException")
                void returns500_forUnexpectedException() throws Exception {
                        when(productService.getAllProducts())
                                        .thenThrow(new RuntimeException("Unexpected DB error"));

                        mockMvc.perform(get("/api/products"))
                                        .andExpect(status().isInternalServerError())
                                        .andExpect(jsonPath("$.status").value(500))
                                        .andExpect(jsonPath("$.message").value(containsString("Unexpected DB error")));
                }
        }
}
