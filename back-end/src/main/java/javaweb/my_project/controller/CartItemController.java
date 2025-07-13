package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.account.AccountResponse;
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
    public ResponseEntity<ApiResponse<CartItemResponse>> addCartItem(@RequestBody @Valid CartItemRequest request){
        ApiResponse<CartItemResponse> apiResponse =  ApiResponse.<CartItemResponse>builder()
                .code("cart-item-s-01")
                .message("Add cart item successfully")
                .data(cartItemService.addCartItem(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCarItems(){
        ApiResponse<List<CartItemResponse>> apiResponse =  ApiResponse.<List<CartItemResponse>>builder()
                .code("cart-item-s-01")
                .message("Get cart items successfully")
                .data(cartItemService.getCarItems())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
