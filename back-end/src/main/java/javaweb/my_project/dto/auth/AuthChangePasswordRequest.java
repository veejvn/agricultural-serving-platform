package javaweb.my_project.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthChangePasswordRequest {
    @NotNull(message = "Current password cannot be blank")
    private String currentPassword;
    @NotNull(message = "New password cannot be blank")
    private String newPassword;
}
