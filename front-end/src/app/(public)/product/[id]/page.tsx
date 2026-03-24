"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Added CardHeader
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Frown, // Add Frown icon for "not found" state
  Award,
  Building2,
  X,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/contants/router";
import ProductService from "@/services/product.service";
import type { IProductResponse } from "@/types/product";
import { OcopStatus } from "@/types/OcopStatus";
import { ProductReviewForm } from "@/components/product/product-review-form";
import {
  ProductReviewsList,
  type Review,
} from "@/components/product/product-reviews-list";
import LoadingSpinner from "@/components/common/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Định dạng giá tiền
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// const products = [...]; // Removed hardcoded products
// const sampleReviews = {...}; // Removed hardcoded reviews

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setRedirect = useAuthStore.getState().setRedirect;
  const router = useRouter();
  const pathname = usePathname();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  // State cho sản phẩm và loading
  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // State cho đánh giá (sử dụng một mảng rỗng ban đầu)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [viewOcopImagesDialog, setViewOcopImagesDialog] = useState({
    open: false,
    images: [] as { url: string }[],
  });
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Load sản phẩm theo ID
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const [data, error] = await ProductService.getById(productId);

        if (error) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy thông tin sản phẩm. ",
            variant: "error",
          });
          // notFound(); // Removed direct call to notFound to allow rendering loading state
          setProduct(null); // Explicitly set product to null on error
          return;
        }

        setProduct(data);
        // Cập nhật selected image khi có dữ liệu
        setSelectedImage(0);
        // TODO: Load actual reviews for this product
        // setReviews(data?.reviews || []); // Assuming product response includes reviews
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tải sản phẩm",
          variant: "destructive",
        });
        setProduct(null); // Explicitly set product to null on error
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, toast]);

  // Product not found
  if (!product && !isLoading) {
    notFound();
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            <LoadingSpinner />
            <div className="text-center">
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                Đang tải thông tin sản phẩm...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Xử lý khi có đánh giá mới
  const handleNewReview = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Tăng số lượng
  const increaseQuantity = () => {
    if (!product) return;
    if (quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };

  // Giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    if (!isLoggedIn) {
      setRedirect(pathname);
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
      router.push(ROUTES.LOGIN);
      return;
    }
    // Kiểm tra số lượng tồn kho
    if (!product) return;
    if (quantity > product.inventory) {
      toast({
        title: "Lỗi",
        description: "Số lượng yêu cầu vượt quá số lượng tồn kho",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product.id, quantity);
      // Toast success đã được xử lý trong useCart hook
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Toast error đã được xử lý trong useCart hook
    } finally {
      setIsAddingToCart(false);
    }
  };

  // View OCOP images
  const handleViewOcopImages = (images: { url: string }[]) => {
    setViewOcopImagesDialog({
      open: true,
      images,
    });
  };

  // Close OCOP image dialog
  const closeViewOcopImagesDialog = () => {
    setViewOcopImagesDialog({ open: false, images: [] });
  };

  if (!product)
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8 text-center shadow-sm">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-0">
            <Frown className="h-24 w-24 text-gray-400 dark:text-gray-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-800 dark:text-gray-200">
              Sản phẩm không tồn tại hoặc đã bị xóa
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md">
              Rất tiếc, chúng tôi không tìm thấy sản phẩm bạn đang tìm kiếm. Vui
              lòng thử lại sau hoặc khám phá các sản phẩm khác.
            </p>
            <Link href="/product">
              <Button className="mt-8 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full text-lg px-8 py-3">
                <ChevronLeft className="mr-2 h-5 w-5" />
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link
            href="/product"
            className="flex items-center gap-1 hover:text-green-600"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại danh sách sản phẩm</span>
          </Link>
        </nav>
      </div>

      {/* Product Info Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          <Card className="relative aspect-3/2 object-cover overflow-hidden rounded-lg shadow-sm">
            <Image
              src={
                product.images[selectedImage]?.path ||
                product.thumbnail ||
                "/placeholder.svg"
              }
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </Card>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200",
                    selectedImage === index
                      ? "border-green-500 shadow-md"
                      : "border-gray-200 hover:border-green-300 dark:border-gray-700 dark:hover:border-green-600"
                  )}
                  aria-label={`Xem hình ảnh ${index + 1} của ${product.name}`}
                >
                  <Image
                    src={image.path || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-extrabold text-green-800 dark:text-green-200">
            {product.name}
          </h1>

          {/* Farmer Info Card */}
          <Card className="p-4 shadow-sm">
            <CardContent className="flex items-center justify-between p-0">
              <Link
                href={`/farmer/${product.farmer.id}`}
                className="flex items-center gap-3 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <img
                  src={product.farmer.avatar || "/placeholder.svg"}
                  alt={product.farmer.name}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {product.farmer.name}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>Đánh giá: {product.farmer.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
              {product.farmer.status !== "ACTIVE" && (
                <Badge className="ml-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {product.farmer.status === "SELF_BLOCK"
                    ? "Tạm ngưng"
                    : product.farmer.status === "ADMIN_BLOCK"
                    ? "Bị khóa"
                    : product.farmer.status}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Product Rating & Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                    )}
                  />
                ))}
              </div>
              {/* <span className="text-base text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)} ({reviews.length} đánh giá)
              </span> */}
              {product.ocop && product.ocop.status === "VERIFIED" && (
                <>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-gray-300 dark:bg-gray-600"
                  />
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none flex items-center gap-1 py-0.5 px-2">
                    <Star className="h-3 w-3 fill-white" />
                    <span className="text-xs font-bold">
                      OCOP {product.ocop.star} sao
                    </span>
                  </Badge>
                </>
              )}
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Price & Unit */}
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold text-green-600 dark:text-green-400">
              {formatPrice(product.price)}
            </span>
            <span className="text-xl text-gray-600 dark:text-gray-400">
              / {product.unitPrice}
            </span>
          </div>

          {/* Product Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 text-sm font-medium"
            >
              {product.category}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "px-3 py-1 text-sm font-medium",
                product.inventory > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              )}
            >
              {product.inventory > 0
                ? `Còn ${product.inventory} ${product.unitPrice}`
                : "Hết hàng"}
            </Badge>
            {product.sold > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-sm font-medium"
              >
                Đã bán: {product.sold}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 text-sm font-medium"
            >
              <Truck className="h-4 w-4 mr-1" /> Giao hàng toàn quốc
            </Badge>
          </div>

          <Separator />

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-none"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="flex h-11 w-14 items-center justify-center text-lg font-medium text-gray-800 dark:text-gray-200 border-x border-gray-200 dark:border-gray-700">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-none"
                onClick={increaseQuantity}
                disabled={quantity >= product.inventory}
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="flex-1 h-11 text-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full shadow-lg transition-all duration-200"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.inventory === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </div>
      </div>

      {/* OCOP Certification Section */}
      {product.ocop && product.ocop.status === "VERIFIED" && (
        <div className="mt-12 lg:mt-16">
          <Card className="shadow-sm rounded-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Chứng nhận OCOP
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Sản phẩm đạt chứng nhận OCOP (Chương trình Mỗi xã một sản phẩm)
                với chất lượng và nguồn gốc rõ ràng.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-base">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Số sao:
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(product.ocop.star)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500" />
                    ))}
                    <span className="text-gray-900 dark:text-gray-100">
                      ({product.ocop.star} sao)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Số chứng nhận:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {product.ocop.certificateNumber}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Năm cấp:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {product.ocop.issuedYear}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Đơn vị cấp:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    {product.ocop.issuer}
                  </span>
                </div>
              </div>

              {product.ocop.images.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Ảnh chứng nhận:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {product.ocop.images.map((image, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm hover:border-green-500 transition-colors"
                        onClick={() => setZoomedImage(image.url)}
                      >
                        <Image
                          src={image.url}
                          alt={`Chứng nhận OCOP ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Green Agriculture Message */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg text-green-800 dark:text-green-200 flex items-center gap-3">
                <Star className="w-5 h-5 flex-shrink-0" />
                <p className="text-base font-medium">
                  Mua sản phẩm OCOP giúp tăng thu nhập cho nông dân và phát
                  triển nông nghiệp bền vững.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Tabs */}
      <div className="mt-12 lg:mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            <TabsTrigger
              value="description"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Mô tả chi tiết
            </TabsTrigger>
            {/* <TabsTrigger
              value="specifications"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Hướng dẫn sử dụng
            </TabsTrigger> */}
            <TabsTrigger
              value="reviews"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Đánh giá ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                <p>{product?.longDescription || product?.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product?.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 text-base">
                            {value}
                          </span>
                          <Separator className="mt-2" />
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="usage" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                <p>{product?.usage}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-8">
              {/* Overall Review Summary */}
              <Card className="shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="text-6xl font-bold text-green-600 dark:text-green-500">
                        {product?.rating.toFixed(1)}
                      </span>
                      <div className="mt-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5",
                              i < Math.floor(product?.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="mt-1 text-base text-gray-500 dark:text-gray-400">
                        ({reviews.length} đánh giá)
                      </span>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="h-auto hidden sm:block"
                    />
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const reviewsWithThisRating = reviews.filter(
                            (review) => review.rating === star
                          ).length;
                          const percentage =
                            reviews.length > 0
                              ? Math.floor(
                                  (reviewsWithThisRating / reviews.length) * 100
                                )
                              : 0;

                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10">
                                {star} sao
                              </span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                                  style={
                                    {
                                      width: `${percentage}%`,
                                    } as React.CSSProperties
                                  }
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                                {percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Form */}
              <Card className="shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <ProductReviewForm
                    productId={productId}
                    onReviewSubmitted={handleNewReview}
                  />
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">
                  Tất cả đánh giá ({reviews.length})
                </h3>
                <ProductReviewsList reviews={reviews} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog xem ảnh chứng nhận OCOP */}
      <Dialog
        open={viewOcopImagesDialog.open}
        onOpenChange={closeViewOcopImagesDialog}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Ảnh chứng nhận OCOP</DialogTitle>
            <DialogDescription>
              Các hình ảnh chứng nhận OCOP của sản phẩm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {viewOcopImagesDialog.images.length > 0 ? (
              viewOcopImagesDialog.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm cursor-zoom-in hover:border-green-500 transition-colors"
                  onClick={() => setZoomedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={`Chứng nhận OCOP ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))
            ) : (
              <p>Không có ảnh chứng nhận.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeViewOcopImagesDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full-screen Zoom Modal */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-none bg-transparent shadow-none flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {zoomedImage && (
              <div className="relative w-full h-full min-h-[80vh] min-w-[80vw]">
                <Image
                  src={zoomedImage}
                  alt="Zoomed Certificate"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            )}
            <Button
              className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white border-none h-10 w-10 p-0"
              onClick={() => setZoomedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
