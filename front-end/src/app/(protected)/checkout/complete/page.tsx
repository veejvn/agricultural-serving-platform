"use client";

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

import { useOrder } from "@/hooks/useOrder";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/common/format";
import {
  IOrderItemResponse,
  IPaymentMethod,
  IPaymentStatus,
} from "@/types/order";
import { IAddressResponse } from "@/types/address";
import AddressService from "@/services/address.service"; // Added import for AddressService
import { useSearchParams } from "next/navigation";
import PaymentService from "@/services/payment.service";

interface OrderData {
  orderNumbers: string[];
  orderDate: string;
  items: IOrderItemResponse[];
  subtotal: number;
  shipping: number;
  total: number;
  address: IAddressResponse;
  note: string;
  status: string;
  paymentMethod: IPaymentMethod;
  paymentStatus: IPaymentStatus;
}

export default function OrderCompletePage() {
  const searchParams = useSearchParams();
  const { lastCreatedOrders, clearLastCreatedOrders } = useOrder();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  //console.log("Last created orders:", lastCreatedOrders);
  //console.log("Order data state:", orderData);

  useEffect(() => {
    if (lastCreatedOrders.length > 0) {
      // Tính toán dữ liệu đơn hàng từ lastCreatedOrders
      const allItems = lastCreatedOrders.flatMap((order) => order.orderItems);
      const subtotal = allItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      const shipping = 0; // Phí vận chuyển
      const total = subtotal + shipping;

      setOrderData({
        orderNumbers: lastCreatedOrders.map((o) => o.id),
        orderDate: lastCreatedOrders[0]?.createdAt
          ? new Date(lastCreatedOrders[0].createdAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        items: allItems,
        subtotal,
        shipping,
        total,
        address: lastCreatedOrders[0]?.address,
        note: lastCreatedOrders[0]?.note,
        status: lastCreatedOrders[0]?.status,
        paymentMethod: lastCreatedOrders[0]?.paymentMethod,
        paymentStatus: lastCreatedOrders[0]?.paymentStatus,
      });
    }
  }, [lastCreatedOrders]);

  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const [result, error] = await PaymentService.vnpayReturn(params);
      if (error) {
        console.error("Error verifying VNPAY payment:", error);
        setLoading(false);
        return;
      }
      console.log("VNPAY payment verification result:", result);
      setOrderData((prev) =>
        prev
          ? {
              ...prev,
              paymentStatus:
                result.paymentStatus === "PAID" ? "PAID" : "FAILED",
            }
          : prev
      );
      setLoading(false);
    };
    if (searchParams.get("vnp_ResponseCode")) {
      verifyPayment();
    }
  }, [searchParams]);

  const getOrderId = (orderNumbers: string[]) => {
    return orderNumbers.map((num) => `ORDER_${num.slice(0, 8)}`).join(", ");
  };

  const getPaymentMethodText = (method: IPaymentMethod) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "VNPAY":
        return "Thanh toán VNPAY";
      default:
        return "Chưa xác định";
    }
  };

  const getPaymentStatusText = (status: IPaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      case "REFUNDED":
        return "Đã hoàn tiền";
      case "CANCELED":
        return "Đã hủy";
      default:
        return "Chưa xác định";
    }
  };

  const getPaymentStatusColor = (status: IPaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "text-orange-600 dark:text-orange-500";
      case "PAID":
        return "text-green-600 dark:text-green-500";
      case "FAILED":
        return "text-red-600 dark:text-red-500";
      case "REFUNDED":
        return "text-blue-600 dark:text-blue-500";
      case "CANCELED":
        return "text-gray-600 dark:text-gray-500";
      default:
        return "text-gray-600 dark:text-gray-500";
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "DELIVERING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "RECEIVED":
        return "Đã nhận hàng";
      case "CANCELED":
        return "Đã hủy";
      default:
        return "Đang xử lý";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-600 dark:text-orange-500";
      case "CONFIRMED":
        return "text-blue-600 dark:text-blue-500";
      case "DELIVERING":
        return "text-purple-600 dark:text-purple-500";
      case "DELIVERED":
        return "text-green-600 dark:text-green-500";
      case "RECEIVED":
        return "text-green-700 dark:text-green-400";
      case "CANCELED":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-orange-600 dark:text-orange-500";
    }
  };

  // Helper functions to get names from codes for display
  function getProvinceNameFromCode(code: string): string {
    const province = AddressService.getProvinces().find((p: any) => p.code === code) as any;
    return province?.name_with_type || code;
  }

  function getWardNameFromCode(wardCode: string, provinceCode: string): string {
    const ward = AddressService.getWardsByProvinceCode(provinceCode).find((w: any) => w.code === wardCode) as any;
    return ward?.name_with_type || wardCode;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-400 animate-spin">
              <svg
                className="h-12 w-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 sm:text-4xl">
              Đang xử lý đơn hàng...
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Vui lòng chờ trong giây lát.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData || lastCreatedOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900 dark:text-red-400">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-red-800 dark:text-red-300 sm:text-4xl">
              Không tìm thấy thông tin đơn hàng
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Có vẻ như bạn đã vào trang này mà không có đơn hàng nào được tạo.
            </p>
          </div>

          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Vui lòng quay lại trang sản phẩm để tiếp tục mua sắm hoặc về
                  trang chủ.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row justify-center">
                  <Button
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    asChild
                  >
                    <Link href="/product">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Tiếp tục mua sắm
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Về trang chủ
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                Đơn hàng {getOrderId(orderData.orderNumbers)}
              </CardTitle>
              {/* <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  In đơn hàng
                </Button>
              </div> */}
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
                  <p className="font-medium">
                    {getOrderId(orderData.orderNumbers)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày đặt hàng
                  </p>
                  <p className="font-medium">{orderData.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium">
                    {getPaymentMethodText(orderData.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Trạng thái thanh toán
                  </p>
                  <p
                    className={`font-medium ${getPaymentStatusColor(
                      orderData.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusText(orderData.paymentStatus)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Trạng thái đơn hàng
                  </p>
                  <p
                    className={`font-medium ${getOrderStatusColor(
                      orderData.status
                    )}`}
                  >
                    {getOrderStatusText(orderData.status)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Số đơn hàng được tạo
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-500">
                    {orderData.orderNumbers?.length} đơn hàng
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
                    <p className="font-medium">
                      {orderData.address?.receiverName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Số điện thoại
                    </p>
                    <p className="font-medium">
                      {orderData.address?.receiverPhone || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Địa chỉ
                    </p>
                    <p className="font-medium">
                      {orderData.address
                        ? `${orderData.address.detail}, ${getWardNameFromCode(orderData.address.ward, orderData.address.province)}, ${getProvinceNameFromCode(orderData.address.province)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ghi chú
                    </p>
                    <p className="font-medium">{orderData.note || "-"}</p>
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
                  {orderData.items.map(
                    (item: IOrderItemResponse, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.product.thumbnail || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-green-800 dark:text-green-300">
                              {item.product.name}{" "}
                              <span className="text-gray-500">
                                x{item.quantity}
                              </span>
                            </h3>
                            <div className="text-right">
                              <span className="font-medium text-green-600 dark:text-green-500">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <Separator />

                <div className="space-y-2 p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tạm tính
                    </span>
                    <span className="font-medium">
                      {formatPrice(orderData.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Phí vận chuyển
                    </span>
                    <span className="font-medium">
                      {formatPrice(orderData.shipping)}
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
                      {formatPrice(orderData.total)}
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
