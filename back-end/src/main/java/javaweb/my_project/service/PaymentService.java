package javaweb.my_project.service;

import javaweb.my_project.dto.PaymentCreationResponse;
import javaweb.my_project.entities.Order;
import javaweb.my_project.entities.Payment;
import javaweb.my_project.enums.PaymentStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.repository.OrderRepository;
import javaweb.my_project.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${app.vnpay.tmn-code}")
    private String tmnCode;

    @Value("${app.vnpay.hash-secret}")
    private String hashSecret;

    @Value("${app.vnpay.payment-url}")
    private String paymentUrl;

    @Value("${app.vnpay.return-url}")
    private String returnUrl;

    @Value("${app.vnpay.version}")
    private String version;

    @Value("${app.vnpay.command}")
    private String command;

    public PaymentCreationResponse createPaymentUrl(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        try {
            // Sử dụng TreeMap để tự động sắp xếp theo alphabet
            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", version);
            vnpParams.put("vnp_Command", command);
            vnpParams.put("vnp_TmnCode", tmnCode);
            vnpParams.put("vnp_Amount", String.valueOf(order.getTotalPrice() * 100));
            vnpParams.put("vnp_CreateDate", new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_IpAddr", "127.0.0.1");
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + order.getId());
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_BankCode", "VNBANK");
            vnpParams.put("vnp_ReturnUrl", returnUrl);
            vnpParams.put("vnp_TxnRef", order.getId());

            String queryString  = buildQuery(vnpParams);
            String secureHash = hmacSHA512(hashSecret, queryString);
            log.info("VNPAY Query: {}", queryString);
            log.info("VNPAY Hash data to sign: {}", hashSecret + queryString);
            log.info("VNPAY Secure hash: {}", secureHash);

            PaymentCreationResponse response = new PaymentCreationResponse();

            response.setPaymentUrl(
                    paymentUrl + "?" + queryString +
                            "&vnp_SecureHashType=SHA512&vnp_SecureHash=" + secureHash);

            log.info("VNPAY Payment URL: {}", response.getPaymentUrl());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error creating VNPAY payment URL", e);
        }
    }

    public boolean verifyPayment(Map<String, String> params) {
        String receivedHash = params.remove("vnp_SecureHash");
        String query = buildQuery(new TreeMap<>(params));
        String calculatedHash = hashSHA256(query).toUpperCase();
        return calculatedHash.equalsIgnoreCase(receivedHash);
    }

    public void processPaymentCallback(Map<String, String> params) {
        log.info("Processing VNPAY callback with params: {}", params);

        // Tạo bản copy để verify mà không ảnh hưởng đến params gốc
        Map<String, String> verifyParams = new HashMap<>(params);

        if (!verifyPayment(verifyParams)) {
            log.error("Invalid VNPAY signature for params: {}", params);
            throw new RuntimeException("Invalid VNPAY signature");
        }

        String orderId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        log.info("Processing payment for order: {}, response code: {}", orderId, responseCode);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            log.info("Payment successful for order: {}", orderId);

            Payment payment = Payment.builder()
                    .transactionId(params.get("vnp_TransactionNo"))
                    .vnpTxnRef(params.get("vnp_TxnRef"))
                    .vnpResponseCode(params.get("vnp_ResponseCode"))
                    .bankCode(params.get("vnp_BankCode"))
                    .cardType(params.get("vnp_CardType"))
                    .payDate(LocalDateTime.now())
                    .order(order)
                    .build();

            order.setPaymentStatus(PaymentStatus.PAID);
            order.setPayment(payment);

            paymentRepository.save(payment);
            orderRepository.save(order); // Đảm bảo lưu order với payment status mới

            log.info("Payment saved successfully for order: {}", orderId);
        } else {
            // Thanh toán thất bại
            log.warn("Payment failed for order: {}, response code: {}", orderId, responseCode);
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
        }
    }

    public String getPaymentStatus(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        return order.getPaymentStatus().name();
    }

    private String hashSHA256(String data) {
        try {
            String hashData = hashSecret + data;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(hashData.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Cannot hash data", e);
        }
    }

    private String buildQuery(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (sb.length() > 0)
                sb.append("&");
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        return sb.toString();
    }

    public static String hmacSHA512(String key, String data){
        try{
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while signing HMAC SHA512", e);
        }
    }

}
