package javaweb.my_project.dto.ocop;

import javaweb.my_project.enums.OcopStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OcopResponse {
    String id;
    Integer star;
    OcopStatus status;
}
