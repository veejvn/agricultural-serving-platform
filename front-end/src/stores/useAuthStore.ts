import { getLS } from "@/tools/localStorage.tool";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  redirect: string;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
  setRedirect: (redirect: string) => void;
}

// const isLoggedInStored = getLS("isLoggedIn");
// const accessTokenStored = getLS("accessToken", "");
// const refreshTokenStored = getLS("refreshToken", "");
// const redirectStored = getLS("redirect", "/");

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
      redirect: "/",

      setIsLoggedIn: (isLoggedIn: boolean) => {
        set({ isLoggedIn });
      },

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken });
      },

      clearTokens: () => {
        set({
          accessToken: "",
          refreshToken: "",
        });
      },

      setRedirect: (redirect) => {
        set({ redirect: redirect });
      },
    }),
    {
      name: "auth-storage", // tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
