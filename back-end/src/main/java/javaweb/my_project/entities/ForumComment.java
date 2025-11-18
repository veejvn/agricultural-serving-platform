package javaweb.my_project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

public class ForumComment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(columnDefinition = "TEXT")
    String content;

    LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnore
    Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_id")
    @JsonIgnore
    Forum forum;
}
