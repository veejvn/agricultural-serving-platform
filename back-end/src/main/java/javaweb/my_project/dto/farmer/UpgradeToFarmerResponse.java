package javaweb.my_project.dto.farmer;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpgradeToFarmerResponse {
    FarmerResponse farmerResponse;
    String accessToken;
    String refreshToken;
}
