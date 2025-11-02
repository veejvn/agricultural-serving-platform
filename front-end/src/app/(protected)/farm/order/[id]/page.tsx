"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Edit,
  Save,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type {
  IOrderResponse,
  IOrderStatus,
  IChangeOrderStatusRequest,
} from "@/types/order";

import OrderService from "@/services/order.service";
import addressData from "@/json/address.json";

const statusConfig = {
  PENDING: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-800",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-800",
    icon: CheckCircle,
  },
  DELIVERING: {
    label: "Đang giao hàng",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-100 dark:border-purple-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:border-green-800",
    icon: Package,
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-800",
    icon: CheckCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    color:
      "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:border-red-800",
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

// Farmer can only change status within their scope
const farmerStatusOptions: { value: IOrderStatus; label: string }[] = [
  { value: "CONFIRMED", label: "Xác nhận đơn hàng" },
  { value: "DELIVERING", label: "Bắt đầu giao hàng" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "CANCELED", label: "Hủy đơn hàng" },
];

export default function FarmerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<IOrderStatus>("PENDING");
  const [farmerNote, setFarmerNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const [result, error] = await OrderService.getById(params.id as string);
        if (error || !result) {
          throw new Error("Order not found");
        }
        setOrder(result);
        setNewStatus(result.status);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng",
          variant: "destructive",
        });
        router.push("/farm/order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    if (newStatus === "CANCELED" && !farmerNote.trim()) {
      toast({
        title: "Thiếu lý do",
        description: "Vui lòng nhập lý do hủy đơn hàng.",
        variant: "destructive",
      });
      return;
    }
    setUpdating(true);
    const request: IChangeOrderStatusRequest = {
      orderId: order.id,
      status: newStatus,
      reason:
        newStatus === "CANCELED" && farmerNote.trim()
          ? farmerNote.trim()
          : undefined,
    };
    const [result, error] = await OrderService.farmerChangeStatus(request);
    // console.log("Update status request:", request);
    // console.log("Update status result:", result);
    // console.error("Update status failed:", error);
    if (error || !result) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      });
      return;
    }
    setOrder(result);
    setIsEditingStatus(false);
    setFarmerNote("");
    setUpdating(false);
    toast({
      title: "Thành công",
      description: `Đã cập nhật trạng thái đơn hàng thành "${
        farmerStatusOptions.find((s) => s.value === newStatus)?.label
      }"`,
    });
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

  const calculateCommission = (total: number) => {
    return total * 0.05; // 5% commission
  };

  const calculateEarnings = (total: number) => {
    return total - calculateCommission(total);
  };

  // Helper functions to get names from codes for display
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
          <Button onClick={() => router.push("/farm/order")}>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;
  // Farmer allowed transitions:
  // PENDING -> CONFIRMED, CANCELED
  // CONFIRMED -> DELIVERING, CANCELED
  // DELIVERING -> DELIVERED
  // DELIVERED -> (no further transitions)
  // CANCELED -> (no further transitions)
  const availableStatuses = farmerStatusOptions.filter((option) => {
    if (order.status === "PENDING")
      return ["CONFIRMED", "CANCELED"].includes(option.value);
    if (order.status === "CONFIRMED")
      return ["DELIVERING", "CANCELED"].includes(option.value);
    if (order.status === "DELIVERING")
      return ["DELIVERED"].includes(option.value);
    return false;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/farm/order")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng #ORDER_{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600">
            Đặt hàng lúc {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Quản lý đơn hàng
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
                  {!isEditingStatus && availableStatuses.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingStatus(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Cập nhật trạng thái
                    </Button>
                  )}
                </div>

                {isEditingStatus && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái mới</Label>
                      <Select
                        value={newStatus}
                        onValueChange={(value: IOrderStatus) =>
                          setNewStatus(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatuses.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmer-note">Ghi chú (tùy chọn)</Label>
                      {newStatus === "CANCELED" && (
                        <Textarea
                          id="farmer-note"
                          placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
                          value={farmerNote}
                          onChange={(e) => setFarmerNote(e.target.value)}
                          rows={3}
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateStatus}
                        disabled={
                          updating ||
                          newStatus === order.status ||
                          (newStatus === "CANCELED" && !farmerNote.trim())
                        }
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingStatus(false);
                          setNewStatus(order.status);
                          setFarmerNote("");
                        }}
                      >
                        Hủy
                      </Button>
                    </div>

                    {newStatus === "CANCELED" && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium">Lưu ý khi hủy đơn hàng:</p>
                          <ul className="mt-1 list-disc list-inside space-y-1">
                            <li>
                              Khách hàng sẽ được thông báo về việc hủy đơn
                            </li>
                            <li>Sản phẩm sẽ được trả về kho</li>
                            <li>
                              Bạn có thể bị ảnh hưởng đánh giá nếu hủy nhiều
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm của bạn ({order.totalQuantity} sản phẩm)
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
                  Ghi chú từ khách hàng
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
          {/* Earnings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thu nhập từ đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tổng giá trị:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Thu nhập thực:</span>
                <span className="text-green-600">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                * Thu nhập sẽ được chuyển sau khi khách hàng xác nhận nhận hàng
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
                    {order.account.displayName ? order.account.displayName.charAt(0) : "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.account.displayName}</p>
                  <p className="text-sm text-gray-600">Người tiêu dùng</p>
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
