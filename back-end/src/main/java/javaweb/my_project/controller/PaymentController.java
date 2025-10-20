package javaweb.my_project.controller;

import jakarta.servlet.http.HttpServletRequest;
import javaweb.my_project.dto.PaymentCreationResponse;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.dto.order.OrderResponse;
import javaweb.my_project.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<ApiResponse<PaymentCreationResponse>> createPaymentUrl(@PathVariable String orderId,
            HttpServletRequest request) {
        ApiResponse<PaymentCreationResponse> apiResponse = ApiResponse.<PaymentCreationResponse>builder()
                .code("payment-s-01")
                .message("Create payment url successfully")
                .data(paymentService.createPaymentUrl(orderId, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<OrderResponse>> paymentReturn(HttpServletRequest request) {
        ApiResponse<OrderResponse> apiResponse = ApiResponse.<OrderResponse>builder()
                .code("payment-s-02")
                .message("Payment return processed successfully")
                .data(paymentService.handleReturn(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> paymentIpn(HttpServletRequest request) {
        Map<String, String> response = paymentService.handleIpn(request);
        HttpStatus status = "00".equals(response.get("RspCode")) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/order/{orderId}/status")
    public ResponseEntity<ApiResponse<String>> getPaymentStatus(@PathVariable String orderId) {
        String status = paymentService.getPaymentStatus(orderId);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code("payment-s-03")
                .message("Get payment status successfully")
                .data(status)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
