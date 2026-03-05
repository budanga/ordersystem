package com.budanga.ordersystem.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
>>>>>>> Stashed changes

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< Updated upstream
=======
@EntityListeners(AuditingEntityListener.class)
>>>>>>> Stashed changes
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

<<<<<<< Updated upstream
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
=======
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
>>>>>>> Stashed changes
}
