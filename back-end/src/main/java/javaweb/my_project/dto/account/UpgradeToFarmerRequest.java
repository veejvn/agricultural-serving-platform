package javaweb.my_project.dto.account;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpgradeToFarmerRequest {
    @NotBlank(message = "Farmer name is required")
    String name;
    @NotBlank(message = "Farmer description is required")
    String description;
}
