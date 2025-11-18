"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useEffect } from "react";
import OrderService from "@/services/order.service";
import { IOrderResponse } from "@/types/order";
import addressData from "@/json/address.json";

function mapOrderStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "processing";
    case "DELIVERING":
      return "shipping";
    case "DELIVERED":
      return "completed";
    case "RECEIVED":
      return "completed";
    case "CANCELED":
      return "canceled";
    default:
      return "pending";
  }
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Chờ xác nhận",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  shipping: {
    label: "Đang giao hàng",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  completed: {
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  canceled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const [ordersData, error] = await OrderService.getMyOrders();
        console.log("Fetched orders:", ordersData, error);
        if (error) {
          setOrders([]);
          return;
        }
        if (!Array.isArray(ordersData)) {
          setOrders([]);
          return;
        }
        const mapped = ordersData.map((order: IOrderResponse) => ({
          id: order.id,
          date: new Date(order.createdAt),
          status: mapOrderStatus(order.status),
          total: order.totalPrice,
          items: order.orderItems.map((orderItem) => ({
            id: orderItem.product.id,
            name: orderItem.product.name,
            price: orderItem.product.price,
            quantity: orderItem.quantity,
            image: orderItem.product.thumbnail,
          })),
          shipping: {
            address: `${order.address.detail}, ${getWardNameFromCode(
              order.address.province,
              order.address.district,
              order.address.ward
            )}, ${getDistrictNameFromCode(
              order.address.province,
              order.address.district
            )}, ${getProvinceNameFromCode(order.address.province)}`,
            method: "Giao hàng tiêu chuẩn",
            tracking: "",
          },
          payment: {
            method:
              order.paymentMethod === "COD"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán bằng VNPAY",
            status: getPaymentStatus(order.paymentStatus),
          },
        }));
        setOrders(mapped);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getPaymentStatus = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "Chưa thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      case "REFUNDED":
        return "Đã hoàn tiền";
      case "CANCELED":
        return "Đã hủy";
      default:
        return "Không rõ";
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderDetails = (orderId: string) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Đơn hàng của tôi</h2>
        <p className="text-sm text-muted-foreground">
          Xem và theo dõi tất cả đơn hàng của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipping">Đang giao hàng</SelectItem>
                <SelectItem value="completed">Đã giao hàng</SelectItem>
                <SelectItem value="canceled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Đang tải đơn hàng...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Không tìm thấy đơn hàng nào
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc của bạn"
                  : "Bạn chưa có đơn hàng nào"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button asChild>
                  <Link href="/product">Mua sắm ngay</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Collapsible
                  key={order.id}
                  open={openOrderId === order.id}
                  onOpenChange={() => toggleOrderDetails(order.id)}
                  className="border rounded-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          Đơn hàng #ORDER_{order.id.slice(0, 8)}
                        </h3>
                        <Badge className={statusMap[order.status].color}>
                          {statusMap[order.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(order.date, "HH", { locale: vi })} giờ{" "}
                        {format(order.date, "mm", { locale: vi })} phút{", "}
                        {format(order.date, "dd MMMM yyyy", { locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <p className="font-medium">
                        {formatCurrency(order.total)}
                      </p>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {openOrderId === order.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Sản phẩm
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Sản phẩm</TableHead>
                              <TableHead className="text-right">Giá</TableHead>
                              <TableHead className="text-right">SL</TableHead>
                              <TableHead className="text-right">Tổng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                    <span>{item.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.price)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.price * item.quantity)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            Thông tin giao hàng
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Địa chỉ:</span>{" "}
                              {order.shipping.address}
                            </p>
                            <p>
                              <span className="font-medium">
                                Phương thức vận chuyển:
                              </span>{" "}
                              {order.shipping.method}
                            </p>
                            {order.shipping.tracking && (
                              <p>
                                <span className="font-medium">Mã vận đơn:</span>{" "}
                                {order.shipping.tracking}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            Thông tin thanh toán
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">
                                Phương thức thanh toán:
                              </span>{" "}
                              {order.payment.method}
                            </p>
                            <p>
                              <span className="font-medium">Trạng thái:</span>{" "}
                              {order.payment.status}
                            </p>
                            <p>
                              <span className="font-medium">Tổng tiền:</span>{" "}
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/order/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
