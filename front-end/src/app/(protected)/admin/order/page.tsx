"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  // Dữ liệu mẫu cho đơn hàng
  const orders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      date: "15/04/2024",
      products: "Gạo ST25 (10kg)",
      total: "1,000,000 VNĐ",
      status: "Đã giao",
      farmer: "Trần Văn Nông",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      date: "16/04/2024",
      products: "Cà phê Arabica (2kg)",
      total: "500,000 VNĐ",
      status: "Đang giao",
      farmer: "Nguyễn Thị Hạt",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      date: "17/04/2024",
      products: "Hồ tiêu Phú Quốc (1kg)",
      total: "180,000 VNĐ",
      status: "Đang xử lý",
      farmer: "Lê Văn Tiêu",
    },
    {
      id: "DH004",
      customer: "Phạm Thị D",
      date: "18/04/2024",
      products: "Thanh long ruột đỏ (5kg)",
      total: "175,000 VNĐ",
      status: "Đã giao",
      farmer: "Phạm Thị Thanh",
    },
    {
      id: "DH005",
      customer: "Hoàng Văn E",
      date: "19/04/2024",
      products: "Xoài cát Hòa Lộc (3kg)",
      total: "270,000 VNĐ",
      status: "Đã hủy",
      farmer: "Hoàng Văn Xoài",
    },
    {
      id: "DH006",
      customer: "Ngô Thị F",
      date: "20/04/2024",
      products: "Chuối Nam Mỹ (2kg)",
      total: "50,000 VNĐ",
      status: "Đang giao",
      farmer: "Trần Thị Chuối",
    },
    {
      id: "DH007",
      customer: "Đặng Văn G",
      date: "21/04/2024",
      products: "Dừa Bến Tre (5 trái)",
      total: "75,000 VNĐ",
      status: "Đang xử lý",
      farmer: "Nguyễn Văn Dừa",
    },
    {
      id: "DH008",
      customer: "Vũ Thị H",
      date: "22/04/2024",
      products: "Rau muống (2 bó)",
      total: "20,000 VNĐ",
      status: "Đã giao",
      farmer: "Lê Thị Rau",
    },
    {
      id: "DH009",
      customer: "Bùi Văn I",
      date: "23/04/2024",
      products: "Cà rốt Đà Lạt (3kg)",
      total: "60,000 VNĐ",
      status: "Đang giao",
      farmer: "Phạm Văn Cà",
    },
    {
      id: "DH010",
      customer: "Lý Thị K",
      date: "24/04/2024",
      products: "Bắp cải Lâm Đồng (2kg)",
      total: "30,000 VNĐ",
      status: "Đang xử lý",
      farmer: "Hoàng Thị Bắp",
    },
  ];

  // Định nghĩa cột cho bảng
  const columns = [
    {
      accessorKey: "id",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "customer",
      header: "Khách hàng",
    },
    {
      accessorKey: "date",
      header: "Ngày đặt",
    },
    {
      accessorKey: "products",
      header: "Sản phẩm",
    },
    {
      accessorKey: "total",
      header: "Tổng tiền",
    },
    {
      accessorKey: "farmer",
      header: "Nông dân",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        const status = row.getValue("status");
        let badgeClass =
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";

        if (status === "Đã giao") {
          badgeClass =
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
        } else if (status === "Đang giao") {
          badgeClass =
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
        } else if (status === "Đã hủy") {
          badgeClass =
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
        }

        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>

      <DataTable columns={columns} data={orders} />
    </div>
  );
}
