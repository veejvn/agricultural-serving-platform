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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductService from "@/services/product.service";
import categoryService from "@/services/category.service";

export default function ProductsPage() {
  const page = 1;
  const size = 16;
  const [isLoading, setIsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState<{
    content: IProduct[];
  } | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const [data, error] = await ProductService.getAllProducts({});
      if (error) {
        console.error("Failed to fetch products:", error);
        setIsLoading(false);
        return;
      }
      console.log("Fetched products:", data);
      setProductsPage(data);
      setIsLoading(false);
    }

    async function fetchCategories() {
      const [data, error] = await categoryService.getAllCategories();
      if (error) {
        console.error("Failed to fetch categories:", error);
        return;
      }
      console.log("Categories:", data);
      setCategories(data);
    }

    fetchCategories();
    fetchProducts();
  }, []);

  const products = productsPage?.content || [];

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const searchFilteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Lọc sản phẩm theo category được chọn
  const filteredProducts =
    selectedCategory === "all"
      ? searchFilteredProducts
      : searchFilteredProducts.filter(
          (product) => product.categoryId === selectedCategory
        );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
          Sản Phẩm Nông Nghiệp
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Các sản phẩm, công cụ và vật tư nông nghiệp chất lượng cao
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Giỏ hàng (0)
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-8"
      >
        {searchQuery && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Tìm thấy{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              sản phẩm cho từ khóa "
              <span className="font-semibold">{searchQuery}</span>"
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  trong danh mục "
                  <span className="font-semibold">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>
        )}

        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {searchQuery
                  ? "Không tìm thấy sản phẩm"
                  : "Chưa có sản phẩm nào"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                  : "Hiện tại chưa có sản phẩm nào trong danh mục này"}
              </p>
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {searchQuery
                    ? "Không tìm thấy sản phẩm"
                    : "Chưa có sản phẩm nào"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchQuery}" trong danh mục "${category.name}"`
                    : `Hiện tại chưa có sản phẩm nào trong danh mục "${category.name}"`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 rounded-lg bg-green-50 p-6 dark:bg-green-900">
        <h2 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">
          Sản phẩm đề xuất cho mùa vụ hiện tại
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  featured = false,
}: {
  product: IProduct;
  featured?: boolean;
}) {
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
        <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
}

// Định dạng giá tiền
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Interface cho dữ liệu category
interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children: ICategory[];
}

// Interface cho dữ liệu sản phẩm
interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sold: number;
  rating: number;
  thumbnail: string;
  unitPrice: string;
  categoryId: string;
  farmer: {
    id: string;
    name: string;
    avatar: string | null;
    coverImage: string | null;
    rating: number;
    description: string | null;
    status: string;
  };
}
