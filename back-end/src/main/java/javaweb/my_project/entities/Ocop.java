package javaweb.my_project.entities;

import jakarta.persistence.*;
import javaweb.my_project.enums.OcopStatus;
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
public class Ocop {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    Integer star;

    String certificateNumber;

    Integer issuedYear;

    String issuer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    OcopStatus status;

    String verifiedBy;

    LocalDateTime verifiedAt;

    @Column(columnDefinition = "LONGTEXT")
    String reason;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @MapsId
    Product product;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ocop", orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @Builder.Default
    Set<OcopImage> images = new HashSet<>();
}
