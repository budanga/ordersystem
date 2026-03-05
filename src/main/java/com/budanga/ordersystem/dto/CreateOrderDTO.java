package com.budanga.ordersystem.dto;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data required to create a new order")
public class CreateOrderDTO {

    @NotBlank(message = "Customer name cannot be empty")
    @Schema(description = "Full name of the customer", example = "John Doe")
    private String customerName;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be positive")
    @Schema(description = "Total cost of the order", example = "150.50")
    private BigDecimal totalAmount;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    @Schema(description = "List of products and quantities for this order")
    private List<OrderItemDTO> orderItems;
}
