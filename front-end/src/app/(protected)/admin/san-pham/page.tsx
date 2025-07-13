"use client"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileEdit, Trash2, Eye, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminProducts() {
  // Dữ liệu mẫu cho sản phẩm
  const products = [
    {
      id: 1,
      name: "Gạo ST25",
      category: "Lúa gạo",
      price: "100,000 VNĐ",
      stock: 150,
      status: "Đã duyệt",
      farmer: "Trần Văn Nông",
    },
    {
      id: 2,
      name: "Cà phê Arabica",
      category: "Cà phê",
      price: "250,000 VNĐ",
      stock: 80,
      status: "Đã duyệt",
      farmer: "Nguyễn Thị Hạt",
    },
    {
      id: 3,
      name: "Hồ tiêu Phú Quốc",
      category: "Gia vị",
      price: "180,000 VNĐ",
      stock: 120,
      status: "Đã duyệt",
      farmer: "Lê Văn Tiêu",
    },
    {
      id: 4,
      name: "Thanh long ruột đỏ",
      category: "Trái cây",
      price: "35,000 VNĐ",
      stock: 200,
      status: "Chờ duyệt",
      farmer: "Phạm Thị Thanh",
    },
    {
      id: 5,
      name: "Xoài cát Hòa Lộc",
      category: "Trái cây",
      price: "90,000 VNĐ",
      stock: 75,
      status: "Đã duyệt",
      farmer: "Hoàng Văn Xoài",
    },
    {
      id: 6,
      name: "Chuối Nam Mỹ",
      category: "Trái cây",
      price: "25,000 VNĐ",
      stock: 300,
      status: "Chờ duyệt",
      farmer: "Trần Thị Chuối",
    },
    {
      id: 7,
      name: "Dừa Bến Tre",
      category: "Trái cây",
      price: "15,000 VNĐ",
      stock: 250,
      status: "Đã duyệt",
      farmer: "Nguyễn Văn Dừa",
    },
    {
      id: 8,
      name: "Rau muống",
      category: "Rau củ",
      price: "10,000 VNĐ",
      stock: 500,
      status: "Đã duyệt",
      farmer: "Lê Thị Rau",
    },
    {
      id: 9,
      name: "Cà rốt Đà Lạt",
      category: "Rau củ",
      price: "20,000 VNĐ",
      stock: 350,
      status: "Chờ duyệt",
      farmer: "Phạm Văn Cà",
    },
    {
      id: 10,
      name: "Bắp cải Lâm Đồng",
      category: "Rau củ",
      price: "15,000 VNĐ",
      stock: 400,
      status: "Đã duyệt",
      farmer: "Hoàng Thị Bắp",
    },
  ]

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
      accessorKey: "farmer",
      header: "Nông dân",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status")
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
        )
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const status = row.getValue("status")
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
            {status === "Chờ duyệt" && (
              <Button variant="ghost" size="icon" className="text-green-500">
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

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
  )
}
