package javaweb.my_project.dto.address;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {
    String id;
    String province;
    String ward;
    String detail;
    Boolean isDefault;
    String receiverName;
    String receiverPhone;
}
