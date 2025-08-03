"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { getBackgroundColorClass } from "@/utils/common/getBackgroundColorClass";
import {
  User,
  ShoppingCart,
  Package,
  LogOut,
  ShoppingBag,
  Tractor,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, fetchCartItems } = useCart();
  const user = useUserStore((state) => state.user);
  const { avatar, displayName, email, roles } = user;
  const fallBack = displayName
    ? displayName[0].toUpperCase()
    : email
    ? email[0].toUpperCase()
    : "You";
  const avatarBackgroundColor = getBackgroundColorClass(displayName || email);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user has FARM role
  const hasFarmRole = roles?.includes("FARMER") || false;

  const handleLogout = async () => {
    setIsOpen(false); // Đóng popover trước khi logout

    if (!refreshToken) {
      setIsLoggedIn(false);
      clearTokens();
      clearUser();
      router.push("/login");
      return;
    }
    const [result, error] = await AuthService.logout(refreshToken);
    if (error) {
      //console.log(error);
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
    router.push("/login");
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false); // Đóng popover trước khi navigate
    router.push(path);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatar || ""} alt="Avatar" />
          <AvatarFallback className={`${avatarBackgroundColor} select-none`}>
            {fallBack}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-lg border border-zinc-300">
        <div className="flex flex-col gap-1">
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={() => handleNavigate("/account")}
          >
            <User className="w-5 h-5 text-green-600" />
            <span>Tài khoản</span>
          </button>
          {hasFarmRole && (
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
              onClick={() => handleNavigate("/farm")}
            >
              <Tractor className="w-5 h-5 text-green-600" />
              <span>Quản lý trang trại</span>
            </button>
          )}
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={() => handleNavigate("/cart")}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full size-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
            <span>Giỏ hàng</span>
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={() => handleNavigate("/account/order")}
          >
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <span>Đơn hàng</span>
          </button>
          <div className="border"></div>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-green-600" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
