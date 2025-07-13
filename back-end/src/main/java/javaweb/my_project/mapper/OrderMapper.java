package javaweb.my_project.mapper;

import javaweb.my_project.dto.order.OrderResponse;
import javaweb.my_project.entities.Order;
import javaweb.my_project.entities.OrderItem;
import javaweb.my_project.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "category.name", target = "category")
    OrderResponse.OrderItemDTO.OrderItemProductResponse toOrderItemProductResponse(Product product);

    OrderResponse.OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    OrderResponse toOrderResponse(Order order);

    List<OrderResponse> toOrderResponseList(List<Order> orders);
}
