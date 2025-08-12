"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IProductResponese, IProductTag } from "@/types/product";
import { formatPrice } from "@/utils/common/format";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/contants/router.contant";
import { useCart } from "@/hooks/useCart";

export function ProductCard({
  product,
  featured = false,
}: {
  product: IProductTag | IProductResponese;
  featured?: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setRedirect = useAuthStore.getState().setRedirect;
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn không cho click vào link
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!isLoggedIn) {
      setRedirect(pathname); // Lưu trang hiện tại để redirect sau khi đăng nhập
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      router.push(ROUTES.LOGIN);
      return;
    }

    setIsAdding(true);

    try {
      await addToCart(product.id, 1);
      // Toast đã được xử lý trong useCart hook
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Toast lỗi đã được xử lý trong useCart hook
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <Card
      className={`flex h-full flex-col overflow-hidden transition-all hover:shadow-md ${
        featured
          ? "border-green-300 dark:border-green-700"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <Link href={`/product/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {product.price > 20000 && (
            <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
              Hot
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="line-clamp-1 text-lg text-green-800 dark:text-green-300">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Nông trại: {product.farmer.name}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600 dark:text-green-500">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              /{product.unitPrice}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Đã bán: {product.sold}</span>
            <span>⭐ {product.rating.toFixed(1)}</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
        </Button>
      </CardFooter>
    </Card>
  );
}
