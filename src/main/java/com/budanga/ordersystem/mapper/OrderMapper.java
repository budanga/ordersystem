package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.OrderDTO;
import com.budanga.ordersystem.dto.OrderItemDTO;
import com.budanga.ordersystem.dto.UpdateOrderDTO;
import com.budanga.ordersystem.entity.Order;
import com.budanga.ordersystem.entity.OrderItem;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Order and OrderItem entities.
 * The implementation is generated at compile time by MapStruct.
 */
@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderDTO toDTO(Order order);

    OrderItemDTO toOrderItemDTO(OrderItem item);

    List<OrderItemDTO> toOrderItemDTOList(List<OrderItem> items);

    List<OrderDTO> toDTOList(List<Order> orders);

    /**
     * Updates an existing Order entity from an UpdateOrderDTO.
     * Only non-null values in the DTO will be applied to the target entity.
     * Other fields in the Order entity are ignored during this update.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerName", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    void updateFromDTO(@MappingTarget Order order, UpdateOrderDTO dto);
}
