package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.cart_item.CartItemRequest;
import javaweb.my_project.dto.cart_item.CartItemResponse;
import javaweb.my_project.service.CartItemService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemController {

    private final CartItemService cartItemService;

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemResponse>> addCartItem(@RequestBody @Valid CartItemRequest request) {
        ApiResponse<CartItemResponse> apiResponse = ApiResponse.<CartItemResponse>builder()
                .code("cart-item-s-01")
                .message("Add cart item successfully")
                .data(cartItemService.addCartItem(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCarItems() {
        ApiResponse<List<CartItemResponse>> apiResponse = ApiResponse.<List<CartItemResponse>>builder()
                .code("cart-item-s-02")
                .message("Get cart items successfully")
                .data(cartItemService.getCarItems())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateQuantity(
            @PathVariable String id,
            @RequestParam Integer quantity) {
        ApiResponse<CartItemResponse> apiResponse = ApiResponse.<CartItemResponse>builder()
                .code("cart-item-s-03")
                .message("Update cart item quantity successfully")
                .data(cartItemService.updateQuantity(id, quantity))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable String id) {
        cartItemService.deleteCartItem(id);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("cart-item-s-04")
                .message("Delete cart item successfully")
                .data(null)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartItemService.clearCart();
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("cart-item-s-05")
                .message("Clear cart successfully")
                .data(null)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
