import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const ProductService = {
  // Lấy tất cả sản phẩm active với phân trang (public)
  getAllProducts({ page, size }: { page?: number; size?: number }) {
    return service(
      axios.get(getApiUrl(`/products?page=${page}&size=${size}`)),
      true
    );
  },

  // Tạo sản phẩm mới (FARMER)
  createProduct(data: any) {
    return service(axios.post(getApiUrl("/products"), data), true);
  },

  // Lấy tất cả sản phẩm (ADMIN)
  getAllByAdmin() {
    return service(axios.get(getApiUrl("/products/admin")), true);
  },

  // Lấy sản phẩm của farmer hiện tại (FARMER)
  getAllByFarmer() {
    return service(axios.get(getApiUrl("/products/farmer")), true);
  },

  getAllByFarmerId(farmerId: string) {
    return service(axios.get(getApiUrl(`/products/farmer/${farmerId}`)), true);
  },

  // Lấy sản phẩm theo ID
  getById(id: string) {
    return service(axios.get(getApiUrl(`/products/${id}`)), true);
  },

  // Cập nhật sản phẩm (FARMER)
  updateProduct(id: string, data: any) {
    return service(axios.put(getApiUrl(`/products/${id}`), data), true);
  },

  // Xóa sản phẩm
  deleteProduct(id: string) {
    return service(axios.delete(getApiUrl(`/products/${id}`)), true);
  },

  // Thay đổi trạng thái sản phẩm (ADMIN)
  adminChangeStatus(data: any) {
    // Sử dụng any cho data
    return service(
      axios.post(getApiUrl("/products/admin/change-status"), data),
      true
    );
  },

  // Lấy danh sách tên sản phẩm (public)
  getProductNames() {
    return service(axios.get(getApiUrl("/products/names")), true);
  },
};

export default ProductService;
