"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, Ban, Package, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FarmerService from "@/services/farmer.service";
import ProductService from "@/services/product.service";
import OrderService from "@/services/order.service";
import { IFarmerResponse, IFarmerStatus } from "@/types/farmer";
import { IProductResponse } from "@/types/product"; // Đã sửa tên interface
import { IOrderResponse } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import useMessageByApiCode from "@/hooks/useMessageByApiCode"; // Đã sửa import
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminFarmerDetail() {
  const params = useParams();
  const farmerId = params.id as string;
  const { toast } = useToast();
  const getMessageByApiCode = useMessageByApiCode();

  const [farmer, setFarmer] = useState<IFarmerResponse | null>(null);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"block" | "unblock" | null>(null);

  const fetchFarmerDetails = async () => {
    setIsLoading(true);
    setError(null);

    const [farmerData, farmerErr] = await FarmerService.getFarmer(farmerId);
    const [productsData, productsErr] = await ProductService.getAllByFarmerId(farmerId); // Đã sửa tên hàm
    const [ordersData, ordersErr] = await OrderService.getOrdersByFarmerId(farmerId); // Đã sửa tên hàm

    if (farmerErr) {
      setError(getMessageByApiCode(farmerErr.code));
      toast({
        title: "Lỗi",
        description: getMessageByApiCode(farmerErr.code),
        variant: "destructive",
      });
      console.error("Failed to fetch farmer details:", farmerErr);
    } else {
      setFarmer(farmerData);
    }

    if (productsErr) {
      toast({
        title: "Lỗi",
        description: getMessageByApiCode(productsErr.code),
        variant: "destructive",
      });
      console.error("Failed to fetch products:", productsErr);
    } else {
      setProducts(productsData);
    }

    if (ordersErr) {
      toast({
        title: "Lỗi",
        description: getMessageByApiCode(ordersErr.code),
        variant: "destructive",
      });
      console.error("Failed to fetch orders:", ordersErr);
    } else {
      setOrders(ordersData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (farmerId) {
      fetchFarmerDetails();
    }
  }, [farmerId]);

  const handleStatusChange = async () => {
    if (!farmer || !actionType) return;

    const newStatus = actionType === "block" ? "ADMIN_BLOCK" : "ACTIVE";
    const [data, err] = await FarmerService.changeFarmerStatus(farmer.id, { // Đã sửa tên hàm
      status: newStatus,
    });

    if (err) {
      toast({
        title: "Lỗi",
        description: getMessageByApiCode(err.code),
        variant: "destructive",
      });
      console.error("Failed to change farmer status:", err);
    } else {
      toast({
        title: "Thành công",
        description: `Đã ${actionType === "block" ? "khóa" : "bỏ khóa"} nông dân ${data.name}`,
      });
      fetchFarmerDetails(); // Refresh the details
    }
    setIsAlertDialogOpen(false);
    setActionType(null);
  };

  const getStatusBadge = (status: IFarmerStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Hoạt động
          </Badge>
        );
      case "SELF_BLOCK":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Tự khóa
          </Badge>
        );
      case "ADMIN_BLOCK":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Bị khóa
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const productColumns: ColumnDef<IProductResponse>[] = [ // Đã sửa tên interface
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => <span>{row.original.price.toLocaleString()} VNĐ</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <Link href={`/admin/product/${row.original.id}`}>
          <Button variant="ghost" size="icon" title="Xem chi tiết">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const orderColumns: ColumnDef<IOrderResponse>[] = [
    {
      accessorKey: "id",
      header: "Mã đơn hàng",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: "Tổng tiền",
      cell: ({ row }) => <span>{row.original.totalPrice.toLocaleString()} VNĐ</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <Link href={`/admin/order/${row.original.id}`}>
          <Button variant="ghost" size="icon" title="Xem chi tiết">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Đang tải thông tin nông dân...</div>;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  if (!farmer) {
    return <div>Không tìm thấy nông dân.</div>;
  }

  const isBlocked = farmer.status === "ADMIN_BLOCK";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chi tiết nông dân: {farmer.name}
          </h1>
          <p className="text-muted-foreground">
            Thông tin chi tiết và hoạt động của nông dân
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/farm">Quay lại danh sách</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={isBlocked ? "text-green-500" : "text-orange-500"}
            title={isBlocked ? "Bỏ khóa" : "Khóa"}
            onClick={() => {
              setActionType(isBlocked ? "unblock" : "block");
              setIsAlertDialogOpen(true);
            }}
          >
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusBadge(farmer.status)}</div>
            <p className="text-xs text-muted-foreground">
              Trạng thái hoạt động hiện tại
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              {products.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Số lượng sản phẩm đang bán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              {orders.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Số lượng đơn hàng đã nhận
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đánh giá trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {farmer.rating ? farmer.rating.toFixed(1) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Dựa trên đánh giá của khách hàng (mock)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Chi tiết về nông dân và trang trại</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Tên nông dân:</h3>
            <p>{farmer.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Mô tả:</h3>
            <p>{farmer.description || "Không có mô tả"}</p>
          </div>
          {/* Thêm các thông tin khác nếu cần */}
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Sản phẩm ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng ({orders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>Các sản phẩm của nông dân này</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={productColumns} data={products} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>Các đơn hàng đã đặt từ nông dân này</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={orderColumns} data={orders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "block" ? "Khóa nông dân" : "Bỏ khóa nông dân"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn{" "}
              {actionType === "block" ? "khóa" : "bỏ khóa"} nông dân{" "}
              <span className="font-bold">{farmer.name}</span> không?
              Hành động này sẽ thay đổi trạng thái hoạt động của họ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
