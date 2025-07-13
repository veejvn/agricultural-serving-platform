package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import javaweb.my_project.enums.FarmerStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Farmer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String name;

    String avatar;

    String coverImage;

    Double rating;

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    FarmerStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnore
    Account account;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    @JsonIgnore
    Address address;

    @OneToOne(mappedBy = "farmer", cascade = CascadeType.ALL)
    @JsonIgnore
    WeatherInfo weatherInfo;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "farmer", orphanRemoval = true)
    @JsonIgnore
    Set<Product> products =  new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "farmer", orphanRemoval = true)
    @JsonIgnore
    Set<Order> orders = new HashSet<>();

    @PrePersist
    void onCreate(){
        this.status = FarmerStatus.ACTIVE;
        this.rating = 5.0;
    }
}
