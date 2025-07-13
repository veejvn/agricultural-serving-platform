package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import javaweb.my_project.enums.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true)
    String email;

    String password;

    String displayName;

    String phone;

    String avatar;

    LocalDate dob;

    @ElementCollection(targetClass =  Role.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "account_roles", joinColumns = @JoinColumn(name = "account_id"))
    @Column(name = "role_name")
    @JsonIgnore
    Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore
    Farmer farmer;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
    @JsonIgnore
    Set<ForumComment> forumComments = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
    @JsonIgnore
    Set<Forum> forums = new HashSet<>();

//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
//    @JsonIgnore
//    Set<ArticleComment> articleComments = new HashSet<>();
//
//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
//    @JsonIgnore
//    Set<Article> articles = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
    @JsonIgnore
    Set<Order> orders = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account", orphanRemoval = true)
    @JsonIgnore
    Set<Address> addresses = new HashSet<>();

}
