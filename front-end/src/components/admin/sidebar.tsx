"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  SquareChartGantt,
  ChevronLeft,
  ChevronRight,
  Table2,
  ChartColumn,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/sidebar-context";
import AuthService from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    title: "Tổng quan",
  },
  {
    href: "/admin/user",
    icon: Users,
    title: "Người dùng",
  },
  {
    href: "/admin/product",
    icon: Package,
    title: "Sản phẩm",
  },
  {
    href: "/admin/category",
    icon: SquareChartGantt,
    title: "Danh mục sản phẩm",
  },
  {
    href: "/admin/order",
    icon: ShoppingCart,
    title: "Đơn hàng",
  },
  {
    href: "/admin/forum",
    icon: MessageSquare,
    title: "Diễn đàn",
  },
  {
    href: "/admin/notification",
    icon: Bell,
    title: "Thông báo",
  },
  {
    href: "/admin/setting",
    icon: Settings,
    title: "Cài đặt",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { toast } = useToast();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  if (pathname === "/admin/login") {
    return null; // Don't render sidebar on login page
  }

  const handleLogout = async () => {
    if (!refreshToken) {
      setIsLoggedIn(false);
      clearTokens();
      clearUser();
      router.push("/admin/login");
      return;
    }
    const [result, error] = await AuthService.logout(refreshToken);
    if (error) {
      toast({
        title: "Lỗi!",
        description: "Đăng xuất thất bại",
        variant: "error",
      });
      return;
    }
    setIsLoggedIn(false);
    clearTokens();
    clearUser();
    router.push("/admin/login");
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex min-h-screen flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header with toggle button */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link
                href="/admin"
                className="flex items-center gap-2 font-bold text-lg"
              >
                <span className="bg-green-600 text-white p-1 rounded">
                  <ChartColumn/>
                </span>
                <span>Admin</span>
              </Link>
            )}
            {isCollapsed && (
              <Link
                href="/admin"
                className="flex items-center justify-center w-full"
              >
                <ChartColumn className="text-green-600 h-6 w-6" />
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
            {menuItems.map((item, index) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

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

            {/* Logout button */}
            <div className="mt-auto px-3">
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full flex justify-center p-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Đăng xuất</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-2 justify-start p-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
