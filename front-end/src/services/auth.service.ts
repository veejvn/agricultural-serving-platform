import axios, { service } from "@/tools/axios.tool";
import { getAuthUrl, getApiUrl } from "@/tools/url.tool";
import { LoginFormData, RegisterFormData } from "@/types/auth";

const AuthService = {
  register({ email, password }: RegisterFormData) {
    return service(axios.post(getAuthUrl("/register"), { email, password }));
  },
  login({ email, password }: LoginFormData) {
    return service(axios.post(getAuthUrl("/login"), { email, password }));
  },
  getUser() {
    return service(axios.get(getAuthUrl("/info")), true);
  },
  logout(refreshToken: string) {
    return service(axios.post(getAuthUrl("/logout"), { refreshToken }));
  },
  refreshToken(refreshToken: string) {
    console.log("Gọi refreshToken: " + refreshToken);
    return service(axios.post(getAuthUrl("/refresh-token"), { refreshToken }), true);
  },
};

export default AuthService;
