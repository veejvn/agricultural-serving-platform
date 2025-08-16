package javaweb.my_project.controller;

import javaweb.my_project.dto.PaymentCreationResponse;
import javaweb.my_project.dto.api.ApiResponse;
import javaweb.my_project.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<ApiResponse<PaymentCreationResponse>> createPaymentUrl(@PathVariable String orderId) {
        ApiResponse<PaymentCreationResponse> apiResponse = ApiResponse.<PaymentCreationResponse>builder()
                .code("product-s-01")
                .message("Create payment url successfully")
                .data(paymentService.createPaymentUrl(orderId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/payment-return")
    public ResponseEntity<ApiResponse<Void>> paymentReturn(@RequestParam Map<String, String> params) {
        try {
            paymentService.processPaymentCallback(params);
            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .code("payment-s-02")
                    .message("Payment processed successfully")
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .code("payment-e-01")
                    .message("Payment processing failed: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @PostMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();
        try {
            paymentService.processPaymentCallback(params);
            response.put("RspCode", "00");
            response.put("Message", "Confirm Success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Confirm Fail: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/order/{orderId}/status")
    public ResponseEntity<ApiResponse<String>> getPaymentStatus(@PathVariable String orderId) {
        try {
            String status = paymentService.getPaymentStatus(orderId);
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .code("payment-s-03")
                    .message("Get payment status successfully")
                    .data(status)
                    .build();
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                    .code("payment-e-02")
                    .message("Get payment status failed: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        }
    }
}
