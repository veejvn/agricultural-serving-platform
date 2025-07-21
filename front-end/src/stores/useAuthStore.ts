import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  redirect: string;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setRedirect: (redirect: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      redirect: "/",

      setTokens: (accessToken, refreshToken) => {
        set({
          isLoggedIn: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      },

      clearTokens: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
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
