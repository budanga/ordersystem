package com.budanga.ordersystem.config;

import com.budanga.ordersystem.entity.Product;
import com.budanga.ordersystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final ProductRepository productRepository;

        @Override
        public void run(String... args) {
                // Clear existing products to ensure synced categories and working images
                productRepository.deleteAll();

                log.info("Initializing database with dummy products...");
                List<Product> products = new ArrayList<>();

                // Tech
                products.add(createProduct("Smartphone Galaxy Z", 999.99, 15, "Tech",
                                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Laptop Pro 16", 2499.50, 8, "Tech",
                                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Noise Cancelling Headphones", 349.00, 25, "Tech",
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Smartwatch Series 7", 399.99, 30, "Tech",
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("4K Ultra HD Monitor", 549.00, 12, "Tech",
                                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"));

                // Home
                products.add(createProduct("Espresso Machine", 189.90, 10, "Home", "/products/espresso_machine.png"));
                products.add(createProduct("Air Fryer Pro", 129.99, 20, "Home", "/products/air_fryer.png"));
                products.add(createProduct("Cordless Vacuum", 299.00, 15, "Home", "/products/vacuum.png"));
                products.add(createProduct("Cast Iron Skillet", 45.00, 40, "Home", "/products/skillet.png"));
                products.add(createProduct("Electric Kettle", 35.50, 50, "Home",
                                "/products/electric_kettle.png"));

                // Fashion
                products.add(createProduct("Classic Leather Jacket", 199.00, 15, "Fashion",
                                "/products/leather_jacket.png"));
                products.add(createProduct("Performance Running T-Shirt", 25.99, 60, "Fashion",
                                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Denim Jeans Slim Fit", 59.90, 40, "Fashion",
                                "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Wool Blend Overcoat", 149.00, 10, "Fashion", "/products/overcoat.png"));
                products.add(createProduct("Cotton Essential Hoodie", 39.99, 50, "Fashion",
                                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"));

                // Accessories
                products.add(createProduct("Aviator Sunglasses", 120.00, 25, "Accessories",
                                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Leather Belt Brown", 35.00, 100, "Accessories",
                                "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Minimalist Wallet", 45.00, 40, "Accessories",
                                "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Silk Patterned Scarf", 65.00, 15, "Accessories",
                                "/products/silk_scarf.png"));
                products.add(createProduct("Minimalist Backpack", 89.00, 20, "Accessories", "/products/backpack.png"));

                // Wellness
                products.add(createProduct("Yoga Mat Premium", 45.00, 30, "Wellness", "/products/yoga_mat.png"));
                products.add(createProduct("Aromatherapy Diffuser", 35.00, 50, "Wellness",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"));
                products.add(createProduct("Weighted Blanket", 110.00, 10, "Wellness", "/products/blanket.png"));
                products.add(createProduct("Therapeutic Foam Roller", 25.00, 25, "Wellness",
                                "/products/foam_roller.png"));
                products.add(createProduct("Hydration Smart Bottle", 55.00, 40, "Wellness",
                                "/products/smart_bottle.png"));

                // Lifestyle
                products.add(createProduct("Leather Journal", 25.00, 100, "Lifestyle",
                                "/products/leather_journal.png"));
                products.add(createProduct("Handmade Ceramic Mug", 18.00, 60, "Lifestyle",
                                "/products/ceramic_mug.png"));
                products.add(createProduct("Organic Tea Set", 30.00, 45, "Lifestyle", "/products/tea_set.png"));
                products.add(createProduct("Eco Friendly Tote Bag", 15.00, 200, "Lifestyle",
                                "/products/tote_bag.png"));
                products.add(createProduct("Luxury Candle Soy Wax", 22.00, 80, "Lifestyle",
                                "/products/soy_candle.png"));

                productRepository.saveAll(products);
                log.info("Database initialized with {} products.", products.size());
        }

        private Product createProduct(String name, double price, int stock, String category, String imageUrl) {
                Product product = new Product();
                product.setName(name);
                product.setPrice(BigDecimal.valueOf(price));
                product.setStock(stock);
                product.setCategory(category);
                product.setImageUrl(imageUrl);
                product.setActive(true);
                return product;
        }
}
