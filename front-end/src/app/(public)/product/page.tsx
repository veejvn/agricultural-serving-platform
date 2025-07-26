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
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductService from "@/services/product.service";
import categoryService from "@/services/category.service";
import { ICategory, IProductTag, IPageResponse } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12); // Số sản phẩm trên mỗi trang
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [productsPageData, setProductsPageData] =
    useState<IPageResponse<IProductTag> | null>(null);
  const [allProducts, setAllProducts] = useState<IProductTag[]>([]); // Lưu trữ tất cả sản phẩm để filter
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function fetchAllProducts() {
      setIsLoading(true);
      const [data, error] = await ProductService.getAllProducts({
        page: 0,
        size: 1000, // Lấy một số lượng lớn để có tất cả sản phẩm
      });
      if (error) {
        console.error("Failed to fetch products:", error);
        setIsLoading(false);
        return;
      }
      console.log("Fetched products:", data);
      setAllProducts(data.content || []);
      setIsLoading(false);
    }

    fetchAllProducts();
  }, []);

  useEffect(() => {
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
  }, []);

  // Filter và phân trang ở frontend
  useEffect(() => {
    const filterProducts = () => {
      if (allProducts.length === 0) return;

      setIsFiltering(true);

      // Thêm timeout để tránh blocking UI khi filter một lượng lớn sản phẩm
      setTimeout(() => {
        let filteredProducts = allProducts;

        // Filter theo search query
        if (searchQuery.trim()) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              product.farmer.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }

        // Filter theo category
        if (selectedCategory !== "all") {
          filteredProducts = filteredProducts.filter(
            (product) => product.categoryId === selectedCategory
          );
        }

        // Sắp xếp sản phẩm
        filteredProducts = [...filteredProducts].sort((a, b) => {
          switch (sortBy) {
            case "name":
              return a.name.localeCompare(b.name, "vi", { numeric: true });
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            case "rating":
              return b.rating - a.rating;
            case "sold":
              return b.sold - a.sold;
            default:
              return 0;
          }
        });

        // Tính toán phân trang
        const totalElements = filteredProducts.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const currentPageProducts = filteredProducts.slice(
          startIndex,
          endIndex
        );

        // Cập nhật dữ liệu phân trang
        setProductsPageData({
          content: currentPageProducts,
          page: currentPage,
          totalPages,
          totalElements,
        });

        setIsFiltering(false);
      }, 0);
    };

    filterProducts();
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    currentPage,
    pageSize,
    sortBy,
  ]);

  const products = productsPageData?.content || [];

  // Hiển thị thông tin tìm kiếm (chỉ khi có search query)
  const getSearchInfo = () => {
    if (!searchQuery.trim()) return null;

    const totalResults = productsPageData?.totalElements || 0;

    return (
      <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Tìm thấy <span className="font-semibold">{totalResults}</span> sản
          phẩm cho từ khóa
          <span className="font-semibold">"{searchQuery}"</span>
          {selectedCategory !== "all" && (
            <span>
              {" "}
              trong danh mục "
              <span className="font-semibold">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
            </span>
          )}
        </p>
      </div>
    );
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < (productsPageData?.totalPages || 0)) {
      setCurrentPage(newPage);
    }
  };

  // Hàm xử lý khi thay đổi search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset về trang đầu tiên khi search
  };

  // Hàm xử lý khi thay đổi category (đã có reset trang)
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi category
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi sắp xếp
  };

  // Hàm tính số lượng sản phẩm theo category
  const getProductCountByCategory = (categoryId: string) => {
    let filteredProducts = allProducts;

    // Filter theo search query nếu có
    if (searchQuery.trim()) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter theo category
    if (categoryId !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === categoryId
      );
    }

    return filteredProducts.length;
  };

  // Component phân trang
  const PaginationComponent = () => {
    if (
      !productsPageData ||
      productsPageData.totalPages <= 1 ||
      isLoading ||
      isFiltering
    )
      return null;

    const { page, totalPages, totalElements } = productsPageData;
    const startItem = page * pageSize + 1;
    const endItem = Math.min((page + 1) * pageSize, totalElements);

    return (
      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Hiển thị {startItem}-{endItem} trong tổng số {totalElements} sản phẩm
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>

          {/* Hiển thị số trang */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 2) {
                pageNum = i;
              } else if (page > totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

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
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSearchChange("")}
              >
                ✕
              </Button>
            )}
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="sold">Bán chạy nhất</SelectItem>
            </SelectContent>
          </Select>
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
        onValueChange={handleCategoryChange}
        className="mb-8"
      >
        {getSearchInfo()}

        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="all">
            Tất cả
            <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {getProductCountByCategory("all")}
            </span>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
              <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {getProductCountByCategory(category.id)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {isLoading || isFiltering ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: IProductTag) => (
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

        {/* Thêm component phân trang */}
        <PaginationComponent />

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            {isLoading || isFiltering ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product: IProductTag) => (
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
          {products.slice(0, 4).map((product: IProductTag) => (
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
  product: IProductTag;
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
