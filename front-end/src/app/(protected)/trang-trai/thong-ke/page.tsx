"use client"

import { ChartCard } from "@/components/chart-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart, PieChart, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FarmerStats() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Thống kê</h1>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Doanh thu theo thời gian"
              description="Biểu đồ doanh thu 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ doanh thu</span>
                </div>
              }
            />
            <ChartCard
              title="Doanh thu theo sản phẩm"
              description="Phân bố doanh thu theo sản phẩm"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ phân bố doanh thu</span>
                </div>
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tổng quan doanh thu</CardTitle>
              <CardDescription>Thống kê doanh thu theo thời gian</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Hôm nay</div>
                    <div className="text-2xl font-bold">1,250,000 VNĐ</div>
                    <div className="text-xs text-green-500">+15% so với hôm qua</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Tuần này</div>
                    <div className="text-2xl font-bold">8,750,000 VNĐ</div>
                    <div className="text-xs text-green-500">+8% so với tuần trước</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Tháng này</div>
                    <div className="text-2xl font-bold">32,500,000 VNĐ</div>
                    <div className="text-xs text-green-500">+12% so với tháng trước</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Năm nay</div>
                    <div className="text-2xl font-bold">345,750,000 VNĐ</div>
                    <div className="text-xs text-green-500">+23% so với năm trước</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Sản phẩm bán chạy"
              description="Top 10 sản phẩm bán chạy nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ sản phẩm bán chạy</span>
                </div>
              }
            />
            <ChartCard
              title="Phân bố sản phẩm"
              description="Phân bố sản phẩm theo danh mục"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ phân bố sản phẩm</span>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Đơn hàng theo thời gian"
              description="Biểu đồ đơn hàng 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ đơn hàng</span>
                </div>
              }
            />
            <ChartCard
              title="Trạng thái đơn hàng"
              description="Phân bố đơn hàng theo trạng thái"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ trạng thái đơn hàng</span>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Khách hàng mới"
              description="Biểu đồ khách hàng mới 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ khách hàng mới</span>
                </div>
              }
            />
            <ChartCard
              title="Khách hàng thân thiết"
              description="Top 10 khách hàng có đơn hàng nhiều nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Biểu đồ khách hàng thân thiết</span>
                </div>
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
