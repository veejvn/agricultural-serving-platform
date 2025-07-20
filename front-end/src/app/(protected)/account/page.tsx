"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, CreditCard, Package, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  // Mock data
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    addresses: 2,
    orders: 5,
    paymentMethods: 1,
    notifications: 3,
  };

  const accountCards = [
    {
      title: "Thông tin cá nhân",
      description: "Cập nhật thông tin cá nhân của bạn",
      icon: User,
      href: "/account/information",
      stats: `${user.name} · ${user.email} · ${user.phone}`,
    },
    {
      title: "Địa chỉ",
      description: "Quản lý địa chỉ giao hàng",
      icon: Package,
      href: "/account/address",
      stats: `${user.addresses} địa chỉ`,
    },
    {
      title: "Đơn hàng",
      description: "Xem lịch sử đơn hàng của bạn",
      icon: ShoppingBag,
      href: "/account/order",
      stats: `${user.orders} đơn hàng`,
    },
    {
      title: "Phương thức thanh toán",
      description: "Quản lý phương thức thanh toán",
      icon: CreditCard,
      href: "/account/payment",
      stats: `${user.paymentMethods} phương thức`,
    },
    {
      title: "Thông báo",
      description: "Quản lý thông báo của bạn",
      icon: Bell,
      href: "/account/notification",
      stats: `${user.notifications} thông báo mới`,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tổng quan tài khoản</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accountCards.map((card, index) => (
          <Link href={card.href} key={index}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
                <p className="text-sm font-medium mt-2">{card.stats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
