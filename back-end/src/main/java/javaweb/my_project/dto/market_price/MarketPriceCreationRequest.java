package javaweb.my_project.dto.market_price;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarketPriceCreationRequest {

    @NotNull(message = "Price cannot be null")
    Integer price;

    @NotNull(message = "Region cannot be null")
    String region;

    @NotNull(message = "Date recorded cannot be null")
    LocalDateTime dateRecorded;

    @NotNull(message = "Product cannot be null")
    String productId;
}
