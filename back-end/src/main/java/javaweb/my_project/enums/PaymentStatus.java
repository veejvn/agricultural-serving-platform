package javaweb.my_project.enums;

public enum PaymentStatus {
    PENDING,   // Chờ thanh toán
    PAID, // Đã thanh toán thành công
    FAILED,    // Thanh toán thất bại
    REFUNDED,  // Đã hoàn tiền
    CANCELLED  // Đã hủy thanh toán
}
