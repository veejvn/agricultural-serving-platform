package javaweb.my_project.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthVerifyForgotPasswordRequest {
    @NotNull(message = "New password cannot be blank")
    private String newPassword;
    @NotNull(message = "Code cannot be blank")
    private String code;
}
