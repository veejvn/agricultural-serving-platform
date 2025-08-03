import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import { AccountRequest, DeleteAccountRequest, UpgradeToFarmerRequest } from "@/types/account";

const AccountService = {
  // GET /api/accounts - Get current user's account info
  getAccount() {
    return service(axios.get(getApiUrl("/accounts")), true);
  },

  // PUT /api/accounts - Update account information
  updateAccount(request: AccountRequest) {
    return service(axios.put(getApiUrl("/accounts"), request), true);
  },

  // POST /api/accounts/upgradeToFarmer - Upgrade account to farmer
  upgradeToFarmer(request: UpgradeToFarmerRequest) {
    return service(
      axios.post(getApiUrl("/accounts/upgradeToFarmer"), request),
      true
    );
  },

  // DELETE /api/accounts - Delete account
  deleteAccount(request: DeleteAccountRequest) {
    return service(
      axios.delete(getApiUrl("/accounts"), { data: request }),
      false
    );
  },

  // GET /api/accounts/all - Get all accounts (Admin only)
  getAllAccounts() {
    return service(axios.get(getApiUrl("/accounts/all")), true);
  },
};

export default AccountService;
