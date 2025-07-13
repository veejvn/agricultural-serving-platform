package javaweb.my_project.mapper;

import javaweb.my_project.dto.cart_item.CartItemResponse;
import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.entities.CartItem;
import javaweb.my_project.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CarItemMapper {

    @Mapping(source = "category.name", target = "category")
    ProductResponse toProductResponse(Product product);

    CartItemResponse toCartItemResponse(CartItem cartItem);

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);
}
