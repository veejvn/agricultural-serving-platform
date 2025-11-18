"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import OrderService from "@/services/order.service";
import { IOrderResponse, IOrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/common/format";
import LoadingSpinner from "@/components/common/loading-spinner";

const statusOptions: { value: IOrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "DELIVERING", label: "Đang giao hàng" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "RECEIVED", label: "Đã nhận hàng" },
  { value: "CANCELED", label: "Đã hủy" },
];

export default function AdminOrders() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<IOrderResponse[]>([]); // Thêm state này
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<IOrderStatus | "ALL">("ALL"); // Thay đổi mặc định

  // useEffect để tải tất cả đơn hàng một lần
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      const [res, error] = await OrderService.getAllOrders();
      if (res) {
        setAllOrders(res as IOrderResponse[]);
      } else {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể tải danh sách đơn hàng",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    fetchAllOrders();
  }, []); // Chỉ chạy một lần khi component mount

  // useMemo để lọc dữ liệu trên frontend
  const displayedOrders = useMemo(() => {
    let currentFilteredOrders = allOrders;

    if (filterStatus && filterStatus !== "ALL") {
      currentFilteredOrders = currentFilteredOrders.filter(
        (order) => order.status === filterStatus
      );
    }

    return currentFilteredOrders; // Chỉ trả về dữ liệu đã lọc
  }, [allOrders, filterStatus]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Mã đơn hàng",
        cell: ({ row }: { row: { original: IOrderResponse } }) => {
          return `#${row.original.id.substring(0, 6)}`;
        },
      },
      {
        accessorKey: "account.displayName",
        header: "Khách hàng",
      },
      {
        accessorKey: "farmer.name",
        header: "Nông dân",
      },
      {
        accessorKey: "createdAt",
        header: "Ngày đặt",
        cell: ({ row }: { row: { original: IOrderResponse } }) => {
          return new Date(row.original.createdAt).toLocaleDateString("vi-VN");
        },
      },
      {
        accessorKey: "totalPrice",
        header: "Tổng tiền",
        cell: ({ row }: { row: { original: IOrderResponse } }) => {
          return formatPrice(row.original.totalPrice);
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }: { row: { original: IOrderResponse } }) => {
          const status = row.original.status;
          let badgeClass =
            "bg-blue-100 text-blue-800 hover:bg-blue-300 dark:bg-blue-900 dark:text-blue-100";

          if (status === "DELIVERED" || status === "RECEIVED") {
            badgeClass =
              "bg-green-100 text-green-800 hover:bg-green-300 dark:bg-green-900 dark:text-green-100";
          } else if (status === "DELIVERING" || status === "CONFIRMED") {
            badgeClass =
              "bg-yellow-100 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-900 dark:text-yellow-100";
          } else if (status === "CANCELED") {
            badgeClass =
              "bg-red-100 text-red-800 hover:bg-red-300 dark:bg-red-900 dark:text-red-100";
          }

          return (
            <Badge className={badgeClass}>
              {statusOptions.find((opt) => opt.value === status)?.label ||
                status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }: { row: { original: IOrderResponse } }) => {
          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/admin/order/${row.original.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [router]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>

      <div className="flex items-center gap-4">
        <Select
          value={filterStatus}
          onValueChange={(value: IOrderStatus | "ALL") =>
            setFilterStatus(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={displayedOrders} />
    </div>
  );
}
