export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Định dạng giá tiền
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
