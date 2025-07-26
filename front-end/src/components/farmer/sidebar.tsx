"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

export function FarmerSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/farm",
      icon: LayoutDashboard,
      title: "Tổng quan",
      active: pathname === "/farm",
    },
    {
      href: "/farm/product",
      icon: Package,
      title: "Sản phẩm",
      active: pathname.startsWith("/farm/product"),
    },
    {
      href: "/farm/order",
      icon: ShoppingCart,
      title: "Đơn hàng",
      active: pathname.startsWith("/farm/order"),
    },
    {
      href: "/farm/statistical",
      icon: BarChart,
      title: "Thống kê",
      active: pathname.startsWith("/farm/statistical"),
    },
    {
      href: "/farm/crop",
      icon: Calendar,
      title: "Mùa vụ",
      active: pathname === "/farm/crop",
    },
    {
      href: "/farm/setting",
      icon: Settings,
      title: "Cài đặt",
      active: pathname === "/farm/setting",
    },
  ];

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
      {/* <div className="p-6">
        <Link
          href="/farm"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <span className="bg-green-600 text-white p-1 rounded">
            Trang Trại
          </span>
          <span>Nông Nghiệp</span>
        </Link>
      </div> */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-600 dark:hover:text-green-500",
                route.active
                  ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-500"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
      {/* <div className="mt-auto p-4">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Link>
      </div> */}
    </div>
  );
}
