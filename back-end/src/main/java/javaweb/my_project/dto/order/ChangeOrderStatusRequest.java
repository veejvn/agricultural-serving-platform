package javaweb.my_project.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import javaweb.my_project.enums.OrderStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeOrderStatusRequest {
    @NotBlank(message = "Order is required")
    String orderId;
    @NotNull(message = "Order status is required")
    OrderStatus status;
    String reason;
}
