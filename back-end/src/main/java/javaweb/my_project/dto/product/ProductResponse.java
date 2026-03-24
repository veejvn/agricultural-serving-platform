package javaweb.my_project.dto.product;

import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.dto.image.ImageResponse;
import javaweb.my_project.dto.ocop.OcopProductResponse;
import javaweb.my_project.enums.ProductStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String name;
    String description;
    Integer price;
    Integer inventory;
    Integer sold;
    Double rating;
    String thumbnail;
    String unitPrice;
    ProductStatus status;
    Set<ImageResponse> images = new HashSet<>();
    String category;
    FarmerResponse farmer;
    OcopProductResponse ocop;
    LocalDateTime createdAt;
}
