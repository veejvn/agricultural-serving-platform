package javaweb.my_project.service;

import javaweb.my_project.dto.cart_item.CartItemRequest;
import javaweb.my_project.dto.cart_item.CartItemResponse;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.CartItem;
import javaweb.my_project.entities.Product;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.CarItemMapper;
import javaweb.my_project.repository.CartItemRepository;
import javaweb.my_project.repository.ProductRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;
    private final CarItemMapper carItemMapper;


    public CartItemResponse addCartItem(CartItemRequest request){
        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not fount", "product-e-01")
        );
        Account account = securityUtil.getAccount();
        Optional<CartItem> optionalCartItem = cartItemRepository.findByProductIdAndAccountId(product.getId(), account.getId());
        CartItem cartItem = new CartItem();
        if(optionalCartItem.isPresent()){
            cartItem = optionalCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }else {
            cartItem.setQuantity(request.getQuantity());
            cartItem.setProduct(product);
            cartItem.setAccount(account);
        }
        cartItemRepository.save(cartItem);
        return carItemMapper.toCartItemResponse(cartItem);
    }

    public List<CartItemResponse> getCarItems(){
        String accountId = securityUtil.getAccountId();
        List<CartItem> cartItems = cartItemRepository.findAllByAccountId(accountId, Sort.by("createdAt").descending());
        return carItemMapper.toCartItemResponseList(cartItems);
    }
}
