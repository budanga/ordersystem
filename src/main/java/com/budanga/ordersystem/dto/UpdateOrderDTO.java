package com.budanga.ordersystem.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data required to update an order's status")
public class UpdateOrderDTO {
    @Schema(description = "New completion status of the order", example = "true")
    private Boolean completed;
}
