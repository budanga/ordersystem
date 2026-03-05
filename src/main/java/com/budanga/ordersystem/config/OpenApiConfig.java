package com.budanga.ordersystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Order System API")
                        .version("1.0")
                        .description("API for managing products and orders, including stock management and statistics.")
                        .contact(new Contact()
                                .name("Budanga")
                                .email("support@budanga.com")));
    }
}
