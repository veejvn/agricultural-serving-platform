import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import {
  IFarmerUpdateInfoPatchRequest,
  IFarmerUpdateInfoPutRequest,
} from "@/types/farmer";

const FarmerService = {
  // Lấy thông tin farmer theo id (public)
  getFarmer(id: string) {
    return service(axios.get(getApiUrl(`/farmers/${id}`)), true);
  },

  // Lấy thông tin farmer của owner hiện tại (FARMER)
  getFarmerByOwner() {
    return service(axios.get(getApiUrl("/farmers/owner")), true);
  },

  getAllFarmers() {
    return service(axios.get(getApiUrl("/farmers")), true);
  },

  // Cập nhật toàn bộ thông tin farmer (FARMER, PUT)
  updateFarmerInfoPut(data: IFarmerUpdateInfoPutRequest) {
    return service(axios.put(getApiUrl("/farmers"), data), true);
  },

  // Cập nhật một phần thông tin farmer (FARMER, PATCH)
  updateFarmerInfoPatch(data: IFarmerUpdateInfoPatchRequest) {
    return service(axios.patch(getApiUrl("/farmers"), data), true);
  },
};

export default FarmerService;
