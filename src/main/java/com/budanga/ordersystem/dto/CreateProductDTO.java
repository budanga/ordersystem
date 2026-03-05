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
@Schema(description = "Data required to register a new product")
public class CreateProductDTO {

    @NotBlank(message = "Name cannot be empty")
    @Schema(description = "Unique name of the product", example = "USB-C Hub")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    @Schema(description = "Initial unit price", example = "45.00")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be positive")
    @Schema(description = "Initial stock quantity", example = "200")
    private Integer stock;
}
