package com.budanga.ordersystem.dto;

import java.math.BigDecimal;

import org.hibernate.validator.constraints.URL;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data required to update an existing product. Only provided fields will be updated.")
public class UpdateProductDTO {

    @Size(min = 1, message = "Name cannot be empty")
    @Schema(description = "Updated name of the product", example = "Wireless Mechanical Keyboard")
    private String name;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    @Schema(description = "Updated unit price", example = "89.99")
    private BigDecimal price;

    @Min(value = 0, message = "Stock must be positive")
    @Schema(description = "Updated stock level", example = "50")
    private Integer stock;

    @Schema(description = "Updated availability status", example = "false")
    private Boolean active;

    @Size(min = 1, message = "Category cannot be empty")
    @Schema(description = "Updated category of the product", example = "Office Supplies")
    private String category;

    @URL
    @Schema(description = "Updated product image URL", example = "https://example.com/new-product.jpg")
    private String imageUrl;
}
