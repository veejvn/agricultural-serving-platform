package javaweb.my_project.controller;

import jakarta.validation.Valid;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.order.ChangeOrderStatusRequest;
import javaweb.my_project.dto.order.OrderRequest;
import javaweb.my_project.dto.order.OrderResponse;
import javaweb.my_project.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(@RequestBody @Valid OrderRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .code("order-s-01")
                .message("Create order successfully")
                .data(orderService.create(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAll() {
        ApiResponse<List<OrderResponse>> apiResponse = ApiResponse.<List<OrderResponse>>builder()
                .code("order-s-02")
                .message("Get all order successfully")
                .data(orderService.getAll())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable("id") String id) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .code("order-s-03")
                .message("Get order successfully")
                .data(orderService.getById(id))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllByFarmer() {
        ApiResponse<List<OrderResponse>> apiResponse = ApiResponse.<List<OrderResponse>>builder()
                .code("order-s-03")
                .message("Get all order by farmer successfully")
                .data(orderService.getAllByFarmer())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/consumer/change-status")
    public ResponseEntity<ApiResponse<OrderResponse>> consumerChangeStatus(
            @RequestBody @Valid ChangeOrderStatusRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .code("order-s-04")
                .message("Change order status successfully")
                .data(orderService.consumerChangeStatus(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/farmer/change-status")
    public ResponseEntity<ApiResponse<OrderResponse>> farmerChangeStatus(
            @RequestBody @Valid ChangeOrderStatusRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .code("order-s-05")
                .message("Change order status successfully")
                .data(orderService.farmerChangeStatus(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
