package javaweb.my_project.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthForgotPasswordRequest {
    @NotNull(message = "Email is required")
    @Email(message  = "Email invalid")
    public String email;
}
