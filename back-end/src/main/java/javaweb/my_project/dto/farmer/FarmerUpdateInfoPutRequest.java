package javaweb.my_project.dto.farmer;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmerUpdateInfoPutRequest {
    @NotBlank(message = "Farmer name is required")
    String name;
    @NotBlank(message = "Farmer avatar is required")
    String avatar;
    @NotBlank(message = "Farmer coverImage is required")
    String coverImage;
    @NotBlank(message = "Farmer description is required")
    String description;
}
