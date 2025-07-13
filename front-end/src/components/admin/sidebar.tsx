"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, ShoppingCart, MessageSquare, Bell, Settings, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      title: "Tổng quan",
      active: pathname === "/admin",
    },
    {
      href: "/admin/nguoi-dung",
      icon: Users,
      title: "Người dùng",
      active: pathname === "/admin/nguoi-dung",
    },
    {
      href: "/admin/san-pham",
      icon: Package,
      title: "Sản phẩm",
      active: pathname === "/admin/san-pham",
    },
    {
      href: "/admin/don-hang",
      icon: ShoppingCart,
      title: "Đơn hàng",
      active: pathname === "/admin/don-hang",
    },
    {
      href: "/admin/dien-dan",
      icon: MessageSquare,
      title: "Diễn đàn",
      active: pathname === "/admin/dien-dan",
    },
    {
      href: "/admin/thong-bao",
      icon: Bell,
      title: "Thông báo",
      active: pathname === "/admin/thong-bao",
    },
    {
      href: "/admin/cai-dat",
      icon: Settings,
      title: "Cài đặt",
      active: pathname === "/admin/cai-dat",
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-green-600 text-white p-1 rounded">Admin</span>
          <span>Nông Nghiệp</span>
        </Link>
      </div>
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
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Link>
      </div>
    </div>
  )
}
