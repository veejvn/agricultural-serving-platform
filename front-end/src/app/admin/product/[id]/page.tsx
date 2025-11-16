"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductService from "@/services/product.service";
import { IProductResponese } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";
import LoadingSpinner from "@/components/common/loading-spinner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProductResponese | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const [result, error] = await ProductService.getById(id as string);
          if (result) {
            setProduct(result);
          } else {
            setError(error?.message || "Không thể tải chi tiết sản phẩm.");
          }
        } catch (err: any) {
          // Bắt lỗi ở đây
          setError(err?.message || "Không thể tải chi tiết sản phẩm.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          <p className="text-sm text-gray-500">ID: {product.id}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hình ảnh sản phẩm */}
            <div>
              <Label className="text-lg font-semibold mb-2 block">Hình ảnh</Label>
              <div className="grid grid-cols-2 gap-4">
                {product.images.length > 0 ? (
                  product.images.map((img) => (
                    <div key={img.id} className="relative w-full h-32">
                      <AspectRatio ratio={1 / 1}>
                        <Image
                          src={img.path}
                          alt={img.alt || product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </AspectRatio>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Không có hình ảnh nào.</div>
                )}
              </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div>
              <Label className="text-lg font-semibold mb-2 block">
                Chi tiết
              </Label>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Mô tả:</span>{" "}
                  <p className="text-gray-700">{product.description}</p>
                </div>
                <div>
                  <span className="font-medium">Giá:</span>{" "}
                  <span className="text-green-600 font-bold">
                    {product.price.toLocaleString()} {product.unitPrice}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Tồn kho:</span>{" "}
                  <Badge variant="outline">{product.inventory}</Badge>
                </div>
                <div>
                  <span className="font-medium">Đã bán:</span>{" "}
                  <Badge variant="secondary">{product.sold}</Badge>
                </div>
                <div>
                  <span className="font-medium">Đánh giá:</span>{" "}
                  <Badge variant="default">{product.rating} / 5</Badge>
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  <Badge
                    className={`
                      ${product.status === "ACTIVE" && "bg-green-500"}
                      ${product.status === "PENDING" && "bg-yellow-500"}
                      ${product.status === "REJECTED" && "bg-red-500"}
                      ${product.status === "BLOCKED" && "bg-gray-500"}
                      ${product.status === "DELETED" && "bg-purple-500"}
                    `}
                  >
                    {product.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Danh mục:</span>{" "}
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div>
                  <span className="font-medium">Nông dân:</span>{" "}
                  <Badge variant="outline">{product.farmer.name}</Badge>
                </div>
                <div>
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
                {product.deletedAt && (
                  <div>
                    <span className="font-medium">Ngày xóa:</span>{" "}
                    {format(new Date(product.deletedAt), "dd/MM/yyyy HH:mm")}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          {/* Các phần bổ sung như đánh giá, giá thị trường có thể đặt ở đây */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
