package javaweb.my_project.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import javaweb.my_project.enums.Role;
import lombok.Data;

@Data
public class AuthLoginRequest {
    @NotNull(message = "Email is required")
    @Email(message  = "Email invalid")
    public String email;
    @NotNull(message = "Password is required")
    @Size(min = 4, message = "Password must be longer than 4 letters")
    public String password;
    @NotNull(message = "Password is required")
    public Role role = Role.CONSUMER;
}
