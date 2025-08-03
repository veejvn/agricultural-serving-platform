import AuthService from "@/services/auth.service";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string | null;
  displayName: string | null;
  email: string | null;
  avatar: string | null;
  roles: string[] | null;
}

interface UserState {
  user: User;
  setUser: (data: Partial<User>) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        id: null,
        displayName: null,
        email: null,
        avatar: null,
        roles: null,
      },

      setUser: (data) => {
        const current = get().user;
        set({ user: { ...current, ...data } });
      },

      clearUser: () => {
        set({
          user: {
            id: null,
            displayName: null,
            email: null,
            avatar: null,
            roles: null,
          },
        });
      },

      fetchUser: async () => {
        const [result, error] = await AuthService.getAccountInfo();
        // console.log("Result: " + result);
        // console.log("Error: " + error);
        if(error) {
          set({
            user: {} as User, // Reset user state on error
          });
        }
        const current = get().user;
        set({ user: { ...current, ...result } });
      },
    }),
    {
      name: "user-storage", // tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
