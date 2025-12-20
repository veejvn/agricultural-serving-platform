"use client";

import { DataTable } from "@/components/common/data-table";
import { DeleteDialog } from "@/components/common/delete-dialog"; // Reusing for rejection reason input
import { Button } from "@/components/ui/button";
import { Check, X, Star, Eye, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminOcopService from "@/services/adminOcop.service"; // Assuming this service will be created
import { IProductResponse } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { OcopStatus } from "@/types/OcopStatus";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function AdminOcopVerification() {
  const router = useRouter();
  const { toast } = useToast();

  const [pendingOcopProducts, setPendingOcopProducts] = useState<IProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    productId: "",
    productName: "",
    reason: "",
  });
  const [isRejecting, setIsRejecting] = useState(false);
  const [viewImagesDialog, setViewImagesDialog] = useState({
    open: false,
    images: [] as { url: string }[],
  });

  // Load pending OCOP products
  useEffect(() => {
    const loadPendingOcopProducts = async () => {
      setIsLoading(true);
      try {
        const [data, error] = await AdminOcopService.getPendingOcopProducts();

        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải danh sách sản phẩm OCOP chờ duyệt. " + (error.message || ""),
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setPendingOcopProducts(data);
        }
      } catch (error: any) {
        console.error("Error loading pending OCOP products:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm OCOP chờ duyệt",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingOcopProducts();
  }, [toast]);

  // Handle approve OCOP
  const handleApproveOcop = async (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn duyệt chứng nhận OCOP cho sản phẩm "${productName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const [result, error] = await AdminOcopService.approveOcop(productId);

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể duyệt OCOP. " + (error.message || ""),
          variant: "destructive",
        });
        return;
      }

      if (result) {
        toast({
          title: "Thành công",
          description: `Đã duyệt chứng nhận OCOP cho sản phẩm "${productName}"`,
        });
        // Remove from pending list
        setPendingOcopProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error: any) {
      console.error("Error approving OCOP:", error);
      toast({
        title: "Lỗi",
        description: "Không thể duyệt OCOP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject OCOP (open dialog)
  const handleRejectOcop = (productId: string, productName: string) => {
    setRejectionDialog({
      open: true,
      productId,
      productName,
      reason: "",
    });
  };

  // Confirm reject OCOP
  const confirmRejectOcop = async () => {
    if (!rejectionDialog.productId || !rejectionDialog.reason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do từ chối",
        variant: "destructive",
      });
      return;
    }

    setIsRejecting(true);
    try {
      const [result, error] = await AdminOcopService.rejectOcop(
        rejectionDialog.productId,
        rejectionDialog.reason
      );

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể từ chối OCOP. " + (error.message || ""),
          variant: "destructive",
        });
        return;
      }

      if (result) {
        toast({
          title: "Thành công",
          description: `Đã từ chối chứng nhận OCOP cho sản phẩm "${rejectionDialog.productName}"`,
        });
        // Remove from pending list
        setPendingOcopProducts((prev) => prev.filter((p) => p.id !== rejectionDialog.productId));
        setRejectionDialog({ open: false, productId: "", productName: "", reason: "" });
      }
    } catch (error: any) {
      console.error("Error rejecting OCOP:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối OCOP",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  // Cancel reject OCOP
  const cancelRejectOcop = () => {
    setRejectionDialog({ open: false, productId: "", productName: "", reason: "" });
  };

  // View OCOP images
  const handleViewOcopImages = (images: { url: string }[]) => {
    setViewImagesDialog({
      open: true,
      images,
    });
  };

  // Close image dialog
  const closeViewImagesDialog = () => {
    setViewImagesDialog({ open: false, images: [] });
  };

  const getOcopStatusBadge = (status?: OcopStatus) => {
    if (!status) {
      return <Badge variant="outline">Không có OCOP</Badge>;
    }
    switch (status) {
      case "PENDING_VERIFY":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Chờ duyệt
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge className="bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-100">
            Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Bị từ chối
          </Badge>
        );
      case "NONE":
      default:
        return <Badge variant="outline">Không có OCOP</Badge>;
    }
  };

  const columns: ColumnDef<IProductResponse>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sản phẩm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "farmer.name",
      header: "Nông dân",
      cell: ({ row }) => row.original.farmer.name,
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => row.original.category,
    },
    {
      accessorKey: "ocop.star",
      header: "Số sao OCOP",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          {row.original.ocop?.star || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "ocop.certificateNumber",
      header: "Số chứng nhận",
      cell: ({ row }) => row.original.ocop?.certificateNumber || "N/A",
    },
    {
      accessorKey: "ocop.issuedYear",
      header: "Năm cấp",
      cell: ({ row }) => row.original.ocop?.issuedYear || "N/A",
    },
    {
      accessorKey: "ocop.issuer",
      header: "Đơn vị cấp",
      cell: ({ row }) => row.original.ocop?.issuer || "N/A",
    },
    {
      id: "ocopImages",
      header: "Ảnh chứng nhận",
      cell: ({ row }) => {
        const images = row.original.ocop?.images || [];
        if (images.length === 0) {
          return "Không có ảnh";
        }
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewOcopImages(images)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem ảnh ({images.length})
          </Button>
        );
      },
    },
    {
      accessorKey: "ocop.status",
      header: "Trạng thái OCOP",
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        return getOcopStatusBadge(row.original.ocop?.status);
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { original: IProductResponse } }) => {
        const product = row.original;
        const ocop = product.ocop;

        if (!ocop || ocop.status !== "PENDING_VERIFY") {
          return <Badge variant="outline">Không khả dụng</Badge>;
        }

        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApproveOcop(product.id, product.name)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-2" />
              Duyệt
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRejectOcop(product.id, product.name)}
            >
              <X className="h-4 w-4 mr-2" />
              Từ chối
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
            Duyệt chứng nhận OCOP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Quản lý các sản phẩm chờ duyệt chứng nhận OCOP
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (pendingOcopProducts.length > 0 ? (
        <DataTable columns={columns} data={pendingOcopProducts} />
      ) : (
        <div className="text-center py-8">
          <div className="mb-4">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Không có sản phẩm OCOP nào chờ duyệt
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Tất cả sản phẩm OCOP đã được xử lý
            </p>
          </div>
        </div>
      ))}

      {/* Dialog từ chối OCOP */}
      <Dialog
        open={rejectionDialog.open}
        onOpenChange={cancelRejectOcop}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Từ chối chứng nhận OCOP</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối chứng nhận OCOP cho sản phẩm "{rejectionDialog.productName}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Lý do từ chối</Label>
              <Textarea
                id="reason"
                value={rejectionDialog.reason}
                onChange={(e) =>
                  setRejectionDialog((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Nhập lý do..."
                rows={4}
                className={rejectionDialog.reason.trim() ? "" : "border-red-500"}
              />
              {!rejectionDialog.reason.trim() && (
                <p className="text-sm text-red-500 mt-1">Lý do từ chối là bắt buộc</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelRejectOcop}
              disabled={isRejecting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRejectOcop}
              disabled={isRejecting || !rejectionDialog.reason.trim()}
            >
              {isRejecting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem ảnh chứng nhận OCOP */}
      <Dialog
        open={viewImagesDialog.open}
        onOpenChange={closeViewImagesDialog}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Ảnh chứng nhận OCOP</DialogTitle>
            <DialogDescription>
              Các hình ảnh chứng nhận OCOP của sản phẩm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {viewImagesDialog.images.length > 0 ? (
              viewImagesDialog.images.map((image, index) => (
                <div key={index} className="relative w-full aspect-square border rounded-md overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`Chứng nhận OCOP ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <p>Không có ảnh chứng nhận.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeViewImagesDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
