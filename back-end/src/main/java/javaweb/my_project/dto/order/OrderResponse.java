package javaweb.my_project.dto.order;

import javaweb.my_project.dto.account.AccountResponse;
import javaweb.my_project.dto.address.AddressResponse;
import javaweb.my_project.dto.farmer.FarmerResponse;
import javaweb.my_project.dto.product.ProductResponse;
import javaweb.my_project.entities.embeddedId.OrderItemId;
import javaweb.my_project.enums.OrderStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    Integer totalPrice;
    Integer totalQuantity;
    String note;
    String lastStatusChangeReason;
    OrderStatus status;
    AddressResponse address;
    AccountResponse account;
    FarmerResponse farmer;
    List<OrderItemDTO> orderItems;
    LocalDateTime createdAt;

    @Data
    public static class OrderItemDTO{
        OrderItemId orderItemId;
        Integer quantity;
        OrderItemProductResponse product;
        @Data
        public static class OrderItemProductResponse{
            String id;
            String name;
            String thumbnail;
            Integer price;
            String category;
        }
    }
}
