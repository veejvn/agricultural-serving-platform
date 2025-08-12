package javaweb.my_project.dto.farmer;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmerUpdateInfoPatchRequest {
    String name;
    String avatar;
    String coverImage;
    String description;
}
