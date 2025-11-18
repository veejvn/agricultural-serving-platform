package javaweb.my_project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarketPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    Integer price;

    String region;

    LocalDateTime dateRecorded;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    Product product;
}
