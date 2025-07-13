package javaweb.my_project.dto.account;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountRequest {
    String displayName;
    String phone;
    String avatar;
    LocalDate dob;
}
