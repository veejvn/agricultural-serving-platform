package javaweb.my_project.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthRefreshTokenRequest {
    @NotNull(message = "Refresh token must be not null")
    String refreshToken;
}
