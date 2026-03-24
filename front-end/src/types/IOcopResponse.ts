import { OcopStatus } from "./OcopStatus";
import { IOcopImageResponse } from "./IOcopImageResponse";

export interface IOcopResponse {
  id: string;
  star: number;
  certificateNumber: string;
  issuedYear: number;
  issuer: string;
  status: OcopStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  reason?: string;
  images: IOcopImageResponse[];
}
