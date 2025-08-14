package javaweb.my_project.dto.market_price;

import javaweb.my_project.dto.product.ProductMarketPriceResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarketPriceResponse {
    String id;
    Integer price;
    String region;
    LocalDateTime dateRecorded;
    ProductMarketPriceResponse product;
}
