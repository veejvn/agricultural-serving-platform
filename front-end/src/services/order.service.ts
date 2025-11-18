import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import {
  IOrderRequest,
  IOrderResponse,
  IChangeOrderStatusRequest,
} from "@/types/order";

const OrderService = {
  // Tạo đơn hàng mới
  create(data: IOrderRequest) {
    return service(axios.post(getApiUrl("/orders"), data), true);
  },

  // Lấy danh sách tất cả đơn hàng
  getMyOrders() {
    return service(axios.get(getApiUrl("/orders/account")), true);
  },

  // Lấy thông tin đơn hàng theo ID
  getById(orderId: string) {
    return service(axios.get(getApiUrl(`/orders/${orderId}`)), true);
  },

  // Lấy danh sách đơn hàng của farmer
  getAllByFarmer() {
    return service(axios.get(getApiUrl("/orders/farmer")), true);
  },

  // Lấy danh sách đơn hàng theo farmer ID (ADMIN)
  getOrdersByFarmerId(farmerId: string) {
    return service(axios.get(getApiUrl(`/orders/farmer/${farmerId}`)), true);
  },

  // Consumer thay đổi trạng thái đơn hàng
  consumerChangeStatus(data: IChangeOrderStatusRequest) {
    return service(
      axios.post(getApiUrl("/orders/consumer/change-status"), data),
      true
    );
  },

  // Farmer thay đổi trạng thái đơn hàng
  farmerChangeStatus(data: IChangeOrderStatusRequest) {
    return service(
      axios.post(getApiUrl("/orders/farmer/change-status"), data),
      true
    );
  },

  // Lấy tất cả đơn hàng (ADMIN)
  getAllOrders() {
    return service(axios.get(getApiUrl("/orders")), true);
  },
};

export default OrderService;
