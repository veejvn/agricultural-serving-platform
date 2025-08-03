import { IProductResponese } from "@/types/product";

export interface ICartItemRequest {
  productId: string;
  quantity: number;
}

export interface ICartItemResponse {
  id: string;
  quantity: number;
  product: IProductResponese;
  createdAt: string;
}
