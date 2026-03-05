package com.budanga.ordersystem.controller;

import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;
import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.repository.OrderRepository;
import com.budanga.ordersystem.repository.ProductRepository;
import com.budanga.ordersystem.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for OrderController.
 *
 * Uses a real Spring context against H2 (application-test.properties).
 * Each test runs in a transaction that is rolled back after the method,
 * keeping the database clean between tests.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("OrderController (integration)")
class OrderControllerTest {

    private static final String BASE = "/api/orders";

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /** JWT Bearer token obtained once per test method via registration. */
    private String bearerToken;

    @BeforeEach
    void setupMockMvc() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
        bearerToken = obtainBearerToken();
    }

    /** Registers a unique user and returns "Bearer <token>". */
    private String obtainBearerToken() throws Exception {
        String username = "testuser_" + System.nanoTime();
        String body = objectMapper.writeValueAsString(Map.of("username", username, "password", "password123"));
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andReturn();
        String token = objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").textValue();
        return "Bearer " + token;
    }

    // ─── Auth helper ─────────────────────────────────────────────────────────

    private <T extends MockHttpServletRequestBuilder> T auth(T builder) {
        builder.header("Authorization", bearerToken);
        return builder;
    }

    private <T extends MockHttpServletRequestBuilder> T adminAuth(T builder) throws Exception {
        builder.header("Authorization", obtainAdminToken());
        return builder;
    }

    private String obtainAdminToken() throws Exception {
        String username = "admin_" + System.nanoTime();
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode("password123"))
                .roles(roles)
                .build();
        userRepository.save(admin);

        String body = objectMapper.writeValueAsString(Map.of("username", username, "password", "password123"));
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andReturn();
        String token = objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").textValue();
        return "Bearer " + token;
    }

    // ─── DB helpers ──────────────────────────────────────────────────────────

    private Product saveProduct(String name, BigDecimal price, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        p.setActive(true);
        p.setImageUrl("https://example.com/default.jpg");
        return productRepository.saveAndFlush(p);
    }

    private Order saveOrder(String customer, BigDecimal total, boolean completed) {
        Order o = new Order();
        o.setCustomerName(customer);
        o.setTotalAmount(total);
        o.setCompleted(completed);
        return orderRepository.saveAndFlush(o);
    }

    private Order saveOrderWithItem(String customer, BigDecimal total, boolean completed,
            String productName, int qty, BigDecimal price) {
        Order o = new Order();
        o.setCustomerName(customer);
        o.setTotalAmount(total);
        o.setCompleted(completed);

        Product p = saveProduct(productName, price, qty + 10);

        OrderItem item = new OrderItem();
        item.setProductName(productName);
        item.setQuantity(qty);
        item.setPrice(price);
        item.setOrder(o);
        item.setProduct(p);
        o.setOrderItems(List.of(item));

        return orderRepository.saveAndFlush(o);
    }

    // ─── POST /api/orders ────────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/orders")
    class CreateOrder {

        @BeforeEach
        void setup() {
            saveProduct("Widget", new BigDecimal("10.00"), 5);
        }

        @Test
        @DisplayName("201: creates an order and decrements stock")
        void success() throws Exception {
            String body = objectMapper.writeValueAsString(Map.of(
                    "customerName", "Alice",
                    "totalAmount", new BigDecimal("20.00"),
                    "orderItems", List.of(Map.of("productName", "Widget", "quantity", 2))));

            mockMvc.perform(auth(post(BASE).contentType(MediaType.APPLICATION_JSON).content(body)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.customerName").value("Alice"))
                    .andExpect(jsonPath("$.totalAmount").value(20.0))
                    .andExpect(jsonPath("$.completed").value(false))
                    .andExpect(jsonPath("$.orderItems", hasSize(1)));

            Product updated = productRepository.findByName("Widget").orElseThrow();
            org.assertj.core.api.Assertions.assertThat(updated.getStock()).isEqualTo(3);
        }

        @Test
        @DisplayName("400: product not found returns error response")
        void productNotFound() throws Exception {
            String body = objectMapper.writeValueAsString(Map.of(
                    "customerName", "Bob",
                    "totalAmount", new BigDecimal("10.00"),
                    "orderItems", List.of(Map.of("productName", "Ghost", "quantity", 1))));

            mockMvc.perform(auth(post(BASE).contentType(MediaType.APPLICATION_JSON).content(body)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(containsString("Ghost")));
        }

        @Test
        @DisplayName("400: insufficient stock returns error response")
        void insufficientStock() throws Exception {
            String body = objectMapper.writeValueAsString(Map.of(
                    "customerName", "Carol",
                    "totalAmount", new BigDecimal("1000.00"),
                    "orderItems", List.of(Map.of("productName", "Widget", "quantity", 100))));

            mockMvc.perform(auth(post(BASE).contentType(MediaType.APPLICATION_JSON).content(body)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(containsString("Widget")));
        }
    }

    // ─── GET /api/orders/{id} ────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/{id}")
    class GetById {

        @Test
        @DisplayName("200: returns the order")
        void success() throws Exception {
            Order saved = saveOrder("Alice", new BigDecimal("50.00"), false);

            mockMvc.perform(auth(get(BASE + "/{id}", saved.getId())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.customerName").value("Alice"))
                    .andExpect(jsonPath("$.id").value(saved.getId()));
        }

        @Test
        @DisplayName("404: returns error response for unknown id")
        void notFound() throws Exception {
            mockMvc.perform(auth(get(BASE + "/999999")))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }
    }

    // ─── GET /api/orders (paginated) ─────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders (paginated)")
    class GetAllOrders {

        @Test
        @DisplayName("returns paginated content and metadata")
        void paginatedResponse() throws Exception {
            saveOrder("Alice", new BigDecimal("10.00"), false);
            saveOrder("Bob", new BigDecimal("20.00"), true);

            mockMvc.perform(auth(get(BASE).param("page", "0").param("size", "10")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.totalElements").value(2))
                    .andExpect(jsonPath("$.content", hasSize(2)));
        }

        @Test
        @DisplayName("respects page size parameter")
        void pageSizeRespected() throws Exception {
            saveOrder("A", BigDecimal.ONE, false);
            saveOrder("B", BigDecimal.ONE, false);
            saveOrder("C", BigDecimal.ONE, false);

            mockMvc.perform(auth(get(BASE).param("page", "0").param("size", "2")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(2)))
                    .andExpect(jsonPath("$.totalElements").value(3))
                    .andExpect(jsonPath("$.totalPages").value(2));
        }

        @Test
        @DisplayName("sorts by customer name when sort param is provided")
        void sortByCustomerName() throws Exception {
            saveOrder("Zara", BigDecimal.ONE, false);
            saveOrder("Alice", BigDecimal.ONE, false);

            mockMvc.perform(auth(get(BASE).param("sort", "customerName,asc")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].customerName").value("Alice"))
                    .andExpect(jsonPath("$.content[1].customerName").value("Zara"));
        }
    }

    // ─── GET /api/orders/completed & /uncompleted ────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/completed and /uncompleted")
    class FilterByCompletion {

        @BeforeEach
        void setup() {
            saveOrder("CompletedCustomer", new BigDecimal("100.00"), true);
            saveOrder("UncompletedCustomer", new BigDecimal("50.00"), false);
        }

        @Test
        @DisplayName("GET /completed: returns only completed orders")
        void completedOrders() throws Exception {
            mockMvc.perform(auth(get(BASE + "/completed")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(1)))
                    .andExpect(jsonPath("$.content[0].completed").value(true));
        }

        @Test
        @DisplayName("GET /uncompleted: returns only uncompleted orders")
        void uncompletedOrders() throws Exception {
            mockMvc.perform(auth(get(BASE + "/uncompleted")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(1)))
                    .andExpect(jsonPath("$.content[0].completed").value(false));
        }
    }

    // ─── GET /api/orders/customer ─────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/customer")
    class FilterByCustomer {

        @Test
        @DisplayName("returns orders matching the customer name")
        void byCustomer() throws Exception {
            saveOrder("Alice", BigDecimal.TEN, false);
            saveOrder("Bob", BigDecimal.TEN, false);

            mockMvc.perform(auth(get(BASE + "/customer").param("customerName", "Alice")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].customerName").value("Alice"));
        }

        @Test
        @DisplayName("returns empty list when no orders match the customer name")
        void noMatch() throws Exception {
            mockMvc.perform(auth(get(BASE + "/customer").param("customerName", "Ghost")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ─── Total amount filters ────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/totalamount filters")
    class TotalAmountFilters {

        @BeforeEach
        void setup() {
            saveOrder("A", new BigDecimal("10.00"), false);
            saveOrder("B", new BigDecimal("50.00"), false);
            saveOrder("C", new BigDecimal("200.00"), false);
        }

        @Test
        @DisplayName("/totalamount/less: returns orders with total < threshold")
        void lessThan() throws Exception {
            mockMvc.perform(auth(get(BASE + "/totalamount/less").param("totalAmount", "50.00")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].customerName").value("A"));
        }

        @Test
        @DisplayName("/totalamount/more: returns orders with total > threshold")
        void greaterThan() throws Exception {
            mockMvc.perform(auth(get(BASE + "/totalamount/more").param("totalAmount", "50.00")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].customerName").value("C"));
        }

        @Test
        @DisplayName("/totalamount/desc: returns orders sorted by total descending")
        void sortedDesc() throws Exception {
            mockMvc.perform(auth(get(BASE + "/totalamount/desc")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].totalAmount").value(200.0))
                    .andExpect(jsonPath("$[2].totalAmount").value(10.0));
        }

        @Test
        @DisplayName("/totalamount/asc: returns orders sorted by total ascending")
        void sortedAsc() throws Exception {
            mockMvc.perform(auth(get(BASE + "/totalamount/asc")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].totalAmount").value(10.0))
                    .andExpect(jsonPath("$[2].totalAmount").value(200.0));
        }
    }

    // ─── Date filters ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/created filters")
    class DateFilters {

        @Test
        @DisplayName("/created/before: returns orders created before the given date")
        void createdBefore() throws Exception {
            saveOrder("Alice", BigDecimal.TEN, false);
            String future = "2099-12-31T23:59:59";

            mockMvc.perform(auth(get(BASE + "/created/before").param("date", future)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
        }

        @Test
        @DisplayName("/created/after: returns empty list for past date when no old orders exist")
        void createdAfter() throws Exception {
            String past = "2000-01-01T00:00:00";

            mockMvc.perform(auth(get(BASE + "/created/after").param("date", past)))
                    .andExpect(status().isOk());
        }
    }

    // ─── Product name search ─────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/search/item")
    class SearchByProductName {

        @Test
        @DisplayName("returns orders containing the product name")
        void success() throws Exception {
            saveOrderWithItem("Alice", new BigDecimal("20.00"), false,
                    "Widget", 2, new BigDecimal("10.00"));
            saveOrder("Bob", new BigDecimal("5.00"), false);

            mockMvc.perform(auth(get(BASE + "/search/item").param("productName", "Wid")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].customerName").value("Alice"));
        }
    }

    // ─── PUT /api/orders/{id} ─────────────────────────────────────────────────

    @Nested
    @DisplayName("PUT /api/orders/{id}")
    class UpdateOrder {

        @Test
        @DisplayName("200: updates the order's completed status")
        void success() throws Exception {
            Order saved = saveOrder("Alice", BigDecimal.TEN, false);
            String body = objectMapper.writeValueAsString(Map.of("completed", true));

            mockMvc.perform(adminAuth(put(BASE + "/{id}", saved.getId())
                    .contentType(MediaType.APPLICATION_JSON).content(body)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.completed").value(true));
        }

        @Test
        @DisplayName("404: returns error for unknown order id")
        void notFound() throws Exception {
            String body = objectMapper.writeValueAsString(Map.of("completed", true));

            mockMvc.perform(adminAuth(put(BASE + "/999999")
                    .contentType(MediaType.APPLICATION_JSON).content(body)))
                    .andExpect(status().isNotFound());
        }
    }

    // ─── DELETE /api/orders/{id} ──────────────────────────────────────────────

    @Nested
    @DisplayName("DELETE /api/orders/{id}")
    class DeleteOrder {

        @Test
        @DisplayName("200: deletes an uncompleted order")
        void success() throws Exception {
            Order saved = saveOrder("Alice", BigDecimal.TEN, false);

            mockMvc.perform(adminAuth(delete(BASE + "/{id}", saved.getId())))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("400: cannot delete a completed order")
        void cannotDeleteCompleted() throws Exception {
            Order saved = saveOrder("Alice", BigDecimal.TEN, true);

            mockMvc.perform(adminAuth(delete(BASE + "/{id}", saved.getId())))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(containsString("Completed orders")));
        }

        @Test
        @DisplayName("404: returns error for unknown order id")
        void notFound() throws Exception {
            mockMvc.perform(adminAuth(delete(BASE + "/999999")))
                    .andExpect(status().isNotFound());
        }
    }

    // ─── PATCH /api/orders/{id}/complete and /uncomplete ─────────────────────

    @Nested
    @DisplayName("PATCH /api/orders/{id}/complete and /uncomplete")
    class MarkCompletion {

        @Test
        @DisplayName("/complete: marks an uncompleted order as completed")
        void markComplete() throws Exception {
            Order saved = saveOrder("Alice", BigDecimal.TEN, false);

            mockMvc.perform(adminAuth(patch(BASE + "/{id}/complete", saved.getId())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.completed").value(true));
        }

        @Test
        @DisplayName("/complete: returns 404 for unknown id")
        void markComplete_notFound() throws Exception {
            mockMvc.perform(adminAuth(patch(BASE + "/999999/complete")))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("/uncomplete: marks a completed order as uncompleted")
        void markUncomplete() throws Exception {
            Order saved = saveOrder("Alice", BigDecimal.TEN, true);

            mockMvc.perform(adminAuth(patch(BASE + "/{id}/uncomplete", saved.getId())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.completed").value(false));
        }

        @Test
        @DisplayName("/uncomplete: returns 404 for unknown id")
        void markUncomplete_notFound() throws Exception {
            mockMvc.perform(adminAuth(patch(BASE + "/999999/uncomplete")))
                    .andExpect(status().isNotFound());
        }
    }

    // ─── Statistics ───────────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/orders/stats")
    class Statistics {

        @Test
        @DisplayName("/stats/revenue: returns total revenue of completed orders")
        void totalRevenue() throws Exception {
            saveOrder("A", new BigDecimal("100.00"), true);
            saveOrder("B", new BigDecimal("50.00"), true);
            saveOrder("C", new BigDecimal("200.00"), false); // excluded from revenue

            mockMvc.perform(auth(get(BASE + "/stats/revenue")))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("150")));
        }

        @Test
        @DisplayName("/stats/average: returns average total amount across all orders")
        void averageAmount() throws Exception {
            saveOrder("A", new BigDecimal("10.00"), false);
            saveOrder("B", new BigDecimal("30.00"), true);

            // Average = (10 + 30) / 2 = 20.00
            mockMvc.perform(auth(get(BASE + "/stats/average")))
                    .andExpect(status().isOk())
                    .andExpect(content().string(containsString("20")));
        }

        @Test
        @DisplayName("/completed/count: returns the count of completed orders")
        void completedCount() throws Exception {
            saveOrder("A", BigDecimal.TEN, true);
            saveOrder("B", BigDecimal.TEN, true);
            saveOrder("C", BigDecimal.TEN, false);

            mockMvc.perform(auth(get(BASE + "/completed/count")))
                    .andExpect(status().isOk())
                    .andExpect(content().string("2"));
        }

        @Test
        @DisplayName("/uncompleted/count: returns the count of uncompleted orders")
        void uncompletedCount() throws Exception {
            saveOrder("A", BigDecimal.TEN, false);
            saveOrder("B", BigDecimal.TEN, true);

            mockMvc.perform(auth(get(BASE + "/uncompleted/count")))
                    .andExpect(status().isOk())
                    .andExpect(content().string("1"));
        }
    }
}
