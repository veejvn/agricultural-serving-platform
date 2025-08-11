"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OrderService from "@/services/order.service";
import { IOrderResponse } from "@/types/order";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const [result, error] = await OrderService.getAllByFarmer();
      setLoading(false);
      if (error || !Array.isArray(result)) {
        setOrders([]);
        return;
      }
      // Sắp xếp theo createdAt giảm dần rồi map sang bảng
      const sorted = [...result].sort(
        (a: IOrderResponse, b: IOrderResponse) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const mapped = sorted.map((order: IOrderResponse) => {
        const shortId = "ORDER_" + order.id.slice(0, 8);
        const customer = order.address?.receiverName || "";
        const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
        // Sản phẩm mỗi dòng
        const products = order.orderItems
          .map((item) => `${item.product.name} (SL: ${item.quantity})`)
          .join("<br />");
        const total = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(order.totalPrice);
        return {
          id: shortId, // dùng cho hiển thị
          realId: order.id, // dùng cho thao tác
          customer,
          date,
          products,
          total,
          orderStatus: order.status, // trạng thái gốc
        };
      });
      setOrders(mapped);
    };
    fetchOrders();
  }, []);

  // Định nghĩa cột cho bảng
  const columns = [
    {
      accessorKey: "id",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "customer",
      header: "Khách hàng",
      size: 130,
    },
    {
      accessorKey: "date",
      header: "Ngày đặt",
      size: 120,
    },
    {
      accessorKey: "products",
      header: "Sản phẩm",
      size: 400,
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        // Hiển thị HTML với mỗi sản phẩm 1 dòng
        return (
          <span
            dangerouslySetInnerHTML={{ __html: row.getValue("products") }}
          />
        );
      },
    },
    {
      accessorKey: "total",
      header: "Tổng tiền",
      size: 120,
    },
    {
      accessorKey: "orderStatus",
      header: "Trạng thái",
      size: 180,
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        const status = row.getValue("orderStatus");
        let label = "";
        let badgeClass =
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800";
        switch (status) {
          case "PENDING":
            label = "Chờ xác nhận";
            break;
          case "CONFIRMED":
            label = "Đã xác nhận";
            break;
          case "DELIVERING":
            label = "Đang giao";
            badgeClass =
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800";
            break;
          case "DELIVERED":
            label = "Đã giao";
            badgeClass =
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800";
            break;
          case "RECEIVED":
            label = "Đã nhận hàng";
            badgeClass =
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800";
            break;
          case "CANCELED":
            label = "Đã hủy";
            badgeClass =
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800";
            break;
          default:
            label = "Không xác định";
        }
        return <Badge className={badgeClass}>{label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { original: any } }) => {
        const order = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/farm/order/${order.realId}`)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Lọc orders theo trạng thái
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="w-full md:w-64">
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium mb-1"
          >
            Lọc theo trạng thái
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="DELIVERING">Đang giao</SelectItem>
              <SelectItem value="DELIVERED">Đã giao</SelectItem>
              <SelectItem value="RECEIVED">Đã nhận hàng</SelectItem>
              <SelectItem value="CANCELED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredOrders} />
      )}
    </div>
  );
}
