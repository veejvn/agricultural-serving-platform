import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ICartItemResponse } from "@/types/cartItem";

interface CartState {
  items: ICartItemResponse[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setItems: (items: ICartItemResponse[]) => void;
  addItem: (item: ICartItemResponse) => void;
  updateItem: (id: string, updates: Partial<ICartItemResponse>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => ICartItemResponse | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      setItems: (items) => {
        console.log("useCartStore - setItems called with:", items);
        set({ items, error: null });
        console.log("useCartStore - items after set:", get().items);
      },

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
          error: null,
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
          error: null,
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          error: null,
        })),

      clearCart: () => set({ items: [], error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Computed getters
      getTotalItems: () => {
        const { items } = get();
        if (!Array.isArray(items) || items.length === 0) {
          return 0;
        }

        return items.reduce((total, item) => {
          // Kiểm tra để tránh lỗi khi quantity undefined
          if (!item || typeof item.quantity !== "number") {
            console.warn("Invalid cart item quantity:", item);
            return total;
          }
          return total + item.quantity;
        }, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        if (!Array.isArray(items) || items.length === 0) {
          return 0;
        }

        return items.reduce((total, item) => {
          // Kiểm tra để tránh lỗi khi producResponse undefined
          if (
            !item?.product?.price ||
            typeof item.product.price !== "number" ||
            typeof item.quantity !== "number"
          ) {
            //console.warn("Invalid cart item data:", item);
            return total;
          }
          return total + item.product.price * item.quantity;
        }, 0);
      },

      getItemById: (id) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist items, không persist loading/error states
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        console.log("useCartStore - Rehydrated state:", state);
      },
    }
  )
);
