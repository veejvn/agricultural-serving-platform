"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
} from "lucide-react";
import type { IOrderResponse } from "@/types/order";
import OrderService from "@/services/order.service";
import AddressService from "@/services/address.service";

const statusConfig = {
  PENDING: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    icon: CheckCircle,
  },
  DELIVERING: {
    label: "Đang giao hàng",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    icon: Package,
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
    icon: CheckCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    icon: XCircle,
  },
};

const statusPaymentConfig = {
  PENDING: {
    label: "Chưa thanh toán",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  PAID: {
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  FAILED: {
    label: "Thanh toán thất bại",
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
  CANCELED: {
    label: "Đã hủy thanh toán",
    color: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const [result, error] = await OrderService.getById(orderId);
        if (error) {
          throw new Error("Không thể tải thông tin đơn hàng");
        }
        const orderResponse = result as IOrderResponse;
        setOrder(orderResponse);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng",
          variant: "destructive",
        });
        router.push("/account/order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!reason.trim()) {
      toast({
        title: "Thiếu lý do",
        description: "Vui lòng nhập lý do hủy đơn hàng.",
        variant: "destructive",
      });
      return;
    }
    setShowCancelReason(false);
    try {
      setUpdating(true);
      const [result, error] = await OrderService.consumerChangeStatus({
        orderId: order.id,
        status: "CANCELED",
        reason: reason.trim(),
      });
      if (error || !result) {
        throw new Error("Không thể hủy đơn hàng");
      }
      setOrder(result);
      setReason("");
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được hủy",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy đơn hàng",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      const [result, error] = await OrderService.consumerChangeStatus({
        orderId: order.id,
        status: "RECEIVED",
      });
      if (error || !result) {
        throw new Error("Không thể xác nhận nhận hàng");
      }
      setOrder(result);
      setReason("");
      toast({
        title: "Thành công",
        description: "Đã xác nhận nhận hàng",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xác nhận nhận hàng",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper functions to get names from codes for display
  function getProvinceNameFromCode(code: string): string {
    const province = AddressService.getProvinces().find(
      (p: any) => p.code === code
    ) as any;
    return province?.name_with_type || code;
  }

  function getWardNameFromCode(wardCode: string, provinceCode: string): string {
    const ward = AddressService.getWardsByProvinceCode(provinceCode).find(
      (w: any) => w.code === wardCode
    ) as any;
    return ward?.name_with_type || wardCode;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đơn hàng
          </h1>
          <Button onClick={() => router.push("/account/order")}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;
  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status);
  const canConfirmReceived = order.status === "DELIVERED";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết đơn hàng #ORDER_{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600">
            Đặt hàng lúc {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-sm font-medium">
                        Trạng thái giao hàng:
                      </span>
                      <Badge
                        className={`${statusConfig[order.status].color} border`}
                      >
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Trạng thái thanh toán:
                      </span>
                      <Badge
                        className={`${
                          statusPaymentConfig[order.paymentStatus].color
                        } border`}
                      >
                        {statusPaymentConfig[order.paymentStatus].label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {canCancel && (
                      <>
                        {!showCancelReason && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCancelReason(true)}
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            disabled={updating}
                          >
                            Hủy đơn hàng
                          </Button>
                        )}
                      </>
                    )}
                    {canConfirmReceived && (
                      <Button
                        size="sm"
                        onClick={handleConfirmReceived}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updating}
                      >
                        Xác nhận đã nhận hàng
                      </Button>
                    )}
                  </div>
                </div>
                {showCancelReason && (
                  <>
                    <Label htmlFor="reason" className="mb-1">
                      Lý do hủy đơn hàng <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Nhập lý do hủy đơn hàng..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      className="mb-2"
                      disabled={updating}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelOrder}
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        disabled={updating || !reason.trim()}
                      >
                        Xác nhận hủy đơn
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowCancelReason(false);
                          setReason("");
                        }}
                        disabled={updating}
                      >
                        Hủy
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm đã đặt ({order.totalQuantity} sản phẩm)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.thumbnail || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Danh mục: {item.product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">
                            Số lượng: {item.quantity}
                          </span>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price)} x{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < order.orderItems.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Note */}
          {order.note && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ghi chú đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.note}</p>
              </CardContent>
            </Card>
          )}

          {/* Last Status Change Reason */}
          {order.lastStatusChangeReason && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Lý do thay đổi trạng thái gần nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.lastStatusChangeReason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tổng sản phẩm:</span>
                <span>{order.totalQuantity}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Tổng tiền:</span>
                <span className="text-green-600">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                Tên người nhận: {order.address.receiverName}
              </p>
              <p className="text-sm text-gray-600">
                SĐT: {order.address.receiverPhone}
              </p>
              <p className="text-sm text-gray-700">
                Địa chỉ: {order.address.detail},{" "}
                {getWardNameFromCode(
                  order.address.ward,
                  order.address.province
                )}
                ,{" "}{getProvinceNameFromCode(order.address.province)}
              </p>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch sử đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Đơn hàng được tạo</p>
                    <p className="text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                {/* {order.status !== "PENDING" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã xác nhận</p>
                      <p className="text-gray-600">15/01/2024 11:00</p>
                    </div>
                  </div>
                )}
                {["DELIVERING", "DELIVERED", "RECEIVED"].includes(
                  order.status
                ) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đang giao hàng</p>
                      <p className="text-gray-600">15/01/2024 14:30</p>
                    </div>
                  </div>
                )}
                {["DELIVERED", "RECEIVED"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã giao hàng</p>
                      <p className="text-gray-600">16/01/2024 09:15</p>
                    </div>
                  </div>
                )}
                {order.status === "RECEIVED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã nhận hàng</p>
                      <p className="text-gray-600">16/01/2024 10:00</p>
                    </div>
                  </div>
                )}
                {order.status === "CANCELED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã hủy</p>
                      <p className="text-gray-600">Hôm nay</p>
                    </div>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
