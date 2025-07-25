"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { getBackgroundColorClass } from "@/utils/common/getBackgroundColorClass";
import { User, ShoppingCart, Package, LogOut, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserMenu() {
  const user = useUserStore((state) => state.user);
  const { avatar, displayName, email } = user;
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

  const handleLogout = async () => {
    if(!refreshToken) return;
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
    setIsLoggedIn(false)
    clearTokens();
    clearUser();
    router.push("/login");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
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
            onClick={() => router.push("/account")}
          >
            <User className="w-5 h-5 text-green-600" />
            <span>Tài khoản</span>
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span>Giỏ hàng</span>
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-600 hover:bg-zinc-200 transition font-medium"
            onClick={() => router.push("/account/order")}
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
