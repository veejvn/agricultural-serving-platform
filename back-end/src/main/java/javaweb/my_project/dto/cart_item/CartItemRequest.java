package javaweb.my_project.dto.cart_item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {
    @NotBlank(message = "Product is required")
    String productId;

    @NotNull(message = "Quantity is required")
    Integer quantity;
}
