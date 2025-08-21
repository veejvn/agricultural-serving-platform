import { SERVER_URL } from "@/contants/common";


const getApiUrl = (path: string) => {
    return `${SERVER_URL.API }${path}`;
  };
  
  const getAuthUrl = (path: string) => {
    return `${SERVER_URL.AUTH}${path}`;
  };
  
  export { getApiUrl, getAuthUrl };