"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
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
} from "lucide-react";
import type { IOrderResponse, IOrderStatus } from "@/types/order";
import OrderService from "@/services/order.service";
import { formatPrice } from "@/utils/common/format";
import LoadingSpinner from "@/components/common/loading-spinner";
import addressData from "@/json/address.json";

const statusConfig = {
  PENDING: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-300 border-yellow-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-300 border-blue-200",
    icon: CheckCircle,
  },
  DELIVERING: {
    label: "Đang giao hàng",
    color:
      "bg-orange-100 text-orange-800 hover:bg-orange-300 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800 hover:bg-green-300 border-green-200",
    icon: Package,
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    color:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-300 border-emerald-200",
    icon: CheckCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 hover:bg-red-300 border-red-200",
    icon: XCircle,
  },
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const [res, error] = await OrderService.getById(params.id as string);
        if (res) {
          setOrder(res as IOrderResponse);
        } else {
          toast({
            title: "Lỗi",
            description: error?.message || "Không thể tải thông tin đơn hàng",
            variant: "destructive",
          });
          router.push("/admin/order");
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải thông tin đơn hàng",
          variant: "destructive",
        });
        router.push("/admin/order");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function getProvinceNameFromCode(code: string): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === code
    ) as any;
    return province?.name_with_type || code;
  }

  function getDistrictNameFromCode(
    provinceCode: string,
    districtCode: string
  ): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === provinceCode
    ) as any;
    const district =
      province?.district &&
      (Object.values(province.district).find(
        (d: any) => d.code === districtCode
      ) as any);
    return district?.name_with_type || districtCode;
  }

  function getWardNameFromCode(
    provinceCode: string,
    districtCode: string,
    wardCode: string
  ): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === provinceCode
    ) as any;
    const district =
      province?.district &&
      (Object.values(province.district).find(
        (d: any) => d.code === districtCode
      ) as any);
    const ward =
      district?.ward &&
      (Object.values(district.ward).find(
        (w: any) => w.code === wardCode
      ) as any);
    return ward?.name_with_type || wardCode;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
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
          <Button onClick={() => router.push("/admin/order")}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

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
            Quản lý đơn hàng #{order.id.slice(0, 6)}
          </h1>
          <p className="text-gray-600">
            Đặt hàng lúc {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  Trạng thái hiện tại:
                </span>
                <Badge className={`${statusConfig[order.status].color} border`}>
                  {statusConfig[order.status].label}
                </Badge>
              </div>
              {order.lastStatusChangeReason && (
                <p className="text-sm text-gray-600 mt-2">
                  Lý do: {order.lastStatusChangeReason}
                </p>
              )}
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
                          ID: {item.product.id} • Danh mục:{" "}
                          {item.product.category}
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
                  Ghi chú từ khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.note}</p>
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
                <span>ID đơn hàng:</span>
                <span className="font-mono text-sm">
                  {order.id.slice(0, 6)}
                </span>
              </div>
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

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={order.account.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {order.account.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.account.displayName}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.account.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.account.phone}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => router.push(`/admin/user/${order.account.id}`)}
              >
                Xem chi tiết khách hàng
              </Button>
            </CardContent>
          </Card>

          {/* Farmer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin nông dân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={order.farmer.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>{order.farmer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.farmer.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => router.push(`/admin/farm/${order.farmer.id}`)}
              >
                Xem chi tiết nông dân
              </Button>
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
              <p className="font-medium">Người nhận: {order.address.receiverName}</p>
              <p className="text-sm text-gray-600">
                SĐT: {order.address.receiverPhone}
              </p>
              <p className="text-sm text-gray-700">
                Địa chỉ: {order.address.detail},{" "}
                {getWardNameFromCode(
                  order.address.province,
                  order.address.district,
                  order.address.ward
                )}
                ,{" "}
                {getDistrictNameFromCode(
                  order.address.province,
                  order.address.district
                )}
                , {getProvinceNameFromCode(order.address.province)}
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
                {order.status !== "PENDING" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã xác nhận</p>
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
                    </div>
                  </div>
                )}
                {["DELIVERED", "RECEIVED"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã giao hàng</p>
                    </div>
                  </div>
                )}
                {order.status === "RECEIVED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã nhận hàng</p>
                    </div>
                  </div>
                )}
                {order.status === "CANCELED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã hủy</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
