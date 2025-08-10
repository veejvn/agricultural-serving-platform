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
  getAll() {
    return service(axios.get(getApiUrl("/orders")), true);
  },

  // Lấy thông tin đơn hàng theo ID
  getById(orderId: string) {
    return service(axios.get(getApiUrl(`/orders/${orderId}`)), true);
  },

  // Lấy danh sách đơn hàng của farmer
  getAllByFarmer() {
    return service(axios.get(getApiUrl("/orders/farmer")), true);
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
};

export default OrderService;
