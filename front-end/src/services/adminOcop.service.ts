import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const AdminOcopService = {
  getPendingOcopProducts() {
    return service(axios.get(getApiUrl("/admin/ocop/pending")));
  },

  approveOcop(productId: string) {
    return service(axios.post(getApiUrl(`/admin/ocop/${productId}/approve`)));
  },

  rejectOcop(productId: string, reason: string) {
    return service(axios.post(getApiUrl(`/admin/ocop/${productId}/reject`), { reason }));
  },
};

export default AdminOcopService;
