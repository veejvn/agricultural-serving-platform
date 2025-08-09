export type IFarmerStatus = "ACTIVE" | "SELF_BLOCK" | "ADMIN_BLOCK";

export interface IFarmerResponse {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  description?: string;
  status: IFarmerStatus;
}

export interface IUpgradeToFarmerResponse {
  farmerResponse: IFarmerResponse;
  accessToken: string;
  refreshToken: string;
}