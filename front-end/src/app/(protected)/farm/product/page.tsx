"use client";

import { DataTable } from "@/components/common/data-table";
import { DeleteDialog } from "@/components/common/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileEdit,
  Trash2,
  Eye,
  ArrowUpDown,
  Star,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductService from "@/services/product.service";
import { IProductResponse } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { OcopStatus } from "@/types/OcopStatus";

export default function FarmerProducts() {
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: "",
    productName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Load sản phẩm của farmer
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const [data, error] = await ProductService.getAllByFarmer();

        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải danh sách sản phẩm. " + (error.message || ""),
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setProducts(data);
        }
      } catch (error: any) {
        console.error("Error loading products:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  //console.log("Products:", products);

  // Xử lý mở dialog xóa sản phẩm
  const handleDeleteProduct = (productId: string, productName: string) => {
    setDeleteDialog({
      open: true,
      productId,
      productName,
    });
  };

  // Xử lý xác nhận xóa sản phẩm
  const confirmDeleteProduct = async () => {
    if (!deleteDialog.productId) return;

    setIsDeleting(true);
    try {
      const [result, error] = await ProductService.deleteProduct(
        deleteDialog.productId
      );

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa sản phẩm. " + (error.message || ""),
          variant: "destructive",
        });
        return;
      }

      // Cập nhật danh sách sản phẩm
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteDialog.productId)
      );

      toast({
        title: "Thành công",
        description: `Đã xóa sản phẩm "${deleteDialog.productName}"`,
      });

      // Đóng dialog
      setDeleteDialog({ open: false, productId: "", productName: "" });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Đóng dialog xóa
  const cancelDelete = () => {
    setDeleteDialog({ open: false, productId: "", productName: "" });
  };

  // Format giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format trạng thái chung của sản phẩm
  const getProductStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="py-1 bg-green-100 text-green-600 hover:bg-green-400 hover:text-black dark:bg-green-700 dark:text-green-100 whitespace-nowrap">
            Đang bán
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="py-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-400 hover:text-black dark:bg-yellow-900 dark:text-yellow-100">
            Chờ duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="py-1 bg-red-100 text-red-800 hover:bg-red-400 hover:text-black dark:bg-red-900 dark:text-red-100">
            Bị từ chối
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="py-1 bg-orange-100 text-orange-800 hover:bg-orange-400 hover:text-black dark:bg-orange-900 dark:text-orange-100">
            Bị khóa
          </Badge>
        );
      case "DELETED":
        return (
          <Badge className="py-1 bg-gray-100 text-gray-800 hover:bg-gray-400 hover:text-black dark:bg-gray-900 dark:text-gray-100">
            Đã xóa
          </Badge>
        );
      default:
        return (
          <Badge className="py-1 bg-gray-100 text-gray-800 hover:bg-gray-400 hover:text-black dark:bg-gray-900 dark:text-gray-100">
            {status || "Không xác định"}
          </Badge>
        );
    }
  };

  // Format trạng thái OCOP
  const getOcopStatusBadge = (ocop?: any) => {
    const status = ocop?.status;
    if (!status) {
      return (
        <Badge className="py-1" variant="outline">
          Không có
        </Badge>
      );
    }
    switch (status) {
      case "PENDING_VERIFY":
        return (
          <Badge className="py-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-400 hover:text-black dark:bg-yellow-900 dark:text-yellow-100">
            Chờ duyệt
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge className="py-1 bg-green-100 text-green-600 hover:bg-green-400 hover:text-black dark:bg-green-700 dark:text-green-100">
            Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="py-1 bg-red-100 text-red-800 hover:bg-red-400 hover:text-black dark:bg-red-900 dark:text-red-100 cursor-help">
                  <div className="flex items-center gap-1">
                    Bị từ chối
                  </div>
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold mb-1">Lý do từ chối:</p>
                <p className="text-sm">
                  {ocop.reason || "Không có lý do cụ thể."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "NONE":
      default:
        return (
          <Badge className="py-1" variant="outline">
            Không có
          </Badge>
        );
    }
  };

  // Định nghĩa cột cho bảng
  const columns: ColumnDef<IProductResponse>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sản phẩm
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return row.original.category || "Chưa phân loại";
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex mx-auto"
        >
          Giá
        </Button>
      ),
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return `${formatPrice(row.original.price)}/${row.original.unitPrice}`;
      },
    },
    {
      accessorKey: "inventory",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex mx-auto w-10"
        >
          Tồn kho
        </Button>
      ),
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return (
          <div className="flex justify-center">{row.original.inventory}</div>
        );
      },
    },
    {
      accessorKey: "sold",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex mx-auto w-10"
        >
          Đã bán
        </Button>
      ),
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return <div className="flex justify-center">{row.original.sold}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex mx-auto w-10"
        >
          Ngày tạo
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy"),
    },
    {
      accessorKey: "status",
      header: "Trạng thái sản phẩm",
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return getProductStatusBadge(row.original.status);
      },
    },
    {
      accessorKey: "ocop.status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex mx-auto w-20"
        >
          Trạng thái OCOP
        </Button>
      ),
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return getOcopStatusBadge(row.original.ocop);
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex justify-center">Thao tác</div>
      ),
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        const product = row.original;
        return (
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/farm/product/${product.id}`)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/farm/product/update/${product.id}`)}
              title="Chỉnh sửa"
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteProduct(product.id, product.name)}
              title="Xóa sản phẩm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý sản phẩm
          </h1>
        </div>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/farm/product/create")}
        >
          <PlusCircle className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={products} />
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-8">
          <div className="mb-4">
            <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn
            </p>
          </div>
          <Button onClick={() => router.push("/farm/product/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm sản phẩm đầu tiên
          </Button>
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={cancelDelete}
        title="Xác nhận xóa sản phẩm"
        itemName={deleteDialog.productName}
        onConfirm={confirmDeleteProduct}
        isLoading={isDeleting}
        confirmText="Xóa sản phẩm"
      />
    </div>
  );
}
