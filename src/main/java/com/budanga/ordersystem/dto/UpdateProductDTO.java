package com.budanga.ordersystem.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductDTO {
    private String name;
    private BigDecimal price;
    private Integer stock;
    private Boolean active;
}
