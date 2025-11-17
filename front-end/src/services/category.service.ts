import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

const CATEGORY_API_ENDPOINT = "/categories";

const categoryService = {
  getAllCategories() {
    return service(axios.get(getApiUrl(CATEGORY_API_ENDPOINT)), true);
  },

  createCategory(data: CreateCategoryRequest) {
    return service(axios.post(getApiUrl(CATEGORY_API_ENDPOINT), data), true);
  },

  updateCategory(id: string, data: UpdateCategoryRequest) {
    return service(axios.put(getApiUrl(`${CATEGORY_API_ENDPOINT}/${id}`), data), true);
  },

  deleteCategory(id: string) {
    return service(axios.delete(getApiUrl(`${CATEGORY_API_ENDPOINT}/${id}`)), true);
  },
};

export default categoryService;
