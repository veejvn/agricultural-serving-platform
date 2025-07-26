package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import javaweb.my_project.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;

    @Column(columnDefinition = "LONGTEXT")
    String description;

    Integer price;

    Integer inventory;

    Integer sold;

    Double rating;

    String thumbnail;

    String unitPrice;

    LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProductStatus status;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    MarketPrice marketPrice;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonManagedReference
    Set<Image> images = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    @JsonIgnore
    Set<Review> reviews = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    @JsonIgnore
    Set<CartItem> cartItems = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    @JsonIgnore
    Set<OrderItem> orderItems = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    Farmer farmer;

    @PrePersist
    void onCreate(){
        this.status = ProductStatus.ACTIVE;
        this.rating = 5.0;
        this.sold = 0;
        this.createdAt = LocalDateTime.now();
    }
}
