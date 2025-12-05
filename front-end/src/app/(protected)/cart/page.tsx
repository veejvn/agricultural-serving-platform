"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CartEmpty from "@/components/product/cart-empty";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/common/format";

export default function CartPage() {
  const {
    items: cartItems,
    isLoading,
    error,
    totalItems,
    totalPrice,
    fetchCartItems,
    updateQuantity,
    deleteCartItem,
    clearCart,
  } = useCart();

  // Filter out invalid items
  const validCartItems = cartItems.filter((item) => {
    const isValid = item && item.id && item.product && item.product.id;
    return isValid;
  });

  // Group cart items by farmer
  const groupedByFarmer = validCartItems.reduce((groups, item) => {
    const farmerId = item.product?.farmer?.id;
    const farmerName = item.product?.farmer?.name || "Không xác định";

    if (!farmerId) return groups;

    if (!groups[farmerId]) {
      groups[farmerId] = {
        farmer: item.product.farmer,
        items: [],
      };
    }

    groups[farmerId].items.push(item);
    return groups;
  }, {} as Record<string, { farmer: any; items: typeof validCartItems }>);

  const farmerGroups = Object.values(groupedByFarmer);

  console.log("CartPage - groupedByFarmer:", groupedByFarmer);
  console.log("CartPage - validCartItems:", validCartItems);

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Handle quantity update
  const handleQuantityUpdate = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) return;

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    await updateQuantity(cartItemId, newQuantity);
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  // Handle delete item
  const handleDeleteItem = async (cartItemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    await deleteCartItem(cartItemId);
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  // Handle clear cart
  const handleClearCart = async () => {
    await clearCart();
  };

  const shipping = 0; // Phí vận chuyển
  const total = totalPrice + shipping;

  // Kiểm tra giỏ hàng trống
  const isCartEmpty = validCartItems.length === 0;

  if (isLoading && validCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Đang tải giỏ hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {isCartEmpty ? (
        <CartEmpty />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Sản phẩm trong giỏ hàng ({validCartItems.length} sản phẩm từ{" "}
                  {farmerGroups.length} người bán)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {farmerGroups.map((group, groupIndex) => (
                  <div key={group.farmer.id} className="space-y-4">
                    {/* Farmer Header */}
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border">
                        <Image
                          src={group.farmer.avatar || "/placeholder.svg"}
                          alt={group.farmer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-green-800 dark:text-green-300">
                          {group.farmer.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {group.items.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    {/* Products from this farmer */}
                    <div className="space-y-4">
                      {group.items.map((item) => {
                        const isUpdating = updatingItems.has(item.id);

                        return (
                          <div
                            key={item.id}
                            className={`flex flex-col gap-4 sm:flex-row pl-4 ${
                              isUpdating ? "opacity-50 pointer-events-none" : ""
                            }`}
                          >
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                              <Image
                                src={
                                  item.product?.thumbnail || "/placeholder.svg"
                                }
                                alt={item.product?.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <h4 className="font-medium text-green-800 dark:text-green-300">
                                  {item.product?.name ||
                                    "Không có tên sản phẩm"}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {item.product?.description ||
                                    "Không có mô tả"}
                                </p>
                                <div className="mt-1">
                                  <span className="font-medium text-green-600 dark:text-green-500">
                                    {formatPrice(item.product?.price || 0)}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    /{item.product?.unitPrice || ""}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center rounded-lg border">
                                  <button
                                    className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50"
                                    aria-label="Giảm số lượng"
                                    onClick={() =>
                                      handleQuantityUpdate(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={isUpdating || item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(
                                        e.target.value
                                      );
                                      if (newQuantity > 0) {
                                        handleQuantityUpdate(
                                          item.id,
                                          newQuantity
                                        );
                                      }
                                    }}
                                    className="h-8 w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                                    disabled={isUpdating}
                                  />
                                  <button
                                    className="flex h-8 w-8 items-center justify-center rounded-r-lg border-l text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50"
                                    aria-label="Tăng số lượng"
                                    onClick={() =>
                                      handleQuantityUpdate(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={isUpdating}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <button
                                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950 dark:hover:text-red-500 disabled:opacity-50"
                                  aria-label="Xóa sản phẩm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={isUpdating}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Separator between farmers (except for the last group) */}
                    {groupIndex < farmerGroups.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/product">Tiếp tục mua sắm</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
                  onClick={handleClearCart}
                  disabled={isLoading || validCartItems.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa giỏ hàng
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tạm tính
                  </span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Phí vận chuyển
                  </span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Khuyến mãi
                  </span>
                  <span className="font-medium">0₫</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-green-800 dark:text-green-300">
                    Tổng cộng
                  </span>
                  <span className="text-lg font-bold text-green-800 dark:text-green-300">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Thông tin đơn hàng
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      • {totalItems} sản phẩm từ {farmerGroups.length} người bán
                    </li>
                    <li>• Thời gian giao hàng dự kiến: 2-3 ngày</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  asChild
                >
                  <Link href="/checkout">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
