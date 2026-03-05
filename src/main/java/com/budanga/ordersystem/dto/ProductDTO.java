package com.budanga.ordersystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.validator.constraints.URL;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Product information for display and retrieval")
public class ProductDTO {
    @Schema(description = "Unique identifier of the product", example = "1")
    private Long id;

    @Schema(description = "Name of the product", example = "Wireless Mouse")
    private String name;

    @Schema(description = "Unit price of the product", example = "25.99")
    private BigDecimal price;

    @Schema(description = "Current stock quantity", example = "100")
    private Integer stock;

    @Schema(description = "Whether the product is available for sale", example = "true")
    private Boolean active;

    @URL
    @Schema(description = "URL of the product image", example = "https://example.com/product.jpg")
    private String imageUrl;

    @Schema(description = "Timestamp when the product was registered", example = "2024-03-05T00:00:00")
    private LocalDateTime createdAt;
}
