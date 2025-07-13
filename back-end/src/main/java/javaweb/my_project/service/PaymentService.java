package javaweb.my_project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

@Service
public class PaymentService {
    @Value("${app.vnpay.tmn_code}")
    private String tmnCode;

    @Value("${app.vnpay.hash_secret}")
    private String hashSecret;

    @Value("${app.vnpay.payment_url}")
    private String paymentUrl;

    @Value("${app.vnpay.return_url}")
    private String returnUrl;

    public String createPaymentUrl(Map<String, String> params) {
        try {
            SortedMap<String, String> sortedParams = new TreeMap<>(params);
            sortedParams.put("vnp_Version", "2.1.0");
            sortedParams.put("vnp_Command", "pay");
            sortedParams.put("vnp_TmnCode", tmnCode);
            sortedParams.put("vnp_Locale", "vn");
            sortedParams.put("vnp_CurrCode", "VND");
            sortedParams.put("vnp_TxnRef", String.valueOf(System.currentTimeMillis())); // Mã giao dịch
            sortedParams.put("vnp_OrderInfo", "Thanh toan don hang");
            sortedParams.put("vnp_OrderType", "billpayment");
            sortedParams.put("vnp_Amount", String.valueOf(Long.parseLong(params.get("amount")) * 100)); // Số tiền tính bằng VND
            sortedParams.put("vnp_ReturnUrl", returnUrl);
            sortedParams.put("vnp_CreateDate", java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                        .append('&');
            }

            String queryWithoutLastChar = query.substring(0, query.length() - 1); // Loại bỏ dấu & cuối
            String secureHash = hmacSHA512(hashSecret, queryWithoutLastChar);
            return paymentUrl + "?" + queryWithoutLastChar + "&vnp_SecureHash=" + secureHash;
        } catch (Exception e) {
            throw new RuntimeException("Error while creating payment URL", e);
        }
    }

    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac hmac = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while generating HMAC SHA512 hash", e);
        }
    }
}
