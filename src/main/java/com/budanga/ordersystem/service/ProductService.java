package com.budanga.ordersystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.exception.ResourceNotFoundException;
import com.budanga.ordersystem.mapper.ProductMapper;
import com.budanga.ordersystem.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDTO createProduct(CreateProductDTO createDTO) {
        // Check if a product with the same name already exists
        Optional<Product> existing = productRepository.findByName(createDTO.getName());

        if (existing.isPresent()) {
            throw new IllegalArgumentException("A product with that name already exists.");
        }

        // Convert the DTO to an entity
        Product product = ProductMapper.fromCreateDTO(createDTO);

        // Save the product to the database
        Product savedProduct = productRepository.save(product);

        // Return the saved product converted to DTO
        return ProductMapper.toDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long productId, UpdateProductDTO updateDTO) {
        // Check if the product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

        // Check if the updated name already exists in another product
        if (updateDTO.getName() != null && !updateDTO.getName().equals(product.getName())) {
            productRepository.findByName(updateDTO.getName()).ifPresent(p -> {
                throw new IllegalArgumentException("A product with that name already exists.");
            });
        }

        // Apply the changes from the DTO to the entity
        ProductMapper.updateFromDTO(product, updateDTO);

        // Save the updated product to the database
        Product updatedProduct = productRepository.save(product);

        // Return the updated product converted to DTO
        return ProductMapper.toDTO(updatedProduct);
    }

    public ProductDTO getProductById(Long productId) {
        // Check if the product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

        // Return the product converted to DTO
        return ProductMapper.toDTO(product);
    }

    public List<ProductDTO> getAllProducts() {
        return mapToDTOList(productRepository.findAll());
    }

    public List<ProductDTO> getAllActiveProducts() {
        return mapToDTOList(productRepository.findByActiveTrue());
    }

    public List<ProductDTO> getProductsByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return mapToDTOList(productRepository.findByPriceBetween(minPrice, maxPrice));
    }

    public List<ProductDTO> getProductsCheaperThan(BigDecimal price) {
        return mapToDTOList(productRepository.findByPriceLessThan(price));
    }

    public List<ProductDTO> getProductsMoreExpensiveThan(BigDecimal price) {
        return mapToDTOList(productRepository.findByPriceGreaterThan(price));
    }

    public List<ProductDTO> getProductsWithStockLessThan(Integer stock) {
        return mapToDTOList(productRepository.findByStockLessThan(stock));
    }

    public List<ProductDTO> getProductsWithStockGreaterThan(Integer stock) {
        return mapToDTOList(productRepository.findByStockGreaterThan(stock));
    }

    public List<ProductDTO> getProductsCreatedBefore(LocalDateTime date) {
        return mapToDTOList(productRepository.findByCreatedAtBefore(date));
    }

    public List<ProductDTO> getProductsCreatedAfter(LocalDateTime date) {
        return mapToDTOList(productRepository.findByCreatedAtAfter(date));
    }

    public List<ProductDTO> getAllProductsOrderByPriceDesc() {
        return mapToDTOList(productRepository.findAllByOrderByPriceDesc());
    }

    public Long countActiveProducts() {
        return productRepository.countActiveProducts();
    }

    public BigDecimal averagePrice() {
        return productRepository.averagePrice();
    }

    public Long totalStock() {
        return productRepository.totalStock();
    }

    private final List<ProductDTO> mapToDTOList(List<Product> products) {
        // Convert each product entity to a DTO
        List<ProductDTO> dtoList = new ArrayList<>();
        for (Product p : products)
            dtoList.add(ProductMapper.toDTO(p));
        return dtoList;
    }
}
