package javaweb.my_project.dto.account;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteAccountRequest {
    @NotBlank(message = "ID account is required")
    String id;
}
