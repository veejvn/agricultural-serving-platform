"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  Home,
  Lock,
  Package,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Tổng quan",
    href: "/account",
    icon: Home,
  },
  {
    title: "Thông tin cá nhân",
    href: "/account/information",
    icon: User,
  },
  {
    title: "Đổi mật khẩu",
    href: "/account/password",
    icon: Lock,
  },
  {
    title: "Địa chỉ",
    href: "/account/address",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/account/order",
    icon: ShoppingBag,
  },
  {
    title: "Phương thức thanh toán",
    href: "/account/payment",
    icon: CreditCard,
  },
  {
    title: "Thông báo",
    href: "/account/notification",
    icon: Bell,
  },
  {
    title: "Cài đặt",
    href: "/account/setting",
    icon: Settings,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 space-y-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href
                ? "bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400"
                : ""
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
