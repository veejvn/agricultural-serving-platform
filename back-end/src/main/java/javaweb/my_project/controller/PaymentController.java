package javaweb.my_project.controller;

import javaweb.my_project.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/create")
    public String createPayment(@RequestParam("amount") String amount) {
        Map<String, String> params = new HashMap<>();
        params.put("amount", amount);
        return paymentService.createPaymentUrl(params);
    }

    @GetMapping("/vnpay-return")
    public String handleVnPayReturn(@RequestParam Map<String, String> allParams) {
        // Xử lý kết quả trả về từ VNPAY
        // Kiểm tra chữ ký và trạng thái giao dịch
        return allParams.toString();
    }
}
