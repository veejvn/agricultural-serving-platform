export enum Role {
  ADMIN = "ADMIN",
  CONSUMER = "CONSUMER",
  FARMER = "FARMER",
  SPECIALIST = "SPECIALIST",
}

export interface IAccountResponse {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  avatar: string;
  dob: string; // ISO date string
  roles: Role[]; // Assuming roles are represented as an array of strings
}

// Define interfaces for request/response types
export interface IAccountRequest {
  displayName?: string;
  phone?: string;
  avatar?: string;
  dob?: string;
}

export interface IDeleteAccountRequest {
  id: string;
}

export interface IUpgradeToFarmerRequest {
  name: string;
  description?: string;
}
