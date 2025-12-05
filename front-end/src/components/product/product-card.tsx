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
import { IProductResponse, IProductTag } from "@/types/product";
import { formatPrice } from "@/utils/common/format";
import { ShoppingCart, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/contants/router";
import { useCart } from "@/hooks/useCart";

export function ProductCard({
  product,
  featured = false,
}: {
  product: IProductTag | IProductResponse;
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
      className={`group h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        featured
          ? "border-green-400 dark:border-green-600"
          : "border-border"
      }`}
    >
      <Link href={`/product/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
          {product.price > 20000 && (
            <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              Hot
            </div>
          )}
        </div>
        <CardHeader className="p-4 pt-3 pb-2">
          {product.farmer && (
            <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {product.farmer.name}
            </CardDescription>
          )}
          <CardTitle className="line-clamp-2 h-[3rem] text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end p-4 pt-2">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="h-4 w-px bg-border" />
            <span>Đã bán: {product.sold}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              /{product.unitPrice}
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
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
