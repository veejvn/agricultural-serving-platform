export interface IAccountResponse {
    id: string;
    email: string;
    displayName: string;
    phone: string;
    avatar: string;
    dob: string; // ISO date string
    roles: string[]; // Assuming roles are represented as an array of strings
}

// Define interfaces for request/response types
export interface AccountRequest {
  displayName?: string;
  phone?: string;
  avatar?: string;
  dob?: string;
}

export interface DeleteAccountRequest {
  id: string;
}

export interface UpgradeToFarmerRequest {
  farmName: string;
  farmAddress: string;
  farmDescription?: string;
}