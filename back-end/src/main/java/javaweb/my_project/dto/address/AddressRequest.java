package javaweb.my_project.dto.address;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {

    @NotBlank(message = "Province is required")
    String province;

    @NotBlank(message = "Ward is required")
    String ward;

    @NotBlank(message = "Detail is required")
    String detail;

    Boolean isDefault;

    @NotBlank(message = "Receiver Name is required")
    String receiverName;

    @NotBlank(message = "Receiver Phone is required")
    String receiverPhone;
}
