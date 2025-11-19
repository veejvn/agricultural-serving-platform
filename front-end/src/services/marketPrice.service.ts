import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import {
  IMarketPriceCreationRequest,
  IMarketPricPatchUpdateRequest,
} from "@/types/market-price";

const MarketPriceService = {
  // Lấy tất cả giá thị trường (public)
  getAllMarketPrices() {
    return service(axios.get(getApiUrl("/market-prices")), true);
  },
  // Lấy giá thị trường theo ID
  getMarketPriceById(id: string) {
    return service(axios.get(getApiUrl(`/market-prices/${id}`)), true);
  },
  // Tạo giá thị trường mới (ADMIN)
  createMarketPrice(data: IMarketPriceCreationRequest) {
    return service(axios.post(getApiUrl("/market-prices"), data), true);
  },
  // Cập nhật giá thị trường (ADMIN)
  updateMarketPrice(id: string, data: IMarketPricPatchUpdateRequest) {
    return service(axios.patch(getApiUrl(`/market-prices/${id}`), data), true);
  },
  // Xóa giá thị trường (ADMIN)
  deleteMarketPrice(id: string) {
    return service(axios.delete(getApiUrl(`/market-prices/${id}`)), true);
  },
};

export default MarketPriceService;
