"use client";

import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng người dùng"
          value="1,234"
          description="Tăng 12% so với tháng trước"
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng sản phẩm"
          value="567"
          description="Tăng 8% so với tháng trước"
          trend="up"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng đơn hàng"
          value="892"
          description="Tăng 23% so với tháng trước"
          trend="up"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Doanh thu"
          value="123,456,000 VNĐ"
          description="Tăng 18% so với tháng trước"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Doanh thu theo thời gian"
          description="Biểu đồ doanh thu 6 tháng gần nhất"
          chart={
            <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-gray-400" />
              <span className="ml-2 text-gray-500">Biểu đồ doanh thu</span>
            </div>
          }
        />
        <ChartCard
          title="Phân bố người dùng"
          description="Phân bố người dùng theo vai trò"
          chart={
            <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <UserCheck className="h-16 w-16 text-gray-400" />
              <span className="ml-2 text-gray-500">
                Biểu đồ phân bố người dùng
              </span>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Danh sách 5 đơn hàng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "DH010",
                  customer: "Lý Thị K",
                  date: "24/04/2024",
                  total: "2,350,000 VNĐ",
                  status: "Đang xử lý",
                },
                {
                  id: "DH009",
                  customer: "Bùi Văn I",
                  date: "23/04/2024",
                  total: "650,000 VNĐ",
                  status: "Đang giao",
                },
                {
                  id: "DH008",
                  customer: "Vũ Thị H",
                  date: "22/04/2024",
                  total: "400,000 VNĐ",
                  status: "Đã giao",
                },
                {
                  id: "DH007",
                  customer: "Đặng Văn G",
                  date: "21/04/2024",
                  total: "1,400,000 VNĐ",
                  status: "Đang xử lý",
                },
                {
                  id: "DH006",
                  customer: "Ngô Thị F",
                  date: "20/04/2024",
                  total: "445,000 VNĐ",
                  status: "Đang giao",
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {order.customer}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{order.total}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </div>
                  <Badge
                    className={
                      order.status === "Đã giao"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : order.status === "Đang giao"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm mới</CardTitle>
            <CardDescription>Danh sách 5 sản phẩm mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Bắp cải Lâm Đồng",
                  category: "Rau củ",
                  price: "15,000 VNĐ",
                  status: "Đã duyệt",
                },
                {
                  name: "Cà rốt Đà Lạt",
                  category: "Rau củ",
                  price: "20,000 VNĐ",
                  status: "Chờ duyệt",
                },
                {
                  name: "Dừa Bến Tre",
                  category: "Trái cây",
                  price: "15,000 VNĐ",
                  status: "Đã duyệt",
                },
                {
                  name: "Chuối Nam Mỹ",
                  category: "Trái cây",
                  price: "25,000 VNĐ",
                  status: "Chờ duyệt",
                },
                {
                  name: "Xoài cát Hòa Lộc",
                  category: "Trái cây",
                  price: "90,000 VNĐ",
                  status: "Đã duyệt",
                },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{product.price}</div>
                  </div>
                  <Badge
                    className={
                      product.status === "Đã duyệt"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
