import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const ProductService = {
  getAllProducts({ page = 0, size = 10 }) {
    return service(
      axios.get(getApiUrl(`/products?page=${page}&size=${size}`)),
      true
    );
  },
  createProduct(data: any) {
    return service(axios.post(getApiUrl("/products"), data), true);
  },
};

export default ProductService;
