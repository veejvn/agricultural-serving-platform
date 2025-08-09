"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tractor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FarmerSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

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
    <TooltipProvider>
      <div
        className={cn(
          "flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-20" : "w-46"
        )}
      >
        {/* Header with toggle button */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link
                href="/farm"
                className="flex items-center gap-2 font-bold text-lg"
              >
                {/* <Tractor className="text-green-600 p-1 rounded text-sm"/> */}
                <span className="text-green-600">Trang Trại</span>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href="/farm"
                className="flex items-center justify-center w-full"
              >
                <Tractor className="text-green-600 p-1 rounded text-sm" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {routes.map((route, index) => {
              const LinkComponent = (
                <Link
                  key={index}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-600 dark:hover:text-green-500",
                    route.active
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-500"
                      : "text-gray-500 dark:text-gray-400",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <route.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{route.title}</span>
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>{LinkComponent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{route.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return LinkComponent;
            })}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
