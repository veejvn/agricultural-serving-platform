import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import { IAddressRequest } from "@/types/address";
import provincesData from "@/json/province.json";
import wardsData from "@/json/ward.json";

const AddressService = {
  // POST /api/addresses - Create new address
  create(request: IAddressRequest) {
    return service(axios.post(getApiUrl("/addresses"), request), true);
  },

  // GET /api/addresses/{id} - Get address by ID
  getById(id: string) {
    return service(axios.get(getApiUrl(`/addresses/${id}`)), true);
  },

  // GET /api/addresses - Get all addresses of current user
  getAll() {
    return service(axios.get(getApiUrl("/addresses")), true);
  },

  // PUT /api/addresses/{id} - Update address
  update(id: string, request: IAddressRequest) {
    return service(axios.put(getApiUrl(`/addresses/${id}`), request), true);
  },

  // GET /api/addresses/isDefault/{id} - Set address as default
  setAsDefault(id: string) {
    return service(axios.get(getApiUrl(`/addresses/isDefault/${id}`)), true);
  },

  // DELETE /api/addresses/{id} - Delete address
  delete(id: string) {
    return service(axios.delete(getApiUrl(`/addresses/${id}`)), false);
  },

  // Get all provinces
  getProvinces() {
    return Object.values(provincesData);
  },

  // Get wards by province code
  getWardsByProvinceCode(provinceCode: string) {
    return Object.values(wardsData).filter(
      (ward: any) => ward.parent_code === provinceCode
    );
  },
};

export default AddressService;
