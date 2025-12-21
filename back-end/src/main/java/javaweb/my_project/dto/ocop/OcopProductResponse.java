package javaweb.my_project.dto.ocop;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javaweb.my_project.entities.OcopImage;
import javaweb.my_project.enums.OcopStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OcopProductResponse {
    String id;
    Integer star;
    String certificateNumber;
    Integer issuedYear;
    String issuer;
    OcopStatus status;
    String verifiedBy;
    LocalDateTime verifiedAt;
    String reason;
    Set<OcopImage> images = new HashSet<>();
}