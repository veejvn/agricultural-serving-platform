export type IFarmerStatus = "ACTIVE" | "SELF_BLOCK" | "ADMIN_BLOCK";

export interface IFarmerResponse {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  description?: string;
  status: IFarmerStatus;
  createdAt: string;
}

export interface IUpgradeToFarmerResponse {
  farmerResponse: IFarmerResponse;
  accessToken: string;
  refreshToken: string;
}

export interface IFarmerUpdateInfoPutRequest {
  name: string;
  avatar: string;
  coverImage: string;
  description: string;
}

export interface IFarmerUpdateInfoPatchRequest {
  name?: string;
  avatar?: string;
  coverImage?: string;
  description?: string;
}

export interface IChangeFarmerStatusRequest {
  status: IFarmerStatus;
}
