import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import { IAddressRequest } from "@/types/address";

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
};

export default AddressService;
