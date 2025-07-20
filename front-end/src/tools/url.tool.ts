import { SERVER_URL } from "@/contants/common.contant";


const getApiUrl = (path: string) => {
    return `${SERVER_URL.API }${path}`;
  };
  
  const getAuthUrl = (path: string) => {
    return `${SERVER_URL.AUTH}${path}`;
  };
  
  export { getApiUrl, getAuthUrl };