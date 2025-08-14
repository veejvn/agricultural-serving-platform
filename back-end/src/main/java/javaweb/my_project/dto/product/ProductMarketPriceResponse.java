package javaweb.my_project.dto.product;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMarketPriceResponse {
    String id;
    String name;
    String unitPrice;
    String category;
}
