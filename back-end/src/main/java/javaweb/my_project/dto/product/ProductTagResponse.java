package javaweb.my_project.dto.product;

import javaweb.my_project.dto.farmer.FarmerResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductTagResponse {
    String id;
    String name;
    Integer price;
    Integer sold;
    Double rating;
    String thumbnail;
    FarmerResponse farmer;
}
