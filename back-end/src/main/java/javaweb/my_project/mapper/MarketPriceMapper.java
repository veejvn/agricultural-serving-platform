package javaweb.my_project.mapper;

import javaweb.my_project.dto.market_price.MarketPriceCreationRequest;
import javaweb.my_project.dto.market_price.MarketPriceResponse;
import javaweb.my_project.dto.market_price.MarketPriceUpdateRequest;
import javaweb.my_project.dto.product.ProductMarketPriceResponse;
import javaweb.my_project.entities.MarketPrice;
import javaweb.my_project.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MarketPriceMapper {

    @Mapping(source = "category.name", target = "category")
    ProductMarketPriceResponse toProductMarketPriceResponse(Product product);

    MarketPrice toMarketPrice(MarketPriceCreationRequest request);

    @Mapping(source = "product", target = "product", qualifiedByName = "mapProduct")
    MarketPriceResponse toMarketPriceResponse(MarketPrice marketPrice);

    @Named("mapProduct")
    default ProductMarketPriceResponse mapProduct(Product product) {
        if (product == null)
            return null;
        return toProductMarketPriceResponse(product);
    }

    void updateMarketPrice(@MappingTarget MarketPrice marketPrice, MarketPriceUpdateRequest request);

    List<MarketPriceResponse> toListMarketResponse(List<MarketPrice> marketPrices);
}
