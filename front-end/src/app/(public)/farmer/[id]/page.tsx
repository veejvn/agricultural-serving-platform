"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FarmerService from "@/services/farmer.service";
import ProductService from "@/services/product.service";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  Verified,
} from "lucide-react";
import AddressService from "@/services/address.service"; // Added import for AddressService
import { IFarmerResponse, IFarmerStatus } from "@/types/farmer";
import { IProductResponse } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

export default function FarmerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const farmerId = params.id as string;

  const [farmer, setFarmer] = useState<IFarmerResponse | null>(null);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Helper functions to get names from codes for display
  function getProvinceNameFromCode(code: string): string {
    const province = AddressService.getProvinces().find((p: any) => p.code === code) as any;
    return province?.name_with_type || code;
  }

  function getWardNameFromCode(wardCode: string, provinceCode: string): string {
    const ward = AddressService.getWardsByProvinceCode(provinceCode).find((w: any) => w.code === wardCode) as any;
    return ward?.name_with_type || wardCode;
  }

  useEffect(() => {
    const fetchFarmerData = async () => {
      setLoading(true);
      try {
        const [farmerData, farmerError] = await FarmerService.getFarmer(
          farmerId
        );
        if (farmerError || !farmerData) {
          setFarmer(null);
          setProducts([]);
          setLoading(false);
          return;
        }
        setFarmer(farmerData);

        const [productsData, productsError] = await ProductService.getAllByFarmerId(farmerId);
        if (productsError || !productsData) {
          setProducts([]);
        } else if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData.content) {
          setProducts(productsData.content);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setFarmer(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin trang trại...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy trang trại
          </h2>
          <p className="text-gray-600 mb-4">
            Trang trại bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const getStatusBadge = (status: IFarmerStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>
        );
      case "SELF_BLOCK":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Tạm ngưng</Badge>
        );
      case "ADMIN_BLOCK":
        return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-72 bg-gradient-to-r from-green-400 to-emerald-500">
        <img
          src={farmer.coverImage || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
      </div>

      {/* Farmer Profile */}
      <div className="container mx-auto px-4 mt-5 relative">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={farmer.avatar || "/placeholder.svg"}
                    alt={farmer.name}
                  />
                  <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {farmer.name}
                      </h1>
                      <Verified className="h-5 w-5 text-blue-500" />
                      {getStatusBadge(farmer.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{farmer.rating}</span>
                        <span>
                          ({products.reduce((sum, p) => sum + p.sold, 0)} đánh
                          giá)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{products.length} sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4" />
                        <span>
                          {products.reduce((sum, p) => sum + p.sold, 0)} đã bán
                        </span>
                      </div>
                    </div>

                    {farmer.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {farmer.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Theo dõi
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Chia sẻ
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Nhắn tin
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              Sản phẩm ({products.length})
            </TabsTrigger>
            <TabsTrigger value="about">Giới thiệu</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {loading ? (
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
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Không có sản phẩm nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Trang trại này hiện chưa có sản phẩm nào.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin trang trại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Giới thiệu</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {farmer.description || "Chưa có thông tin giới thiệu."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {farmer.address ? (
                          `
                          ${farmer.address.detail},
                          ${getWardNameFromCode(
                            farmer.address.ward,
                            farmer.address.province
                          )},
                          ${getProvinceNameFromCode(farmer.address.province)}
                          `
                        ) : (
                          "Chưa có địa chỉ"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>
                        {farmer.address ? farmer.address.receiverPhone : "Chưa có số điện thoại"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>contact@trangtraihuu.co</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Tham gia từ tháng 1, 2024</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Chứng nhận</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Hữu cơ VietGAP</Badge>
                    <Badge variant="outline">An toàn thực phẩm</Badge>
                    <Badge variant="outline">Trang trại xanh</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá từ khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
