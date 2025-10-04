"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/common/mode-toggle";
import {
  Menu,
  Leaf,
  Cloud,
  LineChart,
  MessageSquare,
  ShoppingBag,
  User,
  Home,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import UserMenu from "@/components/layout/user-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null; // Không hiển thị header trên các trang đăng nhập hoặc đăng ký
  }

  const routes = [
    {
      name: "Trang chủ",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Sản phẩm",
      path: "/product",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Thời tiết",
      path: "/weather",
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      name: "Giá cả",
      path: "/price",
      icon: <LineChart className="h-5 w-5" />,
    },
    // {
    //   name: "Diễn đàn",
    //   path: "/forum",
    //   icon: <MessageSquare className="h-5 w-5" />,
    // },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
              </SheetHeader>
              <div className="flex items-center gap-2 py-4">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-500" />
                <span className="text-lg font-bold">
                  Nông Nghiệp Thông Minh
                </span>
              </div>
              <nav className="flex flex-col gap-4 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-lg transition-colors hover:bg-accent",
                      pathname === route.path
                        ? "bg-accent font-medium text-green-600 dark:text-green-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </nav>
              {!isLoggedIn && (
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      Đăng ký
                    </Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-500" />
            <span className="hidden font-bold sm:inline-block">
              Nông Nghiệp Thông Minh
            </span>
          </Link>
        </div>
        <nav className="hidden lg:flex lg:items-center lg:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-500",
                pathname === route.path
                  ? "text-green-600 dark:text-green-500"
                  : "text-muted-foreground"
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {/* <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
          >
            <Link href="/register">
              <User className="h-5 w-5" />
              <span className="sr-only">Tài khoản</span>
            </Link>
          </Button> */}
          {!isLoggedIn ? (
            pathname === "/register" ? (
              <Button
                asChild
                className="hidden bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 sm:flex mr-4"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="hidden bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 sm:flex mr-4"
              >
                <Link href="/register">Đăng ký</Link>
              </Button>
            )
          ) : (
            <div className="mr-2">
              <UserMenu />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
