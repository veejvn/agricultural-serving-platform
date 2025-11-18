package javaweb.my_project.dto.account;

import javaweb.my_project.enums.Role;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    String id;
    String email;
    String displayName;
    String phone;
    String avatar;
    LocalDate dob;
    Set<Role> roles;
    LocalDateTime createdAt;
}
