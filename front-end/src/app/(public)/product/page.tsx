"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/hooks/useCart";

export default function ProductsPage() {
  const { totalItems, fetchCartItems } = useCart();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12); // Số sản phẩm trên mỗi trang
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [productsPageData, setProductsPageData] =
    useState<IPageResponse<IProductTag> | null>(null);
  const [allProducts, setAllProducts] = useState<IProductTag[]>([]); // Lưu trữ tất cả sản phẩm để filter
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [originalCategories, setOriginalCategories] = useState<ICategory[]>([]);
  const [allFlatCategories, setAllFlatCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function fetchAllProducts() {
      setIsLoading(true);
      const [data, error] = await ProductService.getAllProducts({
        page: 0,
        size: 1000,
      });
      if (error) {
        console.error("Failed to fetch products:", error);
        setIsLoading(false);
        return;
      }
      //console.log("Fetched products:", data);
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
      //console.log("Categories:", data);

      // Lưu categories gốc để sử dụng cho hierarchy logic
      setOriginalCategories(data);

      // Flatten tất cả categories (bao gồm parent và children) để tìm kiếm
      const flattenCategories = (categories: ICategory[]): ICategory[] => {
        const result: ICategory[] = [];
        categories.forEach((category) => {
          result.push(category);
          if (category.children && category.children.length > 0) {
            result.push(...flattenCategories(category.children));
          }
        });
        return result;
      };

      const allCategories = flattenCategories(data);
      setAllFlatCategories(allCategories);

      // Chỉ lưu categories level 0 cho dropdown chính
      const level0Categories = data.filter((cat: ICategory) => cat.level === 0);
      setCategories(level0Categories);
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

        // Filter theo category (bao gồm cả children categories)
        if (selectedCategory !== "all") {
          filteredProducts = filteredProducts.filter((product) => {
            return (
              product.categoryId === selectedCategory ||
              isChildOfCategory(
                product.categoryId,
                selectedCategory,
                originalCategories
              )
            );
          });
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

  // Hàm kiểm tra xem một category có phải là con của category khác không
  const isChildOfCategory = (
    childCategoryId: string,
    parentCategoryId: string,
    categoriesList: ICategory[]
  ): boolean => {
    const findCategory = (
      categories: ICategory[],
      id: string
    ): ICategory | null => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.children && category.children.length > 0) {
          const found = findCategory(category.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const childCategory = findCategory(categoriesList, childCategoryId);
    if (!childCategory) return false;

    // Kiểm tra nếu chính nó là parent category
    if (childCategoryId === parentCategoryId) return true;

    // Kiểm tra nếu parent category là ancestor
    let currentParentId = childCategory.parentId;
    while (currentParentId) {
      if (currentParentId === parentCategoryId) return true;
      const parentCategory = findCategory(categoriesList, currentParentId);
      currentParentId = parentCategory?.parentId || null;
    }

    return false;
  };

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

    // Filter theo category (bao gồm cả children categories)
    if (categoryId !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        // Kiểm tra exact match hoặc là child category
        return (
          product.categoryId === categoryId ||
          isChildOfCategory(product.categoryId, categoryId, originalCategories)
        );
      });
    }

    return filteredProducts.length;
  };

  // Tìm category hiện tại được chọn để hiển thị
  const selectedCategoryData =
    selectedCategory === "all"
      ? { name: "Tất cả", id: "all" }
      : allFlatCategories.find((cat) => cat.id === selectedCategory) || {
          name: "Tất cả",
          id: "all",
        };

  // Component Category Selector với navigation qua levels
  const CategorySelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [navigationStack, setNavigationStack] = useState<ICategory[]>([]);
    const [isNavigating, setIsNavigating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setNavigationStack([]);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Lấy categories hiện tại để hiển thị
    const getCurrentCategories = () => {
      if (navigationStack.length === 0) {
        // Level 0 - hiển thị categories gốc
        return categories;
      } else {
        // Hiển thị children của category cuối cùng trong stack
        const lastCategory = navigationStack[navigationStack.length - 1];
        return lastCategory.children || [];
      }
    };

    // Điều hướng vào category con
    const navigateToChildren = async (category: ICategory) => {
      if (category.children && category.children.length > 0) {
        setIsNavigating(true);
        // Thêm delay nhỏ để animation mượt hơn
        setTimeout(() => {
          setNavigationStack([...navigationStack, category]);
          setIsNavigating(false);
        }, 150);
      }
    };

    // Quay lại level trước
    const navigateBack = () => {
      setIsNavigating(true);
      setTimeout(() => {
        setNavigationStack(navigationStack.slice(0, -1));
        setIsNavigating(false);
      }, 150);
    };

    // Chọn category và đóng dropdown
    const selectCategory = (categoryId: string) => {
      handleCategoryChange(categoryId);
      setIsOpen(false);
      setNavigationStack([]);
    };

    // Lấy breadcrumb path hiện tại
    const getBreadcrumbPath = () => {
      if (navigationStack.length === 0) return "Danh mục sản phẩm";
      return navigationStack.map((cat) => cat.name).join(" › ");
    };

    // Lấy level hiện tại
    const getCurrentLevel = () => navigationStack.length;

    const currentCategories = getCurrentCategories();

    return (
      <div>
        {/* Custom Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            className="w-full sm:w-80 justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{selectedCategoryData.name}</span>
              <div className="flex items-center gap-2 ml-2">
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {getProductCountByCategory(selectedCategory)}
                </span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen ? "rotate-90" : ""
                  )}
                />
              </div>
            </div>
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-full sm:w-96 rounded-md border bg-popover text-popover-foreground shadow-lg">
              {/* Header với breadcrumb và nút back */}
              <div className="border-b bg-gray-50 dark:bg-gray-800 p-3 rounded-t-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {navigationStack.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={navigateBack}
                        className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled={isNavigating}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {getBreadcrumbPath()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {currentCategories.length} danh mục
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div className="max-h-80 overflow-y-auto">
                {isNavigating ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <div className="p-1">
                    {/* Option "Tất cả" chỉ hiện ở level 0 */}
                    {navigationStack.length === 0 && (
                      <div
                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        onClick={() => selectCategory("all")}
                      >
                        <span className="font-medium">Tất cả sản phẩm</span>
                        <span className="rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 text-xs font-medium">
                          {getProductCountByCategory("all")}
                        </span>
                      </div>
                    )}

                    {/* Categories hiện tại */}
                    {currentCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded group transition-colors"
                      >
                        <div
                          className="flex-1 cursor-pointer truncate"
                          onClick={() => selectCategory(category.id)}
                        >
                          <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {getProductCountByCategory(category.id)}
                          </span>
                          {category.children &&
                            category.children.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToChildren(category);
                                }}
                                className="h-7 w-7 p-0 opacity-60 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                disabled={isNavigating}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}

                    {/* Thông báo khi không có categories */}
                    {currentCategories.length === 0 && (
                      <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="mb-2">📁</div>
                        Không có danh mục con
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          <CategorySelector />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Giỏ hàng ({totalItems})
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        {getSearchInfo()}

        {/* Product Grid */}
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
              {searchQuery ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                : "Hiện tại chưa có sản phẩm nào trong danh mục này"}
              {selectedCategory !== "all" && selectedCategoryData.name && (
                <span> trong danh mục "{selectedCategoryData.name}"</span>
              )}
            </p>
          </div>
        )}

        {/* Thêm component phân trang */}
        <PaginationComponent />
      </div>

      {/* <div className="mt-12 rounded-lg bg-green-50 p-6 dark:bg-green-900">
        <h2 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">
          Sản phẩm đề xuất cho mùa vụ hiện tại
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 4).map((product: IProductTag) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div> */}
    </div>
  );
}
