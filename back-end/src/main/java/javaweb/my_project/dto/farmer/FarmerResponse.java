package javaweb.my_project.dto.farmer;

import javaweb.my_project.enums.FarmerStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FarmerResponse {
    String id;
    String name;
    String avatar;
    String coverImage;
    Double rating;
    String description;
    FarmerStatus status;
    LocalDateTime createdAt;
}
