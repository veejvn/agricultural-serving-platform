import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const ProductService = {
  getAllProducts({ page = 0, size = 2 }) {
    return service(axios.get(getApiUrl(`/products?page=${page}&size=${size}`)), true);
  },
};

export default ProductService;
