import axios, { service } from "@/tools/axios.tool";
import { getAuthUrl, getApiUrl } from "@/tools/url.tool";
import { LoginFormData, RegisterFormData } from "@/types/auth";

// Define additional interfaces for new API calls
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface VerifyForgotPasswordRequest {
  code: string;
  newPassword: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const AuthService = {
  register({ email, password }: RegisterFormData) {
    return service(axios.post(getAuthUrl("/register"), { email, password }));
  },

  login({ email, password }: LoginFormData) {
    return service(axios.post(getAuthUrl("/login"), { email, password }));
  },

  // GET /auth/info - Get authenticated user info
  getAccountInfo() {
    return service(axios.get(getAuthUrl("/info")), true);
  },

  logout(refreshToken: string) {
    return service(axios.post(getAuthUrl("/logout"), { refreshToken }));
  },

  refreshToken(refreshToken: string) {
    //console.log("Gọi refreshToken: " + refreshToken);
    return service(
      axios.post(getAuthUrl("/refresh-token"), { refreshToken }),
      true
    );
  },

  // POST /auth/change-password - Change user password
  changePassword(request: ChangePasswordRequest) {
    return service(axios.post(getAuthUrl("/change-password"), request), false);
  },

  // POST /auth/forgot-password - Request forgot password
  forgotPassword(request: ForgotPasswordRequest) {
    return service(axios.post(getAuthUrl("/forgot-password"), request), false);
  },

  // POST /auth/forgot-password/verify - Verify forgot password and reset
  verifyForgotPassword(request: VerifyForgotPasswordRequest) {
    return service(
      axios.post(getAuthUrl("/forgot-password/verify"), request),
      true
    );
  },
};

export default AuthService;
