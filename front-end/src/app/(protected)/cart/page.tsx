import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CartEmpty from "@/components/product/cart-empty";

export default function CartPage() {
  // Giả lập dữ liệu giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: "Phân bón NPK Đầu Trâu",
      description: "Phân bón tổng hợp cho cây trồng phát triển toàn diện",
      price: 250000,
      discount: 10,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Hạt giống lúa ST25",
      description: "Giống lúa thơm đạt giải gạo ngon nhất thế giới",
      price: 120000,
      discount: 0,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Thuốc trừ sâu sinh học BT",
      description: "An toàn cho người sử dụng và môi trường",
      price: 180000,
      discount: 0,
      quantity: 3,
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice =
      item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const shipping = 30000; // Phí vận chuyển
  const total = subtotal + shipping;

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Kiểm tra giỏ hàng trống
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
          Giỏ Hàng
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Xem lại các sản phẩm bạn đã chọn trước khi thanh toán
        </p>
      </div>

      {isCartEmpty ? (
        <CartEmpty />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Sản phẩm trong giỏ hàng ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 sm:flex-row"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                        <div className="mt-1">
                          {item.discount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600 dark:text-green-500">
                                {formatCurrency(
                                  item.price * (1 - item.discount / 100)
                                )}
                              </span>
                              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                                {formatCurrency(item.price)}
                              </span>
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                -{item.discount}%
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium text-green-600 dark:text-green-500">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="h-8 w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                            readOnly
                          />
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-r-lg border-l text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          className="rounded-full p-1 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950 dark:hover:text-red-500"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/product">Tiếp tục mua sắm</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa giỏ hàng
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tạm tính
                  </span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Phí vận chuyển
                  </span>
                  <span className="font-medium">
                    {formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Khuyến mãi
                  </span>
                  <span className="font-medium">0₫</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-green-800 dark:text-green-300">
                    Tổng cộng
                  </span>
                  <span className="text-lg font-bold text-green-800 dark:text-green-300">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Thông tin đơn hàng
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• {cartItems.length} sản phẩm trong giỏ hàng</li>
                    <li>• Miễn phí vận chuyển cho đơn hàng từ 500.000₫</li>
                    <li>• Thời gian giao hàng dự kiến: 2-3 ngày</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  asChild
                >
                  <Link href="/payment">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
