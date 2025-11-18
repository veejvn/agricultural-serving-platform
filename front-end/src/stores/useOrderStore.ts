import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IOrderResponse, IOrderRequest } from "@/types/order";
import OrderService from "@/services/order.service";

interface PendingOrder {
  tempId: string;
  request: IOrderRequest;
  farmerName: string;
  farmerId: string;
  items: Array<{
    cartItemId: string;
    productName: string;
    quantity: number;
    price: number;
    thumbnail?: string;
  }>;
  createdAt: string;
}

interface OrderState {
  // Các đơn hàng từ server
  orders: IOrderResponse[];
  farmerOrders: IOrderResponse[];

  // Các đơn hàng vừa tạo (pending orders)
  pendingOrders: PendingOrder[];

  // Đơn hàng vừa tạo thành công từ server
  lastCreatedOrders: IOrderResponse[];

  // Loading states
  isLoading: boolean;
  isLoadingFarmerOrders: boolean;
  error: string | null;

  // Actions cho orders từ server
  setOrders: (orders: IOrderResponse[]) => void;
  setFarmerOrders: (orders: IOrderResponse[]) => void;
  addOrder: (order: IOrderResponse) => void;
  updateOrderStatus: (orderId: string, status: string) => void;

  // Actions cho pending orders
  addPendingOrder: (pendingOrder: PendingOrder) => void;
  removePendingOrder: (tempId: string) => void;
  clearPendingOrders: () => void;

  // Actions cho last created orders
  setLastCreatedOrders: (orders: IOrderResponse[]) => void;
  clearLastCreatedOrders: () => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setLoadingFarmerOrders: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API actions
  fetchAllOrders: () => Promise<void>;
  fetchFarmerOrders: () => Promise<void>;
  changeOrderStatus: (
    orderId: string,
    status: string,
    isConsumer?: boolean
  ) => Promise<boolean>;

  // Computed
  getTotalOrders: () => number;
  getOrderById: (id: string) => IOrderResponse | undefined;
  getPendingOrdersByFarmer: () => Record<string, PendingOrder[]>;
  getAllCurrentOrders: () => Array<IOrderResponse | PendingOrder>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      farmerOrders: [],
      pendingOrders: [],
      isLoading: false,
      isLoadingFarmerOrders: false,
      error: null,
      lastCreatedOrders: [],
      setLastCreatedOrders: (orders) => set({ lastCreatedOrders: orders }),
      clearLastCreatedOrders: () => set({ lastCreatedOrders: [] }),

      // Basic setters
      setOrders: (orders) => set({ orders }),
      setFarmerOrders: (orders) => set({ farmerOrders: orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: status as any } : order
          ),
          farmerOrders: state.farmerOrders.map((order) =>
            order.id === orderId ? { ...order, status: status as any } : order
          ),
        })),

      // Pending orders actions
      addPendingOrder: (pendingOrder) =>
        set((state) => ({
          pendingOrders: [pendingOrder, ...state.pendingOrders],
        })),
      removePendingOrder: (tempId) =>
        set((state) => ({
          pendingOrders: state.pendingOrders.filter(
            (order) => order.tempId !== tempId
          ),
        })),
      clearPendingOrders: () => set({ pendingOrders: [] }),

      // Utility setters
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingFarmerOrders: (loading) =>
        set({ isLoadingFarmerOrders: loading }),
      setError: (error) => set({ error }),

      // API actions
      fetchAllOrders: async () => {
        try {
          set({ isLoading: true, error: null });
          const [result, error] = await OrderService.getMyOrders();

          if (error) {
            set({ error: error as string });
            return;
          }

          set({ orders: result || [] });
        } catch (error) {
          set({ error: "Không thể tải danh sách đơn hàng" });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchFarmerOrders: async () => {
        try {
          set({ isLoadingFarmerOrders: true, error: null });
          const [result, error] = await OrderService.getAllByFarmer();

          if (error) {
            set({ error: error as string });
            return;
          }

          set({ farmerOrders: result || [] });
        } catch (error) {
          set({ error: "Không thể tải danh sách đơn hàng" });
        } finally {
          set({ isLoadingFarmerOrders: false });
        }
      },

      changeOrderStatus: async (orderId, status, isConsumer = true) => {
        try {
          const [result, error] = isConsumer
            ? await OrderService.consumerChangeStatus({
                orderId,
                status: status as any,
              })
            : await OrderService.farmerChangeStatus({
                orderId,
                status: status as any,
              });

          if (error) {
            set({ error: error as string });
            return false;
          }

          // Update local state
          get().updateOrderStatus(orderId, status);
          return true;
        } catch (error) {
          set({ error: "Không thể cập nhật trạng thái đơn hàng" });
          return false;
        }
      },

      // Computed properties
      getTotalOrders: () => {
        const state = get();
        return state.orders.length + state.pendingOrders.length;
      },

      getOrderById: (id) => {
        const state = get();
        return (
          state.orders.find((order) => order.id === id) ||
          state.farmerOrders.find((order) => order.id === id)
        );
      },

      getPendingOrdersByFarmer: () => {
        const state = get();
        return state.pendingOrders.reduce((groups, order) => {
          const farmerId = order.farmerId;
          if (!groups[farmerId]) {
            groups[farmerId] = [];
          }
          groups[farmerId].push(order);
          return groups;
        }, {} as Record<string, PendingOrder[]>);
      },

      getAllCurrentOrders: () => {
        const state = get();
        const allOrders: Array<IOrderResponse | PendingOrder> = [
          ...state.orders,
          ...state.pendingOrders,
        ];
        return allOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Sort newest first
        });
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist pending orders and some basic state
      partialize: (state) => ({
        pendingOrders: state.pendingOrders,
        lastCreatedOrders: state.lastCreatedOrders,
      }),
    }
  )
);

// Helper functions
export const createPendingOrderId = () => {
  return `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const convertOrderRequestToPending = (
  request: IOrderRequest,
  farmerName: string,
  items: Array<{
    cartItemId: string;
    productName: string;
    quantity: number;
    price: number;
    thumbnail?: string;
  }>
): PendingOrder => {
  return {
    tempId: createPendingOrderId(),
    request,
    farmerName,
    farmerId: request.farmerId,
    items,
    createdAt: new Date().toISOString(),
  };
};
