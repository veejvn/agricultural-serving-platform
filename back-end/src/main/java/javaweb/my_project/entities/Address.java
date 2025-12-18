package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(nullable = false)
    String province;
    @Column(nullable = false)
    String ward;
    @Column(nullable = false)
    String detail;
    @Column(nullable = false)
    @JsonIgnore
    Boolean isDefault;
    @Column(nullable = false)
    String receiverName;
    @Column(nullable = false)
    String receiverPhone;

    @OneToOne(mappedBy = "address")
    @JsonIgnore
    Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonBackReference
    Account account;

}
