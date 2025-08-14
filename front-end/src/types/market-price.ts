import { IProductMarketPriceResponse } from "@/types/product";

export interface IMarkerPriceResponse {
  id: string;
  price: number;
  dateRecorded: string;
  region: string;
  product: IProductMarketPriceResponse;
}

export interface IMarketPriceCreationRequest {
  price: number;
  dateRecorded: string;
  region: string;
  productId: string;
}

export interface IMarketPricPatchUpdateRequest {
  price?: number;
  dateRecorded?: string;
  region?: string;
}
