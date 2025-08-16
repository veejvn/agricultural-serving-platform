package javaweb.my_project.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    private String transactionId; // vnp_TransactionNo từ VNPAY
    private String vnpTxnRef;     // vnp_TxnRef (mã đơn hàng trên VNPAY)
    private String vnpResponseCode; // Mã phản hồi (00 = thành công)
    private String bankCode;
    private String cardType;
    private LocalDateTime payDate;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
