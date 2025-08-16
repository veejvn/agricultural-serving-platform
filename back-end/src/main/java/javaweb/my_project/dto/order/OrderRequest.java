package javaweb.my_project.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import javaweb.my_project.enums.PaymentMethod;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    String note;

    @NotBlank(message = "Address is required")
    String addressId;

    @NotEmpty(message = "At least one order item is required")
    @Size(min = 1, message = "Min 1")
    List<@Valid OrderItemDTO> items;

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod;

    @NotNull(message = "Farmer is required")
    String farmerId;

    @Data
    public static class OrderItemDTO {
        @NotNull(message = "Cart item is required")
        String cartItemId;
    }
}
