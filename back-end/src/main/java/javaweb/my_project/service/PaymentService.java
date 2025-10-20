package javaweb.my_project.service;

import jakarta.servlet.http.HttpServletRequest;
import javaweb.my_project.config.VNPayConfig;
import javaweb.my_project.dto.PaymentCreationResponse;
import javaweb.my_project.dto.order.OrderResponse;
import javaweb.my_project.entities.Order;
import javaweb.my_project.entities.Payment;
import javaweb.my_project.enums.PaymentStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.OrderMapper;
import javaweb.my_project.repository.OrderRepository;
import javaweb.my_project.repository.PaymentRepository;
import javaweb.my_project.util.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final VNPayConfig vnPayConfig;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final VNPayUtil vnPayUtil;

    public PaymentCreationResponse createPaymentUrl(String orderId, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        String vnp_Version = vnPayConfig.getVersion();
        String vnp_Command = vnPayConfig.getCommand();
        String orderType = vnPayConfig.getOrderType();
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(order.getTotalPrice() * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang");
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpnUrl", vnPayConfig.getIpnUrl());
        vnp_Params.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;
        PaymentCreationResponse response = new PaymentCreationResponse();
        response.setPaymentUrl(paymentUrl);

        return response;
    }

    public OrderResponse handleReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        // 1️⃣ Xác thực chữ ký
        String signValue = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), vnPayUtil.hashAllFields(fields));
        if (!signValue.equals(vnp_SecureHash)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Invalid signature", "payment-e-02");
        }

        // 2️⃣ Lấy đơn hàng từ DB
        String orderId = request.getParameter("vnp_TxnRef");
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));

        // 3️⃣ Không cập nhật DB, chỉ đọc trạng thái
        PaymentStatus status = order.getPaymentStatus();

        // 4️⃣ Trả về kết quả để frontend hiển thị
        return orderMapper.toOrderResponse(order);
    }

    // IPN (Instant Payment Notification) handler
    public Map<String, String> handleIpn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String signValue = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), vnPayUtil.hashAllFields(fields));

        // 1️⃣ Kiểm tra chữ ký
        if (!signValue.equals(vnp_SecureHash)) {
            return Map.of("RspCode", "97", "Message", "Invalid signature");
        }

        String orderId = fields.get("vnp_TxnRef");
        Order order = orderRepository.findById(orderId).orElse(null);

        // 2️⃣ Kiểm tra tồn tại đơn hàng
        if (order == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        // 3️⃣ Kiểm tra số tiền khớp
        long amount = Long.parseLong(fields.get("vnp_Amount")) / 100; // VNPAY nhân 100 lần
        if (amount != order.getTotalPrice()) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        String responseCode = fields.get("vnp_ResponseCode");
        String transactionStatus = fields.get("vnp_TransactionStatus");

        // 4️⃣ Nếu đã xác nhận thanh toán trước đó
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return Map.of("RspCode", "02", "Message", "Order already confirmed");
        }

        // 5️⃣ Xác nhận thanh toán
        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            order.setPaymentStatus(PaymentStatus.PAID);
            Payment payment = Payment.builder()
                    .transactionId(fields.get("vnp_TransactionNo"))
                    .vnpTxnRef(orderId)
                    .vnpResponseCode(responseCode)
                    .bankCode(fields.get("vnp_BankCode"))
                    .cardType(fields.get("vnp_CardType"))
                    .order(order)
                    .build();
            paymentRepository.save(payment);
            orderRepository.save(order);
            return Map.of("RspCode", "00", "Message", "Confirm Success");
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
            return Map.of("RspCode", "00", "Message", "Payment failed");
        }
    }

    public String getPaymentStatus(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        return order.getPaymentStatus().name();
    }
}
