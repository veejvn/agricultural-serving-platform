package javaweb.my_project.dto;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PaymentCreationResponse {
    String paymentUrl;
}
