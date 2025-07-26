package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import javaweb.my_project.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(columnDefinition = "TEXT")
    String content;

    Double rating;

    String image;

    String video;

    LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Order order;

    @PrePersist
    void onCreate(){
        this.rating = 5.0;
        this.createdAt = LocalDateTime.now();
    }
}
