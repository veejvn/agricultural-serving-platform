package javaweb.my_project.dto.farmer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import javaweb.my_project.enums.FarmerStatus;
import javaweb.my_project.enums.ProductStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeFarmerStatusRequest {
    @NotBlank(message = "Farmer id is required")
    String id;
    @NotNull(message = "Farmer status is required")
    FarmerStatus status;
}
