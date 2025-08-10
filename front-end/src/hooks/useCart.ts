import { useCallback, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/useCartStore";
import CartItemService from "@/services/cartItem.service";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";

export const useCart = () => {
  const hasFetchedRef = useRef(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const {
    items,
    isLoading,
    error,
    setItems,
    addItem,
    updateItem,
    removeItem,
    clearCart: clearCartStore,
    setLoading,
    setError,
    getTotalItems,
    getTotalPrice,
    getItemById,
  } = useCartStore();

  const { toast } = useToast();

  // Fetch cart items from API
  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [result, error] = await CartItemService.getCartItems();

      if (error) {
        setError(error.message);
        console.error("Error fetching cart items:", error);
        // toast({
        //   title: "Lỗi",
        //   description: "Không thể tải giỏ hàng",
        //   variant: "destructive",
        // });
      } else {
        setItems(result || []);
        // Don't log items here as it's from previous render
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, setError, toast]);

  // Auto-fetch cart items when hook is first used
  useEffect(() => {
    // Only fetch if user is logged in
    if (!isLoggedIn) return;
    // Only fetch if we haven't fetched before and not currently loading
    if (!hasFetchedRef.current && !isLoading) {
      hasFetchedRef.current = true;
      fetchCartItems();
    }
  }, [fetchCartItems, isLoading]);

  // Update quantity
  const updateQuantity = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity <= 0) return;

      setLoading(true);

      try {
        const [result, error] = await CartItemService.updateQuantity(
          cartItemId,
          newQuantity
        );

        if (error) {
          toast({
            title: "Lỗi",
            description: error.message || "Không thể cập nhật số lượng",
            variant: "destructive",
          });
        } else {
          updateItem(cartItemId, { quantity: newQuantity });
          toast({
            title: "Thành công",
            description: "Đã cập nhật số lượng",
            variant: "default",
          });
        }
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi cập nhật",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [updateItem, setLoading, toast]
  );

  // Delete cart item
  const deleteCartItem = useCallback(
    async (cartItemId: string) => {
      setLoading(true);

      try {
        const [result, error] = await CartItemService.deleteCartItem(
          cartItemId
        );

        if (error) {
          toast({
            title: "Lỗi",
            description: error.message || "Không thể xóa sản phẩm",
            variant: "destructive",
          });
        } else {
          removeItem(cartItemId);
          toast({
            title: "Thành công",
            description: "Đã xóa sản phẩm khỏi giỏ hàng",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi xóa sản phẩm",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [removeItem, setLoading, toast]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setLoading(true);

    try {
      const [result, error] = await CartItemService.clearCart();

      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể xóa giỏ hàng",
          variant: "destructive",
        });
      } else {
        clearCartStore();
        // toast({
        //   title: "Thành công",
        //   description: "Đã xóa toàn bộ giỏ hàng",
        //   variant: "success",
        // });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa giỏ hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [clearCartStore, setLoading, toast]);

  // Add to cart (for use in product pages)
  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      setLoading(true);

      try {
        const [result, error] = await CartItemService.addCartItem({
          productId,
          quantity,
        });

        if (error) {
          toast({
            title: "Lỗi",
            description: error.message || "Không thể thêm vào giỏ hàng",
            variant: "destructive",
          });
        } else {
          // Refresh cart items to get updated data
          await fetchCartItems();
          toast({
            title: "Thành công",
            description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi thêm vào giỏ hàng",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchCartItems, setLoading, toast]
  );

  return {
    // State
    items,
    isLoading,
    error,
    totalItems: items.length > 0 ? getTotalItems() : 0,
    totalPrice: items.length > 0 ? getTotalPrice() : 0,

    // Actions
    fetchCartItems,
    addToCart,
    updateQuantity,
    deleteCartItem,
    clearCart,
    getItemById,
  };
};
