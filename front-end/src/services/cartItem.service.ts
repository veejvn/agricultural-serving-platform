import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";
import { ICartItemRequest } from "@/types/cartItem";

const CartItemService = {
  // Thêm sản phẩm vào giỏ hàng
  addCartItem(data: ICartItemRequest) {
    return service(axios.post(getApiUrl("/cart-items"), data), true);
  },

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems() {
    return service(axios.get(getApiUrl("/cart-items")), true);
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(cartItemId: string, quantity: number) {
    return service(
      axios.put(getApiUrl(`/cart-items/${cartItemId}/quantity`), null, {
        params: { quantity },
      }),
      true
    );
  },

  // Xóa sản phẩm khỏi giỏ hàng
  deleteCartItem(cartItemId: string) {
    return service(axios.delete(getApiUrl(`/cart-items/${cartItemId}`)), true);
  },

  // Xóa giỏ hàng
  clearCart() {
    return service(axios.delete(getApiUrl("/cart-items/clear")), true);
  },
};

export default CartItemService;
