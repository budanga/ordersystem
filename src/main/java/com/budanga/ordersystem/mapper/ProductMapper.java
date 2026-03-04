package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.entity.Product;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getStock(),
                product.getActive(),
                product.getCreationDate());
    }

    public static Product fromCreateDTO(CreateProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        return product;
    }

    public static void updateFromDTO(Product product, UpdateProductDTO dto) {
        if (dto.getName() != null)
            product.setName(dto.getName());
        if (dto.getPrice() != null)
            product.setPrice(dto.getPrice());
        if (dto.getStock() != null)
            product.setStock(dto.getStock());
        if (dto.getActive() != null)
            product.setActive(dto.getActive());
    }
}
