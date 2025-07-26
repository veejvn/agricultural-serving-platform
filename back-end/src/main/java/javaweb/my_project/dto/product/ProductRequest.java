package javaweb.my_project.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    String name;

    @NotBlank(message = "Description is required")
    String description;

    @NotNull(message = "Price is required")
    Integer price;

    @NotNull(message = "Inventory is required")
    Integer inventory;

    @NotBlank(message = "Thumbnail is required")
    String thumbnail;

    @NotBlank(message = "Unit Price is required")
    String unitPrice;

    //@NotEmpty(message = "At least one image is required")
    Set<String> imagePaths;

    @NotBlank(message = "Category is required")
    String categoryId;
}
