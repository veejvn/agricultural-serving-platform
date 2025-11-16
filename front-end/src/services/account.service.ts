import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import {
  IAccountRequest,
  IDeleteAccountRequest,
  IUpgradeToFarmerRequest,
} from "@/types/account";

const AccountService = {
  // GET /api/accounts - Get current user's account info
  getAccount() {
    return service(axios.get(getApiUrl("/accounts")), true);
  },

  // PUT /api/accounts - Update account information (full update)
  updateAccount(request: IAccountRequest) {
    return service(axios.put(getApiUrl("/accounts"), request), true);
  },

  // PATCH /api/accounts - Partially update account information
  patchAccount(request: Partial<IAccountRequest>) {
    return service(axios.patch(getApiUrl("/accounts"), request), true);
  },

  // POST /api/accounts/upgradeToFarmer - Upgrade account to farmer
  upgradeToFarmer(request: IUpgradeToFarmerRequest) {
    return service(
      axios.post(getApiUrl("/accounts/upgradeToFarmer"), request),
      true
    );
  },

  // DELETE /api/accounts/{id} - Delete account by ID (Admin only)
  deleteAccountById(id: string) {
    return service(axios.delete(getApiUrl(`/accounts/${id}`)), false);
  },

  // GET /api/accounts/all - Get all accounts (Admin only)
  getAllAccounts() {
    return service(axios.get(getApiUrl("/accounts/all")), true);
  },

  // GET /api/accounts/{id} - Get account by ID (Admin only)
  getAccountById(id: string) {
    return service(axios.get(getApiUrl(`/accounts/${id}`)), true);
  },
};

export default AccountService;
