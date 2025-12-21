package javaweb.my_project.dto.product;

import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.dto.ocop.OcopResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductTagResponse {
    String id;
    String name;
    String description;
    Integer price;
    Integer sold;
    Double rating;
    String thumbnail;
    String unitPrice;
    String categoryId;
    FarmerResponse farmer;
    OcopResponse ocop;
}
