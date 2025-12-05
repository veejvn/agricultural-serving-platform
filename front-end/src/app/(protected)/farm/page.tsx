"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderService from "@/services/order.service";
import ProductService from "@/services/product.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Cell,
} from "recharts";
import Link from "next/link";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#fa8072",
  "#bdb2ff",
  "#f6c23e",
];
export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    revenue: 0,
    productCountChange: 0,
    orderCountChange: 0,
    revenueChange: 0,
  });
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [productSoldData, setProductSoldData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Lấy đơn hàng và sản phẩm
      const [orderList, orderListError] = await OrderService.getAllByFarmer();
      const [productList, productListError] =
        await ProductService.getAllByFarmer();
      if (orderListError || productListError) {
        setLoading(false);
        return;
      }
      // Tổng sản phẩm
      const productCount = Array.isArray(productList) ? productList.length : 0;
      // Tổng đơn hàng
      const orderCount = Array.isArray(orderList) ? orderList.length : 0;
      // Tổng doanh thu (chỉ tính đơn đã giao/thành công)
      let revenue = 0;
      for (const order of orderList) {
        if (["DELIVERED", "RECEIVED"].includes(order.status)) {
          revenue += order.totalPrice || 0;
        }
      }
      // Biểu đồ doanh thu 6 tháng gần nhất
      const now = new Date();
      const monthsRevenue: { [key: string]: number } = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        monthsRevenue[key] = 0;
      }
      for (const order of orderList) {
        const created = new Date(order.createdAt);
        const key = `${created.getFullYear()}-${created.getMonth() + 1}`;
        if (
          ["DELIVERED", "RECEIVED"].includes(order.status) &&
          monthsRevenue[key] !== undefined
        ) {
          monthsRevenue[key] += order.totalPrice || 0;
        }
      }
      const chartData = Object.entries(monthsRevenue).map(([key, value]) => {
        const [year, month] = key.split("-");
        return {
          name: `${month}/${year.slice(2)}`,
          revenue: value,
        };
      });
      setRevenueChartData(chartData);
      // Top 5 sản phẩm bán chạy
      const productSoldMap: { [key: string]: { name: string; sold: number } } =
        {};
      for (const order of orderList) {
        if (["DELIVERED", "RECEIVED"].includes(order.status)) {
          for (const item of order.orderItems || []) {
            const id = item.product.id;
            if (!productSoldMap[id]) {
              productSoldMap[id] = {
                name: item.product.name,
                sold: 0,
              };
            }
            productSoldMap[id].sold += item.quantity || 0;
          }
        }
      }
      const soldArr = Object.values(productSoldMap)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);
      setProductSoldData(soldArr);
      // Đơn hàng gần đây (5 đơn mới nhất)
      const sortedOrders = [...orderList].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 5));
      // TODO: Tính toán % thay đổi so với tháng trước nếu cần
      setStats({
        productCount,
        orderCount,
        revenue,
        productCountChange: 0,
        orderCountChange: 0,
        revenueChange: 0,
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Tổng quan trang trại
      </h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatsCard
          title="Tổng sản phẩm"
          value={stats.productCount.toLocaleString()}
          description={" "}
          trend="up"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng đơn hàng"
          value={stats.orderCount.toLocaleString()}
          description={" "}
          trend="up"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Doanh thu"
          value={stats.revenue.toLocaleString() + " VNĐ"}
          description={" "}
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Doanh thu theo thời gian"
          description="Biểu đồ doanh thu 6 tháng gần nhất"
          chart={
            <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={revenueChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip
                    formatter={(v: number) => v.toLocaleString() + " VNĐ"}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          }
        />
        <ChartCard
          title="Sản phẩm bán chạy"
          description="Top 5 sản phẩm bán chạy nhất"
          chart={
            <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <ReBarChart
                  data={productSoldData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <YAxis dataKey="name" type="category" width={200} />
                  <Tooltip
                    formatter={(v: number) => v.toLocaleString() + " sản phẩm"}
                  />
                  <Bar dataKey="sold" name="Đã bán" fill="#4f46e5">
                    {productSoldData.map((entry, idx) => (
                      <Cell
                        key={`cell-bar-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Danh sách 5 đơn hàng gần nhất</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-2 font-semibold text-gray-600 mb-2 px-2">
                <div className="col-span-2">Mã đơn</div>
                <div>Khách hàng</div>
                <div className="text-right">Tổng tiền</div>
                <div className="text-center">Ngày</div>
                <div className="text-center">Trạng thái</div>
              </div>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-6 gap-1 items-center px-2 py-1"
                  >
                    <Link
                      href={`/farm/order/${order.id}`}
                      className="col-span-2 font-medium hover:underline hover:text-blue-600"
                    >
                      #ORDER_{order.id.slice(0, 8)}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {order.account?.displayName || "Ẩn danh"}
                    </div>
                    <div className="text-right font-medium min-w-[90px]">
                      {order.totalPrice?.toLocaleString()} VNĐ
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex justify-center">
                      <Badge
                        className={
                          order.status === "DELIVERED" ||
                          order.status === "RECEIVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800"
                            : order.status === "DELIVERING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                            : order.status === "CANCELED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }
                      >
                        {(() => {
                          switch (order.status) {
                            case "PENDING":
                              return "Chờ xác nhận";
                            case "CONFIRMED":
                              return "Đã xác nhận";
                            case "DELIVERING":
                              return "Đang giao";
                            case "DELIVERED":
                              return "Đã giao";
                            case "RECEIVED":
                              return "Đã nhận hàng";
                            case "CANCELED":
                              return "Đã hủy";
                            default:
                              return order.status;
                          }
                        })()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm bán chạy nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSoldData.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                  <div className="text-right">
                    <div>Đã bán: {product.sold.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
