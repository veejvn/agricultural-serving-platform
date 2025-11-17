"use client"

import { DataTable } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Eye, FileEdit, Trash2, Ban } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { IFarmerResponse, IFarmerStatus } from "@/types/farmer"

export default function AdminFarmers() {
  const [farmers] = useState<IFarmerResponse[]>([
    {
      id: "1",
      name: "Trần Văn Nông",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 4.8,
      description: "Trang trại lúa gạo hữu cơ",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Nguyễn Thị Hạt",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 4.5,
      description: "Chuyên sản xuất cà phê",
      status: "ACTIVE",
    },
    {
      id: "3",
      name: "Lê Văn Tiêu",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 4.9,
      description: "Trồng hồ tiêu Phú Quốc",
      status: "ACTIVE",
    },
    {
      id: "4",
      name: "Phạm Thị Thanh",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 4.3,
      description: "Trang trại thanh long",
      status: "SELF_BLOCK",
    },
    {
      id: "5",
      name: "Hoàng Văn Xoài",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 4.6,
      description: "Chuyên xoài cát Hòa Lộc",
      status: "ACTIVE",
    },
    {
      id: "6",
      name: "Trần Thị Chuối",
      avatar: "/placeholder.svg?height=100&width=100",
      coverImage: "/placeholder.svg?height=300&width=800",
      rating: 3.8,
      description: "Trồng chuối Nam Mỹ",
      status: "ADMIN_BLOCK",
    },
  ])

  const getStatusBadge = (status: IFarmerStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Hoạt động</Badge>
      case "SELF_BLOCK":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Tự khóa</Badge>
      case "ADMIN_BLOCK":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Bị khóa</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const columns : ColumnDef<IFarmerResponse>[] = [
    {
      accessorKey: "name",
      header: "Tên nông dân",
      cell: ({ row }) => {
        const farmer = row.original as IFarmerResponse
        return <div className="font-medium">{farmer.name}</div>
      },
    },
    {
      accessorKey: "rating",
      header: "Đánh giá",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number
        return <span className="font-medium">⭐ {rating}</span>
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return <p className="text-sm text-gray-600 max-w-xs line-clamp-1">{description || "N/A"}</p>
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as IFarmerStatus
        return getStatusBadge(status)
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const farmer = row.original as IFarmerResponse
        return (
          <div className="flex space-x-2">
            <Link href={`/admin/farm/${farmer.id}`}>
              <Button variant="ghost" size="icon" title="Xem chi tiết">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" title="Chỉnh sửa">
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={farmer.status === "ADMIN_BLOCK" ? "text-green-500" : "text-orange-500"}
              title={farmer.status === "ADMIN_BLOCK" ? "Bỏ khóa" : "Khóa"}
            >
              <Ban className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500" title="Xóa">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nông dân</h1>
          <p className="text-muted-foreground">Quản lý thông tin và hoạt động của các nông dân</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng nông dân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmers.length}</div>
            <p className="text-xs text-muted-foreground">Đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {farmers.filter((f) => f.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">Nông dân hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tự khóa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {farmers.filter((f) => f.status === "SELF_BLOCK").length}
            </div>
            <p className="text-xs text-muted-foreground">Tạm dừng hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bị khóa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {farmers.filter((f) => f.status === "ADMIN_BLOCK").length}
            </div>
            <p className="text-xs text-muted-foreground">Vi phạm chính sách</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nông dân</CardTitle>
          <CardDescription>Quản lý tất cả nông dân trên hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={farmers} />
        </CardContent>
      </Card>
    </div>
  )
}