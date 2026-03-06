package com.budanga.ordersystem.service;

import com.budanga.ordersystem.dto.CreateOrderDTO;
import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.OrderItemDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;
import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.entity.User;
import com.budanga.ordersystem.exception.ResourceNotFoundException;
import com.budanga.ordersystem.repository.OrderRepository;
import com.budanga.ordersystem.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService (unit)")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private NotificationService notificationService;

    private OrderService orderService;

    private User testUser;

    private final com.budanga.ordersystem.mapper.OrderMapper orderMapper = org.mapstruct.factory.Mappers
            .getMapper(com.budanga.ordersystem.mapper.OrderMapper.class);

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, productRepository, orderMapper, notificationService);
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private Product makeProduct(String name, BigDecimal price, int stock, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setStock(stock);
        p.setCategory("Default Category");
        p.setActive(true);
        p.setImageUrl(imageUrl);
        return p;
    }

    private Order makeOrder(Long id, String customer, BigDecimal total, boolean completed) {
        Order o = new Order();
        o.setId(id);
        o.setCustomerName(customer);
        o.setTotalAmount(total);
        o.setCompleted(completed);
        o.setCreatedAt(LocalDateTime.now());
        o.setOrderItems(List.of());
        return o;
    }

    // ─── createOrder ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("createOrder")
    class CreateOrder {

        @Test
        @DisplayName("happy path: saves order, decrements stock, calculates total")
        void success() {
            Product product = makeProduct("Widget", new BigDecimal("10.00"), 5, "widget.jpg");
            when(productRepository.findByName("Widget")).thenReturn(Optional.of(product));

            Order savedOrder = makeOrder(1L, "Alice", new BigDecimal("20.00"), false);
            OrderItem item = new OrderItem();
            item.setProductName("Widget");
            item.setProductImageUrl("widget.jpg");
            item.setQuantity(2);
            item.setPrice(new BigDecimal("10.00"));
            item.setProduct(product);
            savedOrder.setOrderItems(List.of(item));
            when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

            CreateOrderDTO dto = new CreateOrderDTO();
            dto.setCustomerName("Alice");
            dto.setOrderItems(List.of(new OrderItemDTO("Widget", null, 2, null)));

            OrderDTO result = orderService.createOrder(dto, testUser);

            // Stock decremented
            assertThat(product.getStock()).isEqualTo(3);

            // Total = 10.00 * 2
            ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
            verify(orderRepository).save(captor.capture());
            assertThat(captor.getValue().getTotalAmount()).isEqualByComparingTo("20.00");
            assertThat(captor.getValue().getCustomerName()).isEqualTo("Alice");
            assertThat(captor.getValue().getOrderItems().get(0).getProductImageUrl()).isEqualTo("widget.jpg");
            assertThat(captor.getValue().getCompleted()).isFalse();

            assertThat(result).isNotNull();
            assertThat(result.getTotalAmount()).isEqualByComparingTo("20.00");
        }

        @Test
        @DisplayName("throws IllegalArgumentException when product is not found")
        void productNotFound() {
            when(productRepository.findByName("Ghost")).thenReturn(Optional.empty());

            CreateOrderDTO dto = new CreateOrderDTO();
            dto.setCustomerName("Bob");
            dto.setOrderItems(List.of(new OrderItemDTO("Ghost", null, 1, null)));

            assertThatThrownBy(() -> orderService.createOrder(dto, testUser))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Ghost");

            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("throws IllegalStateException when stock is insufficient")
        void insufficientStock() {
            Product product = makeProduct("Widget", new BigDecimal("10.00"), 1, null);
            when(productRepository.findByName("Widget")).thenReturn(Optional.of(product));

            CreateOrderDTO dto = new CreateOrderDTO();
            dto.setCustomerName("Carol");
            dto.setOrderItems(List.of(new OrderItemDTO("Widget", null, 5, null)));

            assertThatThrownBy(() -> orderService.createOrder(dto, testUser))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Widget");

            // Stock must not change
            assertThat(product.getStock()).isEqualTo(1);
            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("processes multiple items and sums total correctly")
        void multipleItems() {
            Product p1 = makeProduct("Apple", new BigDecimal("3.00"), 10, "apple.jpg");
            Product p2 = makeProduct("Banana", new BigDecimal("2.00"), 10, "banana.jpg");
            when(productRepository.findByName("Apple")).thenReturn(Optional.of(p1));
            when(productRepository.findByName("Banana")).thenReturn(Optional.of(p2));

            Order savedOrder = makeOrder(1L, "Dave", new BigDecimal("13.00"), false);
            when(orderRepository.save(any())).thenReturn(savedOrder);

            CreateOrderDTO dto = new CreateOrderDTO();
            dto.setCustomerName("Dave");
            dto.setOrderItems(List.of(
                    new OrderItemDTO("Apple", null, 3, null), // 3 * 3.00 = 9.00
                    new OrderItemDTO("Banana", null, 2, null) // 2 * 2.00 = 4.00
            ));

            orderService.createOrder(dto, testUser);

            ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
            verify(orderRepository).save(captor.capture());
            assertThat(captor.getValue().getTotalAmount()).isEqualByComparingTo("13.00");
            assertThat(p1.getStock()).isEqualTo(7);
            assertThat(p2.getStock()).isEqualTo(8);
        }
    }

    // ─── updateOrder ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateOrder")
    class UpdateOrder {

        @Test
        @DisplayName("updates completed flag and returns DTO")
        void success() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
            when(orderRepository.save(any())).thenReturn(order);

            UpdateOrderDTO dto = new UpdateOrderDTO(true);
            OrderDTO result = orderService.updateOrder(1L, dto, testUser);

            assertThat(order.getCompleted()).isTrue();
            assertThat(result).isNotNull();
            verify(orderRepository).save(order);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when order does not exist")
        void notFound() {
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.updateOrder(99L, new UpdateOrderDTO(), testUser))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ─── deleteOrder ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteOrder")
    class DeleteOrder {

        @Test
        @DisplayName("deletes an uncompleted order successfully")
        void success() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

            orderService.deleteOrder(1L, testUser);

            verify(orderRepository).delete(order);
        }

        @Test
        @DisplayName("throws IllegalStateException when trying to delete a completed order")
        void cannotDeleteCompleted() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, true);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

            assertThatThrownBy(() -> orderService.deleteOrder(1L, testUser))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Completed orders cannot be deleted");

            verify(orderRepository, never()).delete(any());
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when order does not exist")
        void notFound() {
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.deleteOrder(99L, testUser))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ─── getOrderById ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getOrderById")
    class GetOrderById {

        @Test
        @DisplayName("returns DTO when order exists")
        void success() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

            OrderDTO result = orderService.getOrderById(1L);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getCustomerName()).isEqualTo("Alice");
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when order does not exist")
        void notFound() {
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.getOrderById(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ─── Pagination ──────────────────────────────────────────────────────────

    @Nested
    @DisplayName("pagination methods")
    class PaginationMethods {

        private final Pageable pageable = PageRequest.of(0, 10);

        @Test
        @DisplayName("getAllOrders returns a page of DTOs")
        void getAllOrders() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            Page<Order> page = new PageImpl<>(List.of(order), pageable, 1);
            when(orderRepository.findAll(pageable)).thenReturn(page);

            Page<OrderDTO> result = orderService.getAllOrders(pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent().get(0).getCustomerName()).isEqualTo("Alice");
        }

        @Test
        @DisplayName("getCompletedOrders returns page from findByCompletedTrue")
        void getCompletedOrders() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, true);
            Page<Order> page = new PageImpl<>(List.of(order), pageable, 1);
            when(orderRepository.findByCompletedTrue(pageable)).thenReturn(page);

            Page<OrderDTO> result = orderService.getCompletedOrders(pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getCompleted()).isTrue();
            verify(orderRepository).findByCompletedTrue(pageable);
        }

        @Test
        @DisplayName("getUncompletedOrders returns page from findByCompletedFalse")
        void getUncompletedOrders() {
            Order order = makeOrder(1L, "Bob", BigDecimal.TEN, false);
            Page<Order> page = new PageImpl<>(List.of(order), pageable, 1);
            when(orderRepository.findByCompletedFalse(pageable)).thenReturn(page);

            Page<OrderDTO> result = orderService.getUncompletedOrders(pageable);

            assertThat(result.getContent().get(0).getCompleted()).isFalse();
            verify(orderRepository).findByCompletedFalse(pageable);
        }
    }

    // ─── mark as completed / uncompleted ─────────────────────────────────────

    @Nested
    @DisplayName("markAsCompleted / markAsUncompleted")
    class MarkCompletion {

        @Test
        @DisplayName("markAsCompleted sets completed to true")
        void markAsCompleted() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
            when(orderRepository.save(any())).thenReturn(order);

            OrderDTO result = orderService.markAsCompleted(1L, testUser);

            assertThat(order.getCompleted()).isTrue();
            assertThat(result).isNotNull();
        }

        @Test
        @DisplayName("markAsCompleted throws ResourceNotFoundException for unknown id")
        void markAsCompleted_notFound() {
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.markAsCompleted(99L, testUser))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("markAsUncompleted sets completed to false")
        void markAsUncompleted() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, true);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
            when(orderRepository.save(any())).thenReturn(order);

            OrderDTO result = orderService.markAsUncompleted(1L, testUser);

            assertThat(order.getCompleted()).isFalse();
            assertThat(result).isNotNull();
        }

        @Test
        @DisplayName("markAsUncompleted throws ResourceNotFoundException for unknown id")
        void markAsUncompleted_notFound() {
            when(orderRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.markAsUncompleted(99L, testUser))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ─── Statistics ──────────────────────────────────────────────────────────

    @Nested
    @DisplayName("statistics methods")
    class Statistics {

        @Test
        @DisplayName("getTotalRevenue returns value from repository")
        void getTotalRevenue() {
            when(orderRepository.getTotalRevenue()).thenReturn(new BigDecimal("500.00"));

            assertThat(orderService.getTotalRevenue()).isEqualByComparingTo("500.00");
        }

        @Test
        @DisplayName("getTotalRevenue returns ZERO when repository returns null (empty table)")
        void getTotalRevenue_null() {
            when(orderRepository.getTotalRevenue()).thenReturn(null);

            assertThat(orderService.getTotalRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("getAverageTotalAmount returns value from repository")
        void getAverageTotalAmount() {
            when(orderRepository.getAverageTotalAmount()).thenReturn(new BigDecimal("250.00"));

            assertThat(orderService.getAverageTotalAmount()).isEqualByComparingTo("250.00");
        }

        @Test
        @DisplayName("getAverageTotalAmount returns ZERO when repository returns null (empty table)")
        void getAverageTotalAmount_null() {
            when(orderRepository.getAverageTotalAmount()).thenReturn(null);

            assertThat(orderService.getAverageTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("countCompletedOrders delegates to repository")
        void countCompleted() {
            when(orderRepository.countCompletedOrders()).thenReturn(7L);

            assertThat(orderService.countCompletedOrders()).isEqualTo(7L);
        }

        @Test
        @DisplayName("countUncompletedOrders delegates to repository")
        void countUncompleted() {
            when(orderRepository.countUncompletedOrders()).thenReturn(3L);

            assertThat(orderService.countUncompletedOrders()).isEqualTo(3L);
        }
    }

    // ─── Filtering ───────────────────────────────────────────────────────────

    @Nested
    @DisplayName("filtering methods")
    class Filtering {

        @Test
        @DisplayName("getOrdersByCustomer delegates to repository")
        void byCustomer() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findByCustomerName("Alice")).thenReturn(List.of(order));

            List<OrderDTO> results = orderService.getOrdersByCustomer("Alice");

            assertThat(results).hasSize(1);
            assertThat(results.get(0).getCustomerName()).isEqualTo("Alice");
        }

        @Test
        @DisplayName("getOrdersByTotalAmountLessThan delegates to repository")
        void byAmountLess() {
            Order order = makeOrder(1L, "Alice", new BigDecimal("5.00"), false);
            when(orderRepository.findByTotalAmountLessThan(BigDecimal.TEN)).thenReturn(List.of(order));

            assertThat(orderService.getOrdersByTotalAmountLessThan(BigDecimal.TEN)).hasSize(1);
        }

        @Test
        @DisplayName("getOrdersByTotalAmountGreaterThan delegates to repository")
        void byAmountGreater() {
            Order order = makeOrder(1L, "Alice", new BigDecimal("20.00"), false);
            when(orderRepository.findByTotalAmountGreaterThan(BigDecimal.TEN)).thenReturn(List.of(order));

            assertThat(orderService.getOrdersByTotalAmountGreaterThan(BigDecimal.TEN)).hasSize(1);
        }

        @Test
        @DisplayName("getOrdersByTotalAmountDesc returns list in descending order")
        void byAmountDesc() {
            Order o1 = makeOrder(1L, "A", new BigDecimal("30.00"), false);
            Order o2 = makeOrder(2L, "B", new BigDecimal("10.00"), false);
            when(orderRepository.findAllByOrderByTotalAmountDesc()).thenReturn(List.of(o1, o2));

            List<OrderDTO> results = orderService.getOrdersByTotalAmountDesc();

            assertThat(results).hasSize(2);
            assertThat(results.get(0).getTotalAmount()).isEqualByComparingTo("30.00");
        }

        @Test
        @DisplayName("getOrdersByProductName delegates to repository")
        void byProductName() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findByOrderItemsProductNameContaining("Widget")).thenReturn(List.of(order));

            assertThat(orderService.getOrdersByProductName("Widget")).hasSize(1);
        }

        @Test
        @DisplayName("getOrdersByCreatedAtBetween delegates to repository")
        void byCreatedBetween() {
            LocalDateTime start = LocalDateTime.now().minusDays(2);
            LocalDateTime end = LocalDateTime.now();
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findByCreatedAtBetween(start, end)).thenReturn(List.of(order));

            assertThat(orderService.getOrdersByCreatedAtBetween(start, end)).hasSize(1);
        }

        @Test
        @DisplayName("getOrdersByCreatedAtBefore delegates to repository")
        void byCreatedBefore() {
            LocalDateTime date = LocalDateTime.now();
            when(orderRepository.findByCreatedAtBefore(date)).thenReturn(List.of());

            assertThat(orderService.getOrdersByCreatedAtBefore(date)).isEmpty();
        }

        @Test
        @DisplayName("getOrdersByCreatedAtAfter delegates to repository")
        void byCreatedAfter() {
            LocalDateTime date = LocalDateTime.now().minusDays(1);
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            when(orderRepository.findByCreatedAtAfter(date)).thenReturn(List.of(order));

            assertThat(orderService.getOrdersByCreatedAtAfter(date)).hasSize(1);
        }
    }
}
