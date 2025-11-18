package javaweb.my_project.dto.farmer;

import jakarta.validation.constraints.NotNull;
import javaweb.my_project.enums.FarmerStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeFarmerStatusRequest {
    @NotNull(message = "Farmer status is required")
    FarmerStatus status;
}
