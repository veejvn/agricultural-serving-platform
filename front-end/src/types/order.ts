import { IAccountResponse } from "@/types/account";
import { IAddressResponse } from "@/types/address";
import { IFarmerResponse } from "@/types/farmer";

export interface IOrderItemResquest {
  cartItemId: string;
}

export type IPaymentMethod = "COD" | "VNPAY";

export interface IOrderRequest {
  note: string;
  addressId: string;
  farmerId: string;
  paymentMethod: IPaymentMethod;
  items: IOrderItemResquest[];
}

export interface IOrderItemProductResponse {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
  category: string;
}

export interface IOrderItemResponse {
  orderItemId: string;
  quantity: number;
  product: IOrderItemProductResponse;
}

export type IOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DELIVERING"
  | "DELIVERED"
  | "RECEIVED"
  | "CANCELED";

export type IPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELED";

export interface IChangeOrderStatusRequest {
  orderId: string;
  status: IOrderStatus;
  reason?: string;
}

export interface IOrderResponse {
  id: string;
  totalPrice: number;
  totalQuantity: number;
  note: string;
  lastStatusChangeReason: string;
  status: IOrderStatus;
  paymentStatus: IPaymentStatus;
  paymentMethod: IPaymentMethod;
  address: IAddressResponse;
  account: IAccountResponse;
  farmer: IFarmerResponse;
  orderItems: IOrderItemResponse[];
  createdAt: string;
}
