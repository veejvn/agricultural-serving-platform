import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const categoryService = {
  getAllCategories() {
    return service(axios.get(getApiUrl("/categories")), true);
  },
};

export default categoryService;