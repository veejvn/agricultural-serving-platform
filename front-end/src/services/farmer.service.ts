import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import {
  IFarmerUpdateInfoPatchRequest,
  IFarmerUpdateInfoPutRequest,
  IChangeFarmerStatusRequest,
  IFarmerResponse,
} from "@/types/farmer";
import { IAddressRequest, IAddressResponse } from "@/types/address"; // Added import for Address types

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

  // Farmer Address Management
  createAddress(data: IAddressRequest) {
    return service(axios.post(getApiUrl("/farmers/address"), data), true);
  },

  updateAddress(addressId: string, data: IAddressRequest) {
    return service(
      axios.patch(getApiUrl(`/farmers/address/${addressId}`), data),
      true
    );
  },

  deleteAddress(addressId: string) {
    return service(axios.delete(getApiUrl(`/farmers/address/${addressId}`)), true);
  },

  // Cập nhật toàn bộ thông tin farmer (FARMER, PUT)
  updateFarmerInfoPut(data: IFarmerUpdateInfoPutRequest) {
    return service(axios.put(getApiUrl("/farmers"), data), true);
  },

  // Cập nhật một phần thông tin farmer (FARMER, PATCH)
  updateFarmerInfoPatch(data: IFarmerUpdateInfoPatchRequest) {
    return service(axios.patch(getApiUrl("/farmers"), data), true);
  },

  // Thay đổi trạng thái farmer (ADMIN)
  changeFarmerStatus(farmerId: string, data: IChangeFarmerStatusRequest) {
    return service(
      axios.post(getApiUrl(`/farmers/${farmerId}/status`), data),
      true
    );
  },
};

export default FarmerService;
