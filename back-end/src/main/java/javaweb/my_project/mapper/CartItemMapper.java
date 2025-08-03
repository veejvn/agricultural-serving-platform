package javaweb.my_project.mapper;

import javaweb.my_project.dto.cart_item.CartItemResponse;
import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.entities.CartItem;
import javaweb.my_project.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(source = "category.name", target = "category")
    ProductResponse toProductResponse(Product product);

    @Mapping(source = "product", target = "product", qualifiedByName = "mapProduct")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    @Named("mapProduct")
    default ProductResponse mapProduct(Product product) {
        if (product == null)
            return null;
        return toProductResponse(product);
    }

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);
}
