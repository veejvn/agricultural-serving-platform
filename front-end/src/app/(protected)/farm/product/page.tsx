"use client";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FarmerProducts() {
  // Dữ liệu mẫu cho sản phẩm
  const products = [
    {
      id: 1,
      name: "Gạo ST25",
      category: "Lúa gạo",
      price: "100,000 VNĐ",
      stock: 150,
      status: "Đã duyệt",
      sales: 256,
    },
    {
      id: 2,
      name: "Gạo Nàng Hoa",
      category: "Lúa gạo",
      price: "60,000 VNĐ",
      stock: 200,
      status: "Đã duyệt",
      sales: 187,
    },
    {
      id: 3,
      name: "Gạo Tài Nguyên",
      category: "Lúa gạo",
      price: "45,000 VNĐ",
      stock: 180,
      status: "Đã duyệt",
      sales: 154,
    },
    {
      id: 4,
      name: "Gạo Nếp Cái Hoa Vàng",
      category: "Lúa gạo",
      price: "40,000 VNĐ",
      stock: 120,
      status: "Chờ duyệt",
      sales: 132,
    },
    {
      id: 5,
      name: "Gạo Lứt",
      category: "Lúa gạo",
      price: "40,000 VNĐ",
      stock: 100,
      status: "Đã duyệt",
      sales: 98,
    },
    {
      id: 6,
      name: "Gạo Jasmine",
      category: "Lúa gạo",
      price: "55,000 VNĐ",
      stock: 90,
      status: "Chờ duyệt",
      sales: 85,
    },
    {
      id: 7,
      name: "Gạo Nếp Than",
      category: "Lúa gạo",
      price: "70,000 VNĐ",
      stock: 50,
      status: "Đã duyệt",
      sales: 65,
    },
    {
      id: 8,
      name: "Gạo Hương Lài",
      category: "Lúa gạo",
      price: "65,000 VNĐ",
      stock: 80,
      status: "Đã duyệt",
      sales: 72,
    },
    {
      id: 9,
      name: "Gạo Tám Xoan",
      category: "Lúa gạo",
      price: "75,000 VNĐ",
      stock: 60,
      status: "Chờ duyệt",
      sales: 45,
    },
    {
      id: 10,
      name: "Gạo Nàng Thơm Chợ Đào",
      category: "Lúa gạo",
      price: "80,000 VNĐ",
      stock: 70,
      status: "Đã duyệt",
      sales: 58,
    },
  ];

  // Định nghĩa cột cho bảng
  const columns = [
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
    },
    {
      accessorKey: "category",
      header: "Danh mục",
    },
    {
      accessorKey: "price",
      header: "Giá",
    },
    {
      accessorKey: "stock",
      header: "Tồn kho",
    },
    {
      accessorKey: "sales",
      header: "Đã bán",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
        const status = row.getValue("status");
        return (
          <Badge
            className={
              status === "Đã duyệt"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            }
          >
            {status}
          </Badge>
        );
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
            <Button variant="ghost" size="icon" className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <Button className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  );
}
