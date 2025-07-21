"use client";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FarmerOrders() {
  // Dữ liệu mẫu cho đơn hàng
  const orders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      date: "15/04/2024",
      products: "Gạo ST25 (10kg)",
      total: "1,000,000 VNĐ",
      status: "Đã giao",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      date: "16/04/2024",
      products: "Gạo Nàng Hoa (5kg), Gạo Lứt (2kg)",
      total: "430,000 VNĐ",
      status: "Đang giao",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      date: "17/04/2024",
      products: "Gạo Tài Nguyên (15kg)",
      total: "675,000 VNĐ",
      status: "Đang xử lý",
    },
    {
      id: "DH004",
      customer: "Phạm Thị D",
      date: "18/04/2024",
      products: "Gạo Nếp Than (3kg)",
      total: "210,000 VNĐ",
      status: "Đã giao",
    },
    {
      id: "DH005",
      customer: "Hoàng Văn E",
      date: "19/04/2024",
      products: "Gạo ST25 (15kg)",
      total: "1,500,000 VNĐ",
      status: "Đã hủy",
    },
    {
      id: "DH006",
      customer: "Ngô Thị F",
      date: "20/04/2024",
      products: "Gạo Hương Lài (5kg), Gạo Nếp Cái Hoa Vàng (3kg)",
      total: "445,000 VNĐ",
      status: "Đang giao",
    },
    {
      id: "DH007",
      customer: "Đặng Văn G",
      date: "21/04/2024",
      products: "Gạo ST25 (8kg), Gạo Nàng Hoa (10kg)",
      total: "1,400,000 VNĐ",
      status: "Đang xử lý",
    },
    {
      id: "DH008",
      customer: "Vũ Thị H",
      date: "22/04/2024",
      products: "Gạo Nàng Thơm Chợ Đào (5kg)",
      total: "400,000 VNĐ",
      status: "Đã giao",
    },
    {
      id: "DH009",
      customer: "Bùi Văn I",
      date: "23/04/2024",
      products: "Gạo Tài Nguyên (10kg), Gạo Lứt (5kg)",
      total: "650,000 VNĐ",
      status: "Đang giao",
    },
    {
      id: "DH010",
      customer: "Lý Thị K",
      date: "24/04/2024",
      products: "Gạo ST25 (20kg), Gạo Nếp Than (5kg)",
      total: "2,350,000 VNĐ",
      status: "Đang xử lý",
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
