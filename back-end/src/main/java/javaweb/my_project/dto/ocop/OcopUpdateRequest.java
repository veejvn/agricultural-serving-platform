package javaweb.my_project.dto.ocop;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OcopUpdateRequest {
    @Min(value = 3, message = "Star must be between 3 and 5")
    @NotNull(message = "OCOP star is required")
    Integer star;

    @NotBlank(message = "Certificate number is required")
    String certificateNumber;

    @NotNull(message = "Issued year is required")
    Integer issuedYear;

    @NotBlank(message = "Issuer is required")
    String issuer;

    @Size(min = 1, message = "At least one image is required for OCOP certification")
    Set<String> imagePaths;
}
