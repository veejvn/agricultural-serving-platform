"use client";

import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import { Users, ShoppingCart, Package, Store } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import AccountService from "@/services/account.service";
import FarmerService from "@/services/farmer.service";
import ProductService from "@/services/product.service";
import OrderService from "@/services/order.service";
import { IAccountResponse, Role } from "@/types/account";
import { IFarmerResponse } from "@/types/farmer";
import { IProductResponse, ProductStatus } from "@/types/product";
import { IOrderResponse, IOrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/common/format";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import Link from "next/link";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Chờ xác nhận",
    color:
      "bg-amber-100 text-yellow-800 hover:bg-amber-300 dark:bg-yellow-900 dark:text-yellow-300",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color:
      "bg-blue-100 text-blue-800 hover:bg-blue-300 dark:bg-blue-900 dark:text-blue-300",
  },
  DELIVERING: {
    label: "Đang vận chuyển",
    color:
      "bg-orange-100 text-orange-800 hover:bg-orange-300 dark:bg-orange-900 dark:text-orange-300",
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color:
      "bg-green-100 text-green-800 hover:bg-green-300 dark:bg-green-900 dark:text-green-300",
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    color:
      "bg-green-300 text-green-900 hover:bg-green-500 dark:bg-green-900 dark:text-green-500",
  },
  CANCELED: {
    label: "Đã hủy",
    color:
      "bg-red-100 text-red-800 hover:bg-red-300 dark:bg-red-900 dark:text-red-300",
  },
};

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<IAccountResponse[]>([]);
  const [farmers, setFarmers] = useState<IFarmerResponse[]>([]);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          [accountsData, accountsError],
          [farmersData, farmersError],
          [productsData, productsError],
          [ordersData, ordersError],
        ] = await Promise.all([
          AccountService.getAllAccounts(),
          FarmerService.getAllFarmers(),
          ProductService.getAllByAdmin(),
          OrderService.getAllOrders(),
        ]);

        if (accountsError || farmersError || productsError || ordersError) {
          setError("Failed to fetch data.");
          console.error(
            accountsError || farmersError || productsError || ordersError
          );
          return;
        }

        setAccounts(accountsData || []);
        setFarmers(farmersData || []);
        setProducts(productsData || []);
        setOrders(ordersData || []);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // Calculate total revenue from delivered orders
  const totalRevenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  // Calculate user distribution by role
  const userRoleDistribution = accounts
    .filter((account) => !account.roles.includes(Role.ADMIN))
    .reduce((acc, account) => {
      account.roles.forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {} as Record<Role, number>);

  const userRoleData = Object.entries(userRoleDistribution).map(
    ([name, value]) => ({
      name: name,
      value: value,
    })
  );

  // Calculate product distribution by category
  const productCategoryDistribution = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const productCategoryData = Object.entries(productCategoryDistribution).map(
    ([name, value]) => ({
      name: name,
      value: value,
    })
  );

  // Calculate order distribution by status
  const orderStatusDistribution = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<IOrderStatus, number>);

  const orderStatusData = Object.entries(orderStatusDistribution).map(
    ([name, value]) => ({
      name: name,
      value: value,
    })
  );

  // Get latest products, users, farmers, orders (top 5)
  const latestProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const latestUsers = [...accounts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .filter((account) => !account.roles.includes(Role.ADMIN));

  const latestFarmers = [...farmers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const latestOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]; // Colors for pie chart

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng người dùng"
          value={accounts.length.toLocaleString()}
          description="Tổng số người dùng trong hệ thống"
          trend="neutral"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng sản phẩm"
          value={products.length.toLocaleString()}
          description="Tổng số sản phẩm trong hệ thống"
          trend="neutral"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng đơn hàng"
          value={orders.length.toLocaleString()}
          description="Tổng số đơn hàng trong hệ thống"
          trend="neutral"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Tổng trang trại"
          value={farmers.length.toLocaleString()}
          description="Tổng số trang trại trong hệ thống"
          trend="neutral"
          icon={<Store className="h-4 w-4" />}
        />
        {/* <StatsCard
          title="Tổng doanh thu"
          value={formatPrice(totalRevenue)}
          description="Tổng doanh thu từ các đơn hàng đã giao"
          trend="neutral"
          icon={<DollarSign className="h-4 w-4" />}
        /> */}
      </div>

      <div className="flex flex-col gap-4">
        <ChartCard
          title="Phân bố người dùng"
          description="Phân bố người dùng theo vai trò"
          chart={
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    name && percent !== undefined && !isNaN(percent)
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : ""
                  }
                >
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          }
        />
        <ChartCard
          title="Phân bố sản phẩm theo danh mục"
          description="Số lượng sản phẩm theo danh mục"
          chart={
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productCategoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          }
        />
        <ChartCard
          title="Phân bố đơn hàng theo trạng thái"
          description="Số lượng đơn hàng theo trạng thái"
          chart={
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Người dùng mới</CardTitle>
            <CardDescription>Danh sách 5 người dùng mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold">
                <div>Tên hiển thị</div>
                <div>Vai trò</div>
              </div>
              {latestUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/admin/user/${user.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <div className="font-medium">{user.displayName}</div>
                    </Link>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div>{user.roles.join(", ")}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Danh sách 5 đơn hàng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-8 items-center font-bold">
                <div className="col-span-2">Mã/Tên KH</div>
                <div className="col-span-4 text-center">
                  Tổng tiền/thời gian
                </div>
                <div className="col-span-2">Trạng thái</div>
              </div>
              {latestOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-8 items-center">
                  <div className="col-span-3">
                    <div className="font-medium">
                      <Link
                        href={`/admin/order/${order.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        #{order.id.substring(0, 6)}
                      </Link>{" "}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.account.displayName}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div>{formatPrice(order.totalPrice)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      className={`w-26 ${statusMap[order.status]?.color || ""}`}
                    >
                      {statusMap[order.status]?.label || order.status}
                    </Badge>
                  </div>
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
              <div className="grid grid-cols-5 items-center font-bold">
                <div className="col-span-2">Tên SP/Danh mục</div>
                <div className="col-span-2 text-center">Giá</div>
                <div className="col-span-1">Trạng thái</div>
              </div>
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-5 items-center gap-4"
                >
                  <div className="col-span-2">
                    <Link
                      href={`/admin/product/${product.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <div className="font-medium truncate">{product.name}</div>
                    </Link>
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div>{formatPrice(product.price)}</div>
                    <div className="text-sm text-gray-500"></div>
                  </div>
                  <div className="col-span-1 text-right">
                    <Badge
                      className={
                        product.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 hover:bg-green-300 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-900 dark:text-yellow-100"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trang trại mới</CardTitle>
            <CardDescription>Danh sách 5 trang trại mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold">
                <div>Tên trang trại</div>
                <div>Trạng thái</div>
              </div>
              {latestFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/admin/farmer/${farmer.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <div className="font-medium">{farmer.name}</div>
                    </Link>
                    <div className="text-sm text-gray-500">
                      {farmer.description || "Không có mô tả"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{farmer.status}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(farmer.createdAt).toLocaleDateString()}
                    </div>
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
