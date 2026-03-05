package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.OrderItemDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("OrderMapper (unit)")
class OrderMapperTest {

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Order makeOrder(Long id, String customer, BigDecimal total, boolean completed) {
        Order o = new Order();
        o.setId(id);
        o.setCustomerName(customer);
        o.setTotalAmount(total);
        o.setCompleted(completed);
        o.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 0));
        o.setOrderItems(List.of());
        return o;
    }

    private OrderItem makeItem(String name, int qty, BigDecimal price) {
        OrderItem item = new OrderItem();
        item.setProductName(name);
        item.setQuantity(qty);
        item.setPrice(price);
        return item;
    }

    // ─── toDTO ────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("toDTO")
    class ToDTO {

        @Test
        @DisplayName("maps all order fields correctly")
        void mapsAllFields() {
            Order order = makeOrder(1L, "Alice", new BigDecimal("99.99"), false);

            OrderDTO dto = OrderMapper.toDTO(order);

            assertThat(dto.getId()).isEqualTo(1L);
            assertThat(dto.getCustomerName()).isEqualTo("Alice");
            assertThat(dto.getTotalAmount()).isEqualByComparingTo("99.99");
            assertThat(dto.getCompleted()).isFalse();
            assertThat(dto.getCreatedAt()).isEqualTo(LocalDateTime.of(2024, 1, 15, 10, 0));
        }

        @Test
        @DisplayName("maps nested orderItems to DTOs")
        void mapsOrderItems() {
            Order order = makeOrder(1L, "Bob", BigDecimal.TEN, false);
            OrderItem item = makeItem("Widget", 2, new BigDecimal("5.00"));
            item.setOrder(order);
            order.setOrderItems(List.of(item));

            OrderDTO dto = OrderMapper.toDTO(order);

            assertThat(dto.getItems()).hasSize(1);
            OrderItemDTO itemDTO = dto.getItems().get(0);
            assertThat(itemDTO.getProductName()).isEqualTo("Widget");
            assertThat(itemDTO.getQuantity()).isEqualTo(2);
            assertThat(itemDTO.getPrice()).isEqualByComparingTo("5.00");
        }

        @Test
        @DisplayName("returns empty items list when orderItems is empty")
        void emptyItems() {
            Order order = makeOrder(1L, "Carol", BigDecimal.ONE, true);

            OrderDTO dto = OrderMapper.toDTO(order);

            assertThat(dto.getItems()).isEmpty();
        }

        @Test
        @DisplayName("returns null when order is null")
        void nullOrder() {
            assertThat(OrderMapper.toDTO(null)).isNull();
        }
    }

    // ─── toOrderItemDTO ───────────────────────────────────────────────────────

    @Nested
    @DisplayName("toOrderItemDTO")
    class ToOrderItemDTO {

        @Test
        @DisplayName("maps all item fields correctly")
        void mapsAllFields() {
            OrderItem item = makeItem("Gadget", 3, new BigDecimal("12.50"));

            OrderItemDTO dto = OrderMapper.toOrderItemDTO(item);

            assertThat(dto.getProductName()).isEqualTo("Gadget");
            assertThat(dto.getQuantity()).isEqualTo(3);
            assertThat(dto.getPrice()).isEqualByComparingTo("12.50");
        }

        @Test
        @DisplayName("returns null when item is null")
        void nullItem() {
            assertThat(OrderMapper.toOrderItemDTO(null)).isNull();
        }
    }

    // ─── updateFromDTO ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("updateFromDTO")
    class UpdateFromDTO {

        @Test
        @DisplayName("sets completed to true when DTO provides true")
        void setsCompletedTrue() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, false);
            UpdateOrderDTO dto = new UpdateOrderDTO(true);

            OrderMapper.updateFromDTO(order, dto);

            assertThat(order.getCompleted()).isTrue();
        }

        @Test
        @DisplayName("sets completed to false when DTO provides false")
        void setsCompletedFalse() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, true);
            UpdateOrderDTO dto = new UpdateOrderDTO(false);

            OrderMapper.updateFromDTO(order, dto);

            assertThat(order.getCompleted()).isFalse();
        }

        @Test
        @DisplayName("does not modify completed when DTO provides null")
        void ignoresNullCompleted() {
            Order order = makeOrder(1L, "Alice", BigDecimal.TEN, true);
            UpdateOrderDTO dto = new UpdateOrderDTO(null);

            OrderMapper.updateFromDTO(order, dto);

            assertThat(order.getCompleted()).isTrue();
        }
    }
}
