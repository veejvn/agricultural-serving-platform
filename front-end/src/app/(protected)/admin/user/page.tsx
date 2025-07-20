"use client"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Eye, UserCog, UserX, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminUsers() {
  // Dữ liệu mẫu cho người dùng
  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "Người dùng",
      status: "Hoạt động",
      registeredDate: "15/04/2023",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: "Nông dân",
      status: "Hoạt động",
      registeredDate: "20/05/2023",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      role: "Doanh nghiệp",
      status: "Hoạt động",
      registeredDate: "10/06/2023",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      role: "Người dùng",
      status: "Bị khóa",
      registeredDate: "05/07/2023",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      role: "Nông dân",
      status: "Hoạt động",
      registeredDate: "12/08/2023",
    },
    {
      id: 6,
      name: "Ngô Thị F",
      email: "ngothif@example.com",
      role: "Người dùng",
      status: "Hoạt động",
      registeredDate: "18/09/2023",
    },
    {
      id: 7,
      name: "Đặng Văn G",
      email: "dangvang@example.com",
      role: "Doanh nghiệp",
      status: "Bị khóa",
      registeredDate: "22/10/2023",
    },
    {
      id: 8,
      name: "Vũ Thị H",
      email: "vuthih@example.com",
      role: "Nông dân",
      status: "Hoạt động",
      registeredDate: "30/11/2023",
    },
    {
      id: 9,
      name: "Bùi Văn I",
      email: "buivani@example.com",
      role: "Người dùng",
      status: "Hoạt động",
      registeredDate: "05/01/2024",
    },
    {
      id: 10,
      name: "Lý Thị K",
      email: "lythik@example.com",
      role: "Nông dân",
      status: "Hoạt động",
      registeredDate: "15/02/2024",
    },
  ]

  // Định nghĩa cột cho bảng
  const columns = [
    {
      accessorKey: "name",
      header: "Tên người dùng",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => {
        const role = row.getValue("role")
        let badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"

        if (role === "Nông dân") {
          badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        } else if (role === "Doanh nghiệp") {
          badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
        }

        return <Badge className={badgeClass}>{role}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <Badge
            className={
              status === "Hoạt động"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "registeredDate",
      header: "Ngày đăng ký",
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
              <UserCog className="h-4 w-4" />
            </Button>
            {status === "Hoạt động" ? (
              <Button variant="ghost" size="icon" className="text-red-500">
                <UserX className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="text-green-500">
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
