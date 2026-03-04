package com.budanga.ordersystem.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductDTO {

    @Size(min = 1, message = "Name cannot be empty")
    private String name;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal price;

    @Min(value = 0, message = "Stock must be positive")
    private Integer stock;

    private Boolean active;
}
