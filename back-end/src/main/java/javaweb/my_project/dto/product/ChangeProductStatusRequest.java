package javaweb.my_project.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import javaweb.my_project.enums.ProductStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeProductStatusRequest {
    @NotBlank(message = "Product id is required")
    String id;
    @NotNull(message = "Product status is required")
    ProductStatus status;
}
