import { useOrderStore } from "@/stores/useOrderStore";
import { useCallback } from "react";
import { IOrderRequest } from "@/types/order";

export const useOrder = () => {
  const store = useOrderStore();

  const createPendingOrders = useCallback(
    (
      farmerGroups: Array<{
        farmer: any;
        items: Array<{
          id: string;
          product: any;
          quantity: number;
        }>;
      }>,
      orderNote: string,
      selectedAddress: string
    ) => {
      store.clearPendingOrders();

      farmerGroups.forEach((group) => {
        const orderRequest: IOrderRequest = {
          note: orderNote,
          addressId: selectedAddress,
          farmerId: group.farmer.id,
          items: group.items.map((item) => ({
            cartItemId: item.id,
          })),
        };

        const orderItems = group.items.map((item) => ({
          cartItemId: item.id,
          productName: item.product?.name || "Sản phẩm",
          quantity: item.quantity,
          price: item.product?.price || 0,
          thumbnail: item.product?.thumbnail,
        }));

        store.addPendingOrder({
          tempId: `pending_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          request: orderRequest,
          farmerName: group.farmer.name || "Không xác định",
          farmerId: group.farmer.id,
          items: orderItems,
          createdAt: new Date().toISOString(),
        });
      });
    },
    [store]
  );

  return {
    // State
    orders: store.orders,
    farmerOrders: store.farmerOrders,
    pendingOrders: store.pendingOrders,
    lastCreatedOrders: store.lastCreatedOrders,
    isLoading: store.isLoading,
    isLoadingFarmerOrders: store.isLoadingFarmerOrders,
    error: store.error,

    // Actions
    fetchAllOrders: store.fetchAllOrders,
    fetchFarmerOrders: store.fetchFarmerOrders,
    changeOrderStatus: store.changeOrderStatus,
    addOrder: store.addOrder,
    updateOrderStatus: store.updateOrderStatus,

    // Pending orders
    addPendingOrder: store.addPendingOrder,
    removePendingOrder: store.removePendingOrder,
    clearPendingOrders: store.clearPendingOrders,
    createPendingOrders,

    // Last created orders
    setLastCreatedOrders: store.setLastCreatedOrders,
    clearLastCreatedOrders: store.clearLastCreatedOrders,

    // Computed
    getTotalOrders: store.getTotalOrders,
    getOrderById: store.getOrderById,
    getPendingOrdersByFarmer: store.getPendingOrdersByFarmer,
    getAllCurrentOrders: store.getAllCurrentOrders,

    // Utility
    setLoading: store.setLoading,
    setError: store.setError,
  };
};
