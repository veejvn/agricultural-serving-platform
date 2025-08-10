import { IAccountResponse } from "@/types/account";
import { IAddressResponse } from "@/types/address";

export interface IOrderItemResquest {
  cartItemId: string;
}

export interface IOrderRequest {
  note: string;
  addressId: string;
  farmerId: string;
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

export interface IChangeOrderStatusRequest {
  orderId: string;
  status: IOrderStatus;
}

export interface IOrderResponse {
  id: string;
  totalPrice: number;
  totalQuantity: number;
  note: string;
  status: IOrderStatus;
  address: IAddressResponse;
  account: IAccountResponse;
  orderItems: IOrderItemResponse[];
  createdAt: string;
}
