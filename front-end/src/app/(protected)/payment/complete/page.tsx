import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  FileText,
  Home,
  Printer,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderCompletePage() {
  // Giả lập dữ liệu đơn hàng
  const orderNumber = "NN" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Giả lập dữ liệu sản phẩm
  const orderItems = [
    {
      id: 1,
      name: "Phân bón NPK Đầu Trâu",
      price: 250000,
      discount: 10,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Hạt giống lúa ST25",
      price: 120000,
      discount: 0,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Thuốc trừ sâu sinh học BT",
      price: 180000,
      discount: 0,
      quantity: 3,
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  // Tính toán tổng tiền
  const subtotal = orderItems.reduce((total, item) => {
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

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
            Đặt hàng thành công!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Đơn hàng #{orderNumber}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  In đơn hàng
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Thông tin đơn hàng
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mã đơn hàng
                  </p>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày đặt hàng
                  </p>
                  <p className="font-medium">{orderDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Trạng thái
                  </p>
                  <p className="font-medium text-orange-600 dark:text-orange-500">
                    Đang xử lý
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-green-800 dark:text-green-300">
                Thông tin giao hàng
              </h3>
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Họ và tên
                    </p>
                    <p className="font-medium">Nguyễn Văn A</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Số điện thoại
                    </p>
                    <p className="font-medium">0912345678</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Địa chỉ
                    </p>
                    <p className="font-medium">
                      123 Đường Nông Nghiệp, Phường 1, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ghi chú
                    </p>
                    <p className="font-medium">
                      Giao hàng trong giờ hành chính
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-green-800 dark:text-green-300">
                Sản phẩm đã đặt
              </h3>
              <div className="rounded-lg border">
                <div className="max-h-[300px] space-y-4 overflow-auto p-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-green-800 dark:text-green-300">
                            {item.name}{" "}
                            <span className="text-gray-500">
                              x{item.quantity}
                            </span>
                          </h3>
                          <div className="text-right">
                            {item.discount > 0 ? (
                              <div className="flex flex-col items-end">
                                <span className="font-medium text-green-600 dark:text-green-500">
                                  {formatCurrency(
                                    item.price *
                                      (1 - item.discount / 100) *
                                      item.quantity
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium text-green-600 dark:text-green-500">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 p-4">
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
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              asChild
            >
              <Link href="/product">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
