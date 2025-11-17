"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductService from "@/services/product.service";
import { IProductResponese, ProductStatus } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";
import LoadingSpinner from "@/components/common/loading-spinner";
import Link from "next/link";
import { ArrowLeft, DollarSign, Package, Star, Tag, User, CalendarDays, Clock, CircleCheck, CircleAlert, CircleX, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
      <div className="flex justify-center items-center h-full">
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

  const getStatusBadge = (status: ProductStatus) => {
    let className = "";
    let icon = null;
    switch (status) {
      case "ACTIVE":
        className = "bg-green-500";
        icon = <CircleCheck className="mr-1 h-3 w-3" />;
        break;
      case "PENDING":
        className = "bg-yellow-500";
        icon = <CircleAlert className="mr-1 h-3 w-3" />;
        break;
      case "REJECTED":
        className = "bg-red-500";
        icon = <CircleX className="mr-1 h-3 w-3" />;
        break;
      case "BLOCKED":
        className = "bg-gray-500";
        icon = <Ban className="mr-1 h-3 w-3" />;
        break;
      case "DELETED":
        className = "bg-purple-500";
        icon = <Trash2 className="mr-1 h-3 w-3" />;
        break;
      default:
        break;
    }
    return (
      <Badge className={className}>
        {icon}
        {status}
      </Badge>
    );
  };

  return (
    <div className="container flex flex-col mx-auto">
      <div className="mb-2">
        <Button asChild variant="outline">
          <Link href="/admin/product">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở về
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Hình ảnh sản phẩm */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hình ảnh sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.images.length > 0 ? (
                product.images.map((img) => (
                  <div key={img.id} className="relative w-full h-48">
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
                <div className="text-gray-500 col-span-full">
                  Không có hình ảnh nào.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Thông tin chính */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" /> Giá:
                  </TableCell>
                  <TableCell className="text-green-600 font-bold">
                    {product.price.toLocaleString()} {product.unitPrice}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Package className="mr-2 h-4 w-4" /> Tồn kho:
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.inventory}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Package className="mr-2 h-4 w-4" /> Đã bán:
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.sold}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Star className="mr-2 h-4 w-4" /> Đánh giá:
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{product.rating} / 5</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> Trạng thái:
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card Mô tả sản phẩm */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{product.description}</p>
          </CardContent>
        </Card>

        {/* Card Thông tin phân loại */}
        <Card>
          <CardHeader>
            <CardTitle>Phân loại</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Tag className="mr-2 h-4 w-4" /> Danh mục:
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <User className="mr-2 h-4 w-4" /> Nông dân:
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.farmer.name}</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card Lịch sử */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lịch sử</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" /> Ngày tạo:
                  </TableCell>
                  <TableCell>
                    {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                </TableRow>
                {product.deletedAt && (
                  <TableRow>
                    <TableCell className="font-medium flex items-center">
                      <Trash2 className="mr-2 h-4 w-4" /> Ngày xóa:
                    </TableCell>
                    <TableCell>
                      {format(new Date(product.deletedAt), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
