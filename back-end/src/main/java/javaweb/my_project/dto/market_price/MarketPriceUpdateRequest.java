package javaweb.my_project.dto.market_price;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarketPriceUpdateRequest {
    Integer price;
    String region;
    String productId;
    LocalDateTime dateRecorded;
}
