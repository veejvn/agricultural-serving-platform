package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OcopImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ocop_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    Ocop ocop;
}
