"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DeleteDialog } from "@/components/common/delete-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ProductService from "@/services/product.service";
import type { IProductResponese, Review, ProductStats } from "@/types/product";

// Định dạng giá tiền
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Định dạng ngày tháng
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

const mockReviews: Record<string, Review[]> = {
  "1": [
    {
      id: 1,
      userName: "Nguyễn Văn An",
      rating: 5,
      comment:
        "Vú sữa rất ngon, ngọt tự nhiên và thơm. Đóng gói cẩn thận, giao hàng nhanh.",
      date: new Date(2024, 0, 15),
      status: "approved",
    },
    {
      id: 2,
      userName: "Trần Thị Bình",
      rating: 4,
      comment: "Chất lượng tốt, giá hợp lý. Sẽ mua lại lần sau.",
      date: new Date(2024, 0, 10),
      status: "approved",
    },
    {
      id: 3,
      userName: "Lê Văn Cường",
      rating: 5,
      comment: "Trái cây tươi ngon, đúng như mô tả. Rất hài lòng!",
      date: new Date(2024, 0, 5),
      status: "pending",
    },
  ],
};

// Dữ liệu mẫu thống kê
const mockStats: Record<string, ProductStats> = {
  "1": {
    totalViews: 1250,
    totalOrders: 85,
    totalRevenue: 2125000,
    conversionRate: 6.8,
    averageRating: 4.8,
    totalReviews: 23,
    monthlyData: [
      { month: "T10", views: 200, orders: 15, revenue: 375000 },
      { month: "T11", views: 350, orders: 25, revenue: 625000 },
      { month: "T12", views: 450, orders: 30, revenue: 750000 },
      { month: "T1", views: 250, orders: 15, revenue: 375000 },
    ],
  },
};

export default function FarmerProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const productId = params.id;

  // State cho sản phẩm và loading
  const [product, setProduct] = useState<IProductResponese | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const reviews = mockReviews["1"] || [];
  const stats = mockStats["1"];

  // Load sản phẩm theo ID
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const [data, error] = await ProductService.getById(productId);

        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải thông tin sản phẩm. " + (error.message || ""),
            variant: "destructive",
          });
          notFound();
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tải sản phẩm",
          variant: "destructive",
        });
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Đang tải thông tin sản phẩm...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    notFound();
  }

  // Tính toán doanh thu từ số lượng đã bán và giá
  const calculatedRevenue = product.sold * product.price;

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      const [, error] = await ProductService.deleteProduct(productId);

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa sản phẩm. " + (error.message || ""),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Xóa sản phẩm thành công",
        description: "Sản phẩm đã được xóa khỏi hệ thống",
      });

      // Redirect về trang danh sách sản phẩm
      window.location.href = "/farm/product";
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa sản phẩm",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = product.status === "ACTIVE" ? "PENDING" : "ACTIVE";
    toast({
      title: "Cập nhật trạng thái thành công",
      description: `Sản phẩm đã được ${
        newStatus === "ACTIVE" ? "kích hoạt" : "tạm dừng"
      }`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Đang bán
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Chờ duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Bị từ chối
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Bị khóa
          </Badge>
        );
      case "DELETED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Đã xóa
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Không xác định
          </Badge>
        );
    }
  };

  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/farm/product">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-300">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tạo ngày {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/product/${product.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Xem trang công khai
            </Button>
          </Link>
          <Link href={`/farm/product/update/${product.id}`}>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Status and Quick Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trạng thái
                </p>
                <div className="mt-1">{getStatusBadge(product.status)}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleToggleStatus}>
                {product.status === "ACTIVE" ? "Tạm dừng" : "Kích hoạt"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lượt xem
                </p>
                <p className="text-lg font-semibold">
                  {stats?.totalViews.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đã bán
                </p>
                <p className="text-lg font-semibold">{product.sold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Doanh thu
                </p>
                <p className="text-lg font-semibold">
                  {formatPrice(calculatedRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Product Info */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="reviews">
                Đánh giá ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Product Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="relative aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={
                            product.images[selectedImage]?.path ||
                            product.thumbnail
                          }
                          alt={
                            product.images[selectedImage]?.alt || product.name
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {product.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                              selectedImage === index
                                ? "border-green-500"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                            }`}
                            aria-label={`Xem hình ảnh ${index + 1} của ${
                              product.name
                            }`}
                          >
                            <Image
                              src={image.path || "/placeholder.svg"}
                              alt={image.alt || `${product.name} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Tên sản phẩm
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {product.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Danh mục
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {product.category}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Giá bán
                        </label>
                        <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-500">
                          {formatPrice(product.price)} / {product.unitPrice}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Tồn kho
                        </label>
                        <p
                          className={`mt-1 font-medium ${
                            product.inventory > 0
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {product.inventory} {product.unitPrice}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Đã bán
                        </label>
                        <p className="mt-1 font-medium text-blue-600 dark:text-blue-500">
                          {product.sold} {product.unitPrice}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Đánh giá
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {product.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Mô tả sản phẩm
                      </label>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Đánh giá từ khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {review.userName}
                                </h4>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Intl.DateTimeFormat("vi-VN").format(
                                    review.date
                                  )}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {review.comment}
                              </p>
                            </div>
                            <div className="ml-4">
                              {getReviewStatusBadge(review.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Chưa có đánh giá nào
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {stats && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tỷ lệ chuyển đổi
                            </p>
                            <p className="text-lg font-semibold">
                              {stats.conversionRate}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Đánh giá trung bình
                            </p>
                            <p className="text-lg font-semibold">
                              {stats.averageRating}/5
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tổng đánh giá
                            </p>
                            <p className="text-lg font-semibold">
                              {stats.totalReviews}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Monthly Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Hiệu suất theo tháng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.monthlyData.map((month, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-4 rounded-lg border p-4 dark:border-gray-700"
                          >
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Tháng
                              </p>
                              <p className="font-semibold">{month.month}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lượt xem
                              </p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">
                                {month.views}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Đơn hàng
                              </p>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {month.orders}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Doanh thu
                              </p>
                              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                                {formatPrice(month.revenue)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link href={`/farm/product/update/${product.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa sản phẩm
                </Link>
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Cập nhật tồn kho
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Xem báo cáo chi tiết
              </Button>
            </CardContent>
          </Card>

          {/* Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lượt xem hôm nay
                </span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đơn hàng tuần này
                </span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Doanh thu tháng này
                </span>
                <span className="font-semibold">{formatPrice(375000)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Xếp hạng trong danh mục
                </span>
                <Badge variant="outline">#3</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID sản phẩm
                </span>
                <span className="font-mono text-sm">{product.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ngày tạo
                </span>
                <span className="text-sm">{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng hình ảnh
                </span>
                <span className="font-semibold">{product.images.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Có đơn hàng mới - 2 giờ trước
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Đánh giá mới - 5 giờ trước
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Cập nhật giá - 1 ngày trước
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xác nhận xóa sản phẩm"
        itemName={product?.name}
        onConfirm={handleDeleteProduct}
        isLoading={isDeleting}
        confirmText="Xóa sản phẩm"
      />
    </div>
  );
}
