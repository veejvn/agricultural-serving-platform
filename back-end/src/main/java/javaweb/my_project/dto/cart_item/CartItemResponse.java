package javaweb.my_project.dto.cart_item;

import javaweb.my_project.dto.product.ProductResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String id;
    Integer quantity;
    ProductResponse product;
}
