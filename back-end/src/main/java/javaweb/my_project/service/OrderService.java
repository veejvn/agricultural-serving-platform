package javaweb.my_project.service;

import jakarta.transaction.Transactional;
import javaweb.my_project.dto.order.ChangeOrderStatusRequest;
import javaweb.my_project.dto.order.OrderRequest;
import javaweb.my_project.dto.order.OrderResponse;
import javaweb.my_project.entities.*;
import javaweb.my_project.entities.embeddedId.OrderItemId;
import javaweb.my_project.enums.OrderStatus;
import javaweb.my_project.enums.PaymentMethod;
import javaweb.my_project.enums.PaymentStatus;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.OrderMapper;
import javaweb.my_project.repository.*;
import javaweb.my_project.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final FarmerRepository farmerRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final SecurityUtil securityUtil;

    @Transactional
    public OrderResponse create(OrderRequest request) {
        Address address = addressRepository.findById(request.getAddressId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Address not found", "address-e-01"));
        Farmer farmer = farmerRepository.findById(request.getFarmerId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Farmer not found", "farmer-e-01"));
        Account account = securityUtil.getAccount();
        int totalPrice = 0;
        int totalQuantity = 0;

        Set<OrderItem> orderItems = new HashSet<>();

        // Validate payment method first
        Set<PaymentMethod> paymentMethods = Set.of(PaymentMethod.COD, PaymentMethod.VNPAY);
        if (!paymentMethods.contains(request.getPaymentMethod())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid payment method", "order-e-01");
        }

        Order order = Order.builder()
                .note(request.getNote())
                .address(address)
                .account(account)
                .farmer(farmer)
                .paymentMethod(request.getPaymentMethod())
                .build();
        order = orderRepository.save(order);

        for (OrderRequest.OrderItemDTO orderItemDTO : request.getItems()) {
            CartItem cartItem = cartItemRepository.findById(orderItemDTO.getCartItemId()).orElseThrow(
                    () -> new AppException(HttpStatus.NOT_FOUND, "Cart item not found", "cart-item-e-01"));
            Product product = cartItem.getProduct();
            if (cartItem.getQuantity() > product.getInventory()) {
                cartItem.setQuantity(product.getInventory());
            }
            product.setInventory(product.getInventory() - cartItem.getQuantity());
            productRepository.save(product);
            totalQuantity = totalQuantity + cartItem.getQuantity();
            totalPrice = totalPrice + (product.getPrice() * cartItem.getQuantity());
            OrderItemId orderItemId = OrderItemId.builder()
                    .orderItemOrderId(order.getId())
                    .orderItemProductId(product.getId())
                    .build();
            OrderItem orderItem = OrderItem.builder()
                    .orderItemId(orderItemId)
                    .product(product)
                    .order(order)
                    .quantity(cartItem.getQuantity())
                    .build();
            orderItems.add(orderItem);
            cartItemRepository.deleteById(cartItem.getId());
        }

        order.setTotalPrice(totalPrice);
        order.setTotalQuantity(totalQuantity);
        order.setOrderItems(orderItems);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    public List<OrderResponse> getAll() {
        String accountId = securityUtil.getAccountId();
        List<Order> orders = orderRepository.findAllByAccountId(accountId, Sort.by("createdAt").descending());
        return orderMapper.toOrderResponseList(orders);
    }

    public OrderResponse getById(String id) {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        return orderMapper.toOrderResponse(order);
    }

    public List<OrderResponse> getAllByFarmer() {
        String farmerId = securityUtil.getFarmerId();
        List<Order> orders = orderRepository.findAllByFarmerId(farmerId, Sort.by("createdAt").descending());
        return orderMapper.toOrderResponseList(orders);
    }

    public List<OrderResponse> getOrdersByFarmerId(String farmerId) {
        List<Order> orders = orderRepository.findAllByFarmerId(farmerId, Sort.by("createdAt").descending());
        return orderMapper.toOrderResponseList(orders);
    }

    @Transactional
    public OrderResponse consumerChangeStatus(ChangeOrderStatusRequest request) {
        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        Set<OrderStatus> statuses = Set.of(
                OrderStatus.CANCELED,
                OrderStatus.RECEIVED);
        OrderStatus status = request.getStatus();
        if (!statuses.contains(status)) {
            throw new AppException(HttpStatus.FORBIDDEN, "You don't have permission to edit order to this status.",
                    "order-e-02");
        }
        // Không cho phép hủy đơn nếu đã RECEIVED
        if (status.equals(OrderStatus.CANCELED) && order.getStatus().equals(OrderStatus.RECEIVED)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Cannot cancel an order that has been received.",
                    "order-e-05");
        }
        // Không cho phép nhận hàng nếu đơn chưa ở trạng thái DELIVERED
        if (status.equals(OrderStatus.RECEIVED) && !order.getStatus().equals(OrderStatus.DELIVERED)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Order must be in DELIVERED status to receive.",
                    "order-e-06");
        }
        if (status.equals(OrderStatus.RECEIVED)) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Product product = orderItem.getProduct();
                product.setSold(product.getSold() + orderItem.getQuantity());
                productRepository.save(product);
            }
        } else if (status.equals(OrderStatus.CANCELED)) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Product product = orderItem.getProduct();
                product.setInventory(product.getInventory() + orderItem.getQuantity());
                productRepository.save(product);
            }
            order.setPaymentStatus(PaymentStatus.CANCELED);
        }

        if (request.getReason() != null) {
            order.setLastStatusChangeReason(request.getReason());
        }
        order.setStatus(status);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse farmerChangeStatus(ChangeOrderStatusRequest request) {
        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Order not found", "order-e-01"));
        Set<OrderStatus> statuses = Set.of(
                OrderStatus.CONFIRMED,
                OrderStatus.DELIVERING,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELED);
        OrderStatus status = request.getStatus();
        if (!statuses.contains(status)) {
            throw new AppException(HttpStatus.FORBIDDEN, "You don't have permission to edit order to this status.",
                    "order-e-02");
        }
        if (status.equals(OrderStatus.CONFIRMED)) {
            if (!order.getStatus().equals(OrderStatus.PENDING)) {
                throw new AppException(HttpStatus.FORBIDDEN, "Order must be in PENDING status to confirm.",
                        "order-e-03");
            }
        } else if (status.equals(OrderStatus.DELIVERING)) {
            if (!order.getStatus().equals(OrderStatus.CONFIRMED)) {
                throw new AppException(HttpStatus.FORBIDDEN, "Order must be in CONFIRMED status to deliver.",
                        "order-e-04");
            }

        } else if (status.equals(OrderStatus.DELIVERED)) {
            if (!order.getStatus().equals(OrderStatus.DELIVERING)) {
                throw new AppException(HttpStatus.FORBIDDEN, "Order must be in DELIVERING status to mark as delivered.",
                        "order-e-05");
            }
            order.setPaymentStatus(PaymentStatus.PAID);
        } else if (status.equals(OrderStatus.CANCELED)) {
            if (order.getStatus().equals(OrderStatus.RECEIVED)) {
                throw new AppException(HttpStatus.FORBIDDEN, "Cannot cancel an order that has been received.",
                        "order-e-06");
            }
            order.setPaymentStatus(PaymentStatus.CANCELED);
        }
        if (status.equals(OrderStatus.CANCELED)) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Product product = orderItem.getProduct();
                product.setInventory(product.getInventory() + orderItem.getQuantity());
                productRepository.save(product);
            }
        }
        if (request.getReason() != null) {
            order.setLastStatusChangeReason(request.getReason());
        }
        order.setStatus(status);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }
}
