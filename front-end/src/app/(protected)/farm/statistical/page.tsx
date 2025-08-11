"use client";

import { useEffect, useState } from "react";
import { ChartCard } from "@/components/common/chart-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, BarChart, PieChart, Calendar } from "lucide-react";

// Mảng màu cho PieChart
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderService from "@/services/order.service";
import ProductService from "@/services/product.service";

export default function FarmerStats() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [productRevenueData, setProductRevenueData] = useState<any[]>([]);
  const [productSoldData, setProductSoldData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [orderCountChartData, setOrderCountChartData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [newCustomerChartData, setNewCustomerChartData] = useState<any[]>([]);
  const [loyalCustomerChartData, setLoyalCustomerChartData] = useState<any[]>(
    []
  );

  // Thống kê doanh thu, đơn hàng, sản phẩm, khách hàng
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0,
    orderCount: 0,
    customerCount: 0,
    productCount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Lấy đơn hàng của farmer
      const [orderList, orderListError] = await OrderService.getAllByFarmer();
      if (orderListError) {
        console.error("Failed to fetch orders:", orderListError);
        setOrders([]);
        setLoading(false);
        return;
      }
      // Lấy sản phẩm của farmer
      const [productList, productListError] =
        await ProductService.getAllByFarmer();
      if (productListError) {
        console.error("Failed to fetch products:", productListError);
        setProducts([]);
        setLoading(false);
        return;
      }

      // Tính toán thống kê doanh thu
      let todayRevenue = 0,
        weekRevenue = 0,
        monthRevenue = 0,
        yearRevenue = 0;
      let orderCount = 0;
      let customerSet = new Set();
      const now = new Date();
      if (Array.isArray(orderList)) {
        orderCount = orderList.length;
        for (const order of orderList) {
          const created = new Date(order.createdAt);
          // Doanh thu chỉ tính đơn đã giao/thành công
          if (["DELIVERED", "RECEIVED"].includes(order.status)) {
            const price = order.totalPrice || 0;
            // Hôm nay
            if (
              created.getDate() === now.getDate() &&
              created.getMonth() === now.getMonth() &&
              created.getFullYear() === now.getFullYear()
            ) {
              todayRevenue += price;
            }
            // Tuần này
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            if (created >= weekStart && created <= now) {
              weekRevenue += price;
            }
            // Tháng này
            if (
              created.getMonth() === now.getMonth() &&
              created.getFullYear() === now.getFullYear()
            ) {
              monthRevenue += price;
            }
            // Năm nay
            if (created.getFullYear() === now.getFullYear()) {
              yearRevenue += price;
            }
          }
          // Đếm khách hàng duy nhất
          if (order.account?.id) {
            customerSet.add(order.account.id);
          }
        }
      }
      setOrders(orderList || []);
      // Chuẩn bị dữ liệu cho PieChart doanh thu theo sản phẩm và BarChart sản phẩm bán chạy
      if (Array.isArray(orderList)) {
        const productRevenueMap: {
          [key: string]: { name: string; value: number };
        } = {};
        const productSoldMap: {
          [key: string]: { name: string; sold: number };
        } = {};
        for (const order of orderList) {
          if (["DELIVERED", "RECEIVED"].includes(order.status)) {
            for (const item of order.orderItems || []) {
              const id = item.product.id;
              if (!productRevenueMap[id]) {
                productRevenueMap[id] = {
                  name: item.product.name,
                  value: 0,
                };
              }
              productRevenueMap[id].value +=
                (item.product.price || 0) * (item.quantity || 0);

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
        setProductRevenueData(Object.values(productRevenueMap));
        // Lấy top 10 sản phẩm bán chạy nhất
        const soldArr = Object.values(productSoldMap)
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10);
        setProductSoldData(soldArr);
      }
      // Chuẩn bị dữ liệu cho biểu đồ doanh thu 12 tháng gần nhất và số lượng đơn hàng theo tháng
      if (Array.isArray(orderList)) {
        const now = new Date();
        const monthsRevenue: { [key: string]: number } = {};
        const monthsOrderCount: { [key: string]: number } = {};
        // Khởi tạo 12 tháng gần nhất
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          monthsRevenue[key] = 0;
          monthsOrderCount[key] = 0;
        }
        for (const order of orderList) {
          const created = new Date(order.createdAt);
          const key = `${created.getFullYear()}-${created.getMonth() + 1}`;
          if (monthsOrderCount[key] !== undefined) {
            monthsOrderCount[key] += 1;
          }
          if (["DELIVERED", "RECEIVED"].includes(order.status)) {
            if (monthsRevenue[key] !== undefined) {
              monthsRevenue[key] += order.totalPrice || 0;
            }
          }
        }
        // Chuyển thành mảng cho recharts
        const chartData = Object.entries(monthsRevenue).map(([key, value]) => {
          const [year, month] = key.split("-");
          return {
            name: `${month}/${year.slice(2)}`,
            revenue: value,
            orderCount: monthsOrderCount[key],
          };
        });
        setRevenueChartData(chartData);
        setOrderCountChartData(
          chartData.map(({ name, orderCount }) => ({ name, orderCount }))
        );
      }
      setStats({
        todayRevenue,
        weekRevenue,
        monthRevenue,
        yearRevenue,
        orderCount,
        customerCount: customerSet.size,
        productCount: Array.isArray(productList) ? productList.length : 0,
      });
      setProducts(productList || []);

      // Tính dữ liệu khách hàng mới 12 tháng gần nhất
      if (Array.isArray(orderList)) {
        // Map: customerId -> firstOrderDate
        const customerFirstOrder: Record<string, Date> = {};
        for (const order of orderList) {
          const accId = order.account?.id;
          if (!accId) continue;
          const created = new Date(order.createdAt);
          if (
            !customerFirstOrder[accId] ||
            created < customerFirstOrder[accId]
          ) {
            customerFirstOrder[accId] = created;
          }
        }
        // Khởi tạo 12 tháng gần nhất
        const now = new Date();
        const months: string[] = [];
        const monthKeyToLabel: Record<string, string> = {};
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          months.push(key);
          monthKeyToLabel[key] = `${d.getMonth() + 1}/${d
            .getFullYear()
            .toString()
            .slice(2)}`;
        }
        // Đếm số khách hàng mới theo tháng
        const monthCount: Record<string, number> = {};
        months.forEach((m) => (monthCount[m] = 0));
        Object.values(customerFirstOrder).forEach((date) => {
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (monthCount[key] !== undefined) monthCount[key]++;
        });
        // Chuẩn bị dữ liệu cho recharts
        const chartData = months.map((key) => ({
          name: monthKeyToLabel[key],
          newCustomers: monthCount[key],
        }));
        setNewCustomerChartData(chartData);
      }
      // Tính dữ liệu khách hàng thân thiết (top 10 khách hàng có nhiều đơn nhất)
      if (Array.isArray(orderList)) {
        const customerOrderCount: Record<
          string,
          { name: string; value: number }
        > = {};
        for (const order of orderList) {
          const accId = order.account?.id;
          const accName = order.account?.displayName || "Ẩn danh";
          if (!accId) continue;
          if (!customerOrderCount[accId]) {
            customerOrderCount[accId] = { name: accName, value: 0 };
          }
          customerOrderCount[accId].value += 1;
        }
        // Lấy top 10 khách hàng có nhiều đơn nhất
        const loyalArr = Object.values(customerOrderCount)
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        setLoyalCustomerChartData(loyalArr);
      }
      // Chuẩn bị dữ liệu cho PieChart phân bố đơn hàng theo trạng thái
      if (Array.isArray(orderList)) {
        const statusMap: { [key: string]: { name: string; value: number } } =
          {};
        const statusLabel: { [key: string]: string } = {
          PENDING: "Chờ xác nhận",
          CONFIRMED: "Đã xác nhận",
          DELIVERING: "Đang giao",
          DELIVERED: "Đã giao",
          RECEIVED: "Đã nhận hàng",
          CANCELED: "Đã hủy",
        };
        for (const order of orderList) {
          const st = order.status;
          const label = statusLabel[st] || st;
          if (!statusMap[st]) {
            statusMap[st] = { name: label, value: 0 };
          }
          statusMap[st].value += 1;
        }
        setOrderStatusData(Object.values(statusMap));
      }
      // Chuẩn bị dữ liệu cho PieChart phân bố sản phẩm theo danh mục
      if (Array.isArray(productList)) {
        const categoryMap: { [key: string]: { name: string; value: number } } =
          {};
        for (const product of productList) {
          const cat = product.category || "Khác";
          if (!categoryMap[cat]) {
            categoryMap[cat] = { name: cat, value: 0 };
          }
          categoryMap[cat].value += 1;
        }
        setCategoryData(Object.values(categoryMap));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

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
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan doanh thu</CardTitle>
              <CardDescription>
                Thống kê doanh thu theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">
                      Hôm nay
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.todayRevenue.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">
                      Tuần này
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.weekRevenue.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">
                      Tháng này
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.monthRevenue.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">
                      Năm nay
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.yearRevenue.toLocaleString()} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            <ChartCard
              title="Doanh thu theo thời gian"
              description="Biểu đồ doanh thu 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={revenueChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
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
              title="Doanh thu theo sản phẩm"
              description="Phân bố doanh thu theo sản phẩm"
              chart={
                <div className="h-[350px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <RePieChart>
                      <Pie
                        data={productRevenueData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} (${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%)`
                        }
                      >
                        {productRevenueData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => v.toLocaleString() + " VNĐ"}
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 pt-4">
          <div className="flex flex-col gap-4">
            <ChartCard
              title="Sản phẩm bán chạy"
              description="Top 10 sản phẩm bán chạy nhất"
              chart={
                <div className="h-[350px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <ReBarChart
                      data={productSoldData}
                      layout="vertical"
                      margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => v.toLocaleString()}
                      />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip
                        formatter={(v: number) =>
                          v.toLocaleString() + " sản phẩm"
                        }
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
            <ChartCard
              title="Phân bố sản phẩm"
              description="Phân bố sản phẩm theo danh mục"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <RePieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} (${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%)`
                        }
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell
                            key={`cell-cat-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) =>
                          v.toLocaleString() + " sản phẩm"
                        }
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 pt-4">
          <div className="flex flex-col gap-4">
            <ChartCard
              title="Đơn hàng theo thời gian"
              description="Biểu đồ số lượng đơn hàng 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={orderCountChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(v) => v.toLocaleString()}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(v: number) => v.toLocaleString() + " đơn"}
                      />
                      <Line
                        type="monotone"
                        dataKey="orderCount"
                        name="Số lượng đơn hàng"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            <ChartCard
              title="Trạng thái đơn hàng"
              description="Phân bố đơn hàng theo trạng thái"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <RePieChart>
                      <Pie
                        data={orderStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} (${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%)`
                        }
                      >
                        {orderStatusData.map((entry, idx) => (
                          <Cell
                            key={`cell-status-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => v.toLocaleString() + " đơn"}
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 pt-4">
          <div className="flex flex-col gap-4">
            <ChartCard
              title="Khách hàng mới"
              description="Biểu đồ khách hàng mới 12 tháng gần nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={newCustomerChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        allowDecimals={false}
                        tickFormatter={(v) => v.toLocaleString()}
                      />
                      <Tooltip
                        formatter={(v: number) =>
                          v.toLocaleString() + " KH mới"
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="newCustomers"
                        name="Khách hàng mới"
                        stroke="#f59e42"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            <ChartCard
              title="Khách hàng thân thiết"
              description="Top 10 khách hàng có đơn hàng nhiều nhất"
              chart={
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <ReBarChart
                      data={loyalCustomerChartData}
                      layout="vertical"
                      margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tickFormatter={(v) => v.toLocaleString()}
                      />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip
                        formatter={(v: number) => v.toLocaleString() + " đơn"}
                      />
                      <Bar dataKey="value" name="Số đơn hàng" fill="#f59e42">
                        {loyalCustomerChartData.map((entry, idx) => (
                          <Cell
                            key={`cell-loyal-${idx}`}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
