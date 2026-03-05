package com.budanga.ordersystem.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Details of a specific item within an order")
public class OrderItemDTO {

    @NotBlank(message = "Product name is required")
    @Schema(description = "Name of the product being ordered", example = "Wireless Mouse")
    private String productName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Schema(description = "Number of units ordered", example = "2")
    private Integer quantity;

    @Schema(description = "Unit price at the moment of the order", example = "25.99")
    private BigDecimal price;
}
