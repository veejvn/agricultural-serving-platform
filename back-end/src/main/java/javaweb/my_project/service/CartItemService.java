package javaweb.my_project.service;

import javaweb.my_project.dto.cart_item.CartItemRequest;
import javaweb.my_project.dto.cart_item.CartItemResponse;
import javaweb.my_project.entities.Account;
import javaweb.my_project.entities.CartItem;
import javaweb.my_project.entities.Product;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.CartItemMapper;
import javaweb.my_project.repository.CartItemRepository;
import javaweb.my_project.repository.ProductRepository;
import javaweb.my_project.security.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;
    private final CartItemMapper cartItemMapper;

    @Transactional
    public CartItemResponse addCartItem(CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01"));
        Account account = securityUtil.getAccount();
        Optional<CartItem> optionalCartItem = cartItemRepository.findByProductIdAndAccountId(product.getId(),
                account.getId());
        CartItem cartItem;
        if (optionalCartItem.isPresent()) {
            cartItem = optionalCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = new CartItem();
            cartItem.setQuantity(request.getQuantity());
            cartItem.setProduct(product);
            cartItem.setAccount(account);
        }
        CartItem savedCartItem = cartItemRepository.save(cartItem);

        // Detach entity để tránh lazy loading issues
        return cartItemMapper.toCartItemResponse(savedCartItem);
    }

    public List<CartItemResponse> getCarItems() {
        String accountId = securityUtil.getAccountId();
        List<CartItem> cartItems = cartItemRepository.findAllByAccountId(accountId, Sort.by("createdAt").descending());
        return cartItemMapper.toCartItemResponseList(cartItems);
    }

    @Transactional
    public CartItemResponse updateQuantity(String cartItemId, Integer newQuantity) {
        // Validate input
        if (newQuantity <= 0) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0", "cart-item-e-01");
        }

        // Find cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Cart item not found", "cart-item-e-02"));

        // Check ownership - chỉ user sở hữu mới được update
        Account currentAccount = securityUtil.getAccount();
        if (!cartItem.getAccount().getId().equals(currentAccount.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Access denied", "cart-item-e-03");
        }

        // Check product inventory
        Product product = cartItem.getProduct();
        if (newQuantity > product.getInventory()) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Quantity exceeds available inventory (" + product.getInventory() + ")",
                    "cart-item-e-04");
        }

        // Update quantity
        cartItem.setQuantity(newQuantity);
        CartItem savedCartItem = cartItemRepository.save(cartItem);

        return cartItemMapper.toCartItemResponse(savedCartItem);
    }

    @Transactional
    public void deleteCartItem(String cartItemId) {
        // Find cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Cart item not found", "cart-item-e-02"));

        // Check ownership - chỉ user sở hữu mới được xóa
        Account currentAccount = securityUtil.getAccount();
        if (!cartItem.getAccount().getId().equals(currentAccount.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Access denied", "cart-item-e-03");
        }

        // Delete cart item
        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart() {
        // Get current user account
        Account currentAccount = securityUtil.getAccount();

        // Find all cart items of current user
        List<CartItem> userCartItems = cartItemRepository.findAllByAccountId(
                currentAccount.getId(),
                Sort.unsorted());

        // Check if cart is empty
        if (userCartItems.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "Cart is already empty", "cart-item-e-05");
        }

        // Delete all cart items
        cartItemRepository.deleteAll(userCartItems);
    }
}
