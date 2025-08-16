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
  Tractor,
  User,
  ChevronLeft,
  ChevronRight,
  Info,
  Sprout,
  Badge,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/stores/useUserStore";

const menuItems = [
  {
    title: "Tổng quan",
    href: "/account",
    icon: Home,
  },
  {
    title: "Thông tin cá nhân",
    href: "/account/information",
    icon: Info,
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
    title: "Nâng cấp lên nông dân",
    href: "/account/upgrade-to-farmer",
    icon: Sprout,
  },
  // {
  //   title: "Phương thức thanh toán",
  //   href: "/account/payment",
  //   icon: CreditCard,
  // },
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
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const user = useUserStore((state) => state.user);
  const hasFarmerRole = user.roles?.includes("FARMER") || false;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex min-h-screen flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-20" : "w-56"
        )}
      >
        {/* Header with toggle button */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link
                href="/account"
                className="flex items-center gap-2 font-bold text-lg"
              >
                <span className="text-green-600">Tài Khoản</span>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href="/account"
                className="flex items-center justify-center w-full"
              >
                <User className="text-green-600 h-6 w-6" />
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
          <nav className="grid items-start px-2 text-sm font-medium space-y-1">
            {menuItems
              .filter((item) => {
                // Hide upgrade to farmer menu if user already has FARMER role
                if (
                  item.href === "/account/upgrade-to-farmer" &&
                  hasFarmerRole
                ) {
                  return false;
                }
                return true;
              })
              .map((item) => {
                const isActive =  item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);

                const LinkComponent = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-600 dark:hover:text-green-500",
                      isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{LinkComponent}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
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
