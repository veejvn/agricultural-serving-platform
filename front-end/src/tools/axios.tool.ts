import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import _ from "lodash";

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  //timeout: 20000, // Add timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken, isLoggedIn } = useAuthStore.getState();
    console.log("Access Token:" + accessToken);
    // console.log("Is LoggedIn:" + isLoggedIn);
    // Add token if user is logged in and has access token
    if (accessToken && isLoggedIn) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      const clearTokens = useAuthStore.getState().clearTokens;
      if (clearTokens) {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export async function service(axiosPromise: any, getData = false) {
  try {
    const response: any = await axiosPromise;
    //console.log(response);
    const result = getData
      ? _.get(response, "data.data")
      : { ...response.data, status: response.status };
    return [result, null];
  } catch (error: any) {
    //console.log(error)
    // Improved error handling
    let errorResponse;

    if (error.response) {
      // Server responded with error status
      errorResponse = {
        ...error.response.data,
        status: error.response.status,
        message: error.response.data?.message || "Server error",
      };
    } else if (error.request) {
      // Network error
      errorResponse = {
        message: "Network error - please check your connection",
        status: 0,
      };
    } else {
      // Other errors
      errorResponse = {
        message: error.message || "Unknown error",
        status: error.code || 500,
      };
    }

    return [null, errorResponse];
  }
}

export default axiosInstance;
