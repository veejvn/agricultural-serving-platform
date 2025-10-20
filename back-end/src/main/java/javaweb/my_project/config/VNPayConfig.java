package javaweb.my_project.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VNPayConfig {
    @Value("${app.vnpay.tmn-code}")
    private String tmnCode;
    @Value("${app.vnpay.hash-secret}")
    private String hashSecret;
    @Value("${app.vnpay.payment-url}")
    private String vnpUrl;
    @Value("${app.vnpay.return-url}")
    private String returnUrl;
    @Value("${app.vnpay.ipn-url}")
    private String ipnUrl;
    @Value("${app.vnpay.version}")
    private String version;
    @Value("${app.vnpay.command}")
    private String command;
    @Value("${app.vnpay.order-type}")
    private String orderType;
}