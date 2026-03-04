package com.budanga.ordersystem.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.budanga.ordersystem.dto.CreateProductDTO;
import com.budanga.ordersystem.dto.ProductDTO;
import com.budanga.ordersystem.dto.UpdateProductDTO;
import com.budanga.ordersystem.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ProductDTO createProduct(@RequestBody CreateProductDTO createDTO) {
        return productService.createProduct(createDTO);
    }

    @PutMapping("{id}")
    public ProductDTO updateProduct(@PathVariable("id") Long productId, @RequestBody UpdateProductDTO updateDTO) {
        return productService.updateProduct(productId, updateDTO);
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/active")
    public List<ProductDTO> getAllActiveProducts() {
        return productService.getAllActiveProducts();
    }

    @GetMapping("/price")
    public List<ProductDTO> getProductsByPriceBetween(@RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return productService.getProductsByPriceBetween(minPrice, maxPrice);
    }

    @GetMapping("/price/less")
    public List<ProductDTO> getProductsCheaperThan(@RequestParam BigDecimal price) {
        return productService.getProductsCheaperThan(price);
    }

    @GetMapping("/price/more")
    public List<ProductDTO> getProductsMoreExpensiveThan(@RequestParam BigDecimal price) {
        return productService.getProductsMoreExpensiveThan(price);
    }

    @GetMapping("/stock/less")
    public List<ProductDTO> getProductsWithStockLessThan(@RequestParam Integer stock) {
        return productService.getProductsWithStockLessThan(stock);
    }

    @GetMapping("/stock/greater")
    public List<ProductDTO> getProductsWithStockGreaterThan(@RequestParam Integer stock) {
        return productService.getProductsWithStockGreaterThan(stock);
    }

    @GetMapping("/created/before")
    public List<ProductDTO> getProductsCreatedBefore(@RequestParam String date) {
        return productService.getProductsCreatedBefore(LocalDateTime.parse(date));
    }

    @GetMapping("/created/after")
    public List<ProductDTO> getProductsCreatedAfter(@RequestParam String date) {
        return productService.getProductsCreatedAfter(LocalDateTime.parse(date));
    }

    @GetMapping("/price/desc")
    public List<ProductDTO> getAllProductsOrderByPriceDesc() {
        return productService.getAllProductsOrderByPriceDesc();
    }

    @GetMapping("/active/count")
    public Long countActiveProducts() {
        return productService.countActiveProducts();
    }

    @GetMapping("/price/average")
    public BigDecimal averagePrice() {
        return productService.averagePrice();
    }

    @GetMapping("/stock/total")
    public Long totalStock() {
        return productService.totalStock();
    }
}
