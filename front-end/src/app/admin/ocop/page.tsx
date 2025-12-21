"use client";

import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Star,
  Eye,
  Search,
  User,
  Tag,
  Calendar,
  FileText,
  Building2,
  MapPin,
  Maximize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminOcopService from "@/services/adminOcop.service";
import { IProductResponse } from "@/types/product";
import { OcopStatus } from "@/types/OcopStatus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

export default function AdminOcopVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdFilter = searchParams.get("productId");
  const { toast } = useToast();

  const [pendingOcopProducts, setPendingOcopProducts] = useState<
    IProductResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OcopStatus | "ALL">("ALL");
  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    productId: "",
    productName: "",
    reason: "",
  });
  const [approvalDialog, setApprovalDialog] = useState({
    open: false,
    productId: "",
    productName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewImagesDialog, setViewImagesDialog] = useState({
    open: false,
    images: [] as { url: string }[],
  });
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Load pending OCOP products
  useEffect(() => {
    const loadOcopProducts = async () => {
      setIsLoading(true);
      try {
        const [result, error] = await AdminOcopService.getOcopProducts();

        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải danh sách sản phẩm OCOP. " + (error.message || ""),
            variant: "error",
          });
          return;
        }

        if (result) {
          setPendingOcopProducts(result.data);
        }
      } catch (error: any) {
        console.error("Error loading OCOP products:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm OCOP",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOcopProducts();
  }, [toast]);

  // Handle approve OCOP (open dialog)
  const handleApproveOcop = (productId: string, productName: string) => {
    setApprovalDialog({
      open: true,
      productId,
      productName,
    });
  };

  // Confirm approve OCOP
  const confirmApproveOcop = async () => {
    if (!approvalDialog.productId) return;

    setIsProcessing(true);
    try {
      const [result, error] = await AdminOcopService.approveOcop(
        approvalDialog.productId
      );

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể duyệt OCOP. " + (error.message || ""),
          variant: "error",
        });
        return;
      }

      if (result) {
        toast({
          title: "Thành công",
          description: `Đã duyệt chứng nhận OCOP cho sản phẩm "${approvalDialog.productName}"`,
        });
        // Update local state status
        setPendingOcopProducts((prev) =>
          prev.map((p) =>
            p.id === approvalDialog.productId
              ? { ...p, ocop: { ...p.ocop!, status: "VERIFIED" as OcopStatus } }
              : p
          )
        );
        setApprovalDialog({ open: false, productId: "", productName: "" });
      }
    } catch (error: any) {
      console.error("Error approving OCOP:", error);
      toast({
        title: "Lỗi",
        description: "Không thể duyệt OCOP",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
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
        variant: "error",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const [result, error] = await AdminOcopService.rejectOcop(
        rejectionDialog.productId,
        rejectionDialog.reason
      );

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể từ chối OCOP. " + (error.message || ""),
          variant: "error",
        });
        return;
      }

      if (result) {
        toast({
          title: "Thành công",
          description: `Đã từ chối chứng nhận OCOP cho sản phẩm "${rejectionDialog.productName}"`,
        });
        // Update local state status
        setPendingOcopProducts((prev) =>
          prev.map((p) =>
            p.id === rejectionDialog.productId
              ? { ...p, ocop: { ...p.ocop!, status: "REJECTED" as OcopStatus } }
              : p
          )
        );
        setRejectionDialog({
          open: false,
          productId: "",
          productName: "",
          reason: "",
        });
      }
    } catch (error: any) {
      console.error("Error rejecting OCOP:", error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối OCOP",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOcopProducts = useMemo(() => {
    let filtered = pendingOcopProducts;

    if (productIdFilter) {
      filtered = filtered.filter((p) => p.id === productIdFilter);
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((p) => p.ocop?.status === statusFilter);
    }

    if (globalFilter) {
      const search = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.farmer.name.toLowerCase().includes(search) ||
          p.ocop?.certificateNumber?.toLowerCase().includes(search) ||
          p.ocop?.issuer?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [pendingOcopProducts, productIdFilter, statusFilter, globalFilter]);

  const getOcopStatusBadge = (status?: OcopStatus) => {
    if (!status) return null;
    switch (status) {
      case "PENDING_VERIFY":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            Chờ duyệt
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
            Bị từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Duyệt chứng nhận OCOP
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý hồ sơ thẩm định và chất lượng sản phẩm OCOP
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên sản phẩm, nông dân, số chứng nhận..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[180px] border-gray-200">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hồ sơ</SelectItem>
              <SelectItem value="PENDING_VERIFY">Chờ duyệt</SelectItem>
              <SelectItem value="VERIFIED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Bị từ chối</SelectItem>
            </SelectContent>
          </Select>
          {productIdFilter && (
            <Button
              variant="outline"
              onClick={() => router.push("/admin/ocop")}
              className="text-gray-600 border-dashed"
            >
              Xem tất cả
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 animate-pulse font-medium">
            Đang đồng bộ dữ liệu hồ sơ...
          </p>
        </div>
      ) : filteredOcopProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredOcopProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Product Thumbnail Section */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-50">
                  <Image
                    src={product.thumbnail || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getOcopStatusBadge(product.ocop?.status)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {product.farmer.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b py-4 mb-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs uppercase font-semibold">
                        Sao OCOP
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (product.ocop?.star || 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-700">
                          {product.ocop?.star} sao
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs uppercase font-semibold">
                        Năm cấp
                      </p>
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {product.ocop?.issuedYear || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs uppercase font-semibold">
                        Số chứng nhận
                      </p>
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span
                          className="truncate max-w-[120px]"
                          title={product.ocop?.certificateNumber}
                        >
                          {product.ocop?.certificateNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-xs uppercase font-semibold">
                        Đơn vị cấp
                      </p>
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="" title={product.ocop?.issuer}>
                          {product.ocop?.issuer || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-gray-200 hover:bg-gray-50"
                      onClick={() =>
                        setViewImagesDialog({
                          open: true,
                          images: product.ocop?.images || [],
                        })
                      }
                    >
                      <Eye className="w-4 h-4 mr-2 text-blue-500" />
                      Xem chứng chỉ
                    </Button>

                    {product.ocop?.status === "PENDING_VERIFY" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 h-9 px-4 shadow-sm"
                          onClick={() =>
                            handleApproveOcop(product.id, product.name)
                          }
                        >
                          <Check className="w-4 h-4 mr-1.5" /> Duyệt
                        </Button>
                        <Button
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700 h-9 px-3 shadow-sm"
                          onClick={() =>
                            handleRejectOcop(product.id, product.name)
                          }
                        >
                          <X className="w-4 h-4 mr-1.5" /> Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-2xl py-16 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Hồ sơ trống
            </h3>
            <p className="text-gray-500 text-sm">
              Không tìm thấy hồ sơ OCOP nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        </div>
      )}

      {/* Dialog Duyệt OCOP */}
      <Dialog
        open={approvalDialog.open}
        onOpenChange={() =>
          setApprovalDialog({ ...approvalDialog, open: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-emerald-700">
              Duyệt chứng nhận
            </DialogTitle>
            <DialogDescription className="text-base">
              Bạn có chắc chắn muốn{" "}
              <span className="font-bold text-emerald-600 uppercase">
                phê duyệt
              </span>{" "}
              hồ sơ OCOP cho sản phẩm{" "}
              <span className="font-bold text-gray-900">
                "{approvalDialog.productName}"
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 my-2">
            <p className="text-sm text-emerald-800 flex gap-2">
              <Check className="w-5 h-5 flex-shrink-0" />
              Sản phẩm sẽ được gắn nhãn chứng nhận OCOP chính thức trên hệ thống
              sau khi bạn xác nhận.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="ghost"
              onClick={() =>
                setApprovalDialog({ ...approvalDialog, open: false })
              }
            >
              Hủy
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={confirmApproveOcop}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận Duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog từ chối OCOP */}
      <Dialog
        open={rejectionDialog.open}
        onOpenChange={() =>
          setRejectionDialog({ ...rejectionDialog, open: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-rose-700">
              Từ chối chứng nhận
            </DialogTitle>
            <DialogDescription className="text-base">
              Vui lòng cho biết lý do từ chối hồ sơ OCOP cho sản phẩm{" "}
              <span className="font-bold text-gray-900">
                "{rejectionDialog.productName}"
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label
              htmlFor="reason"
              className="mb-2 block font-semibold text-gray-700"
            >
              Lý do từ chối
            </Label>
            <Textarea
              id="reason"
              value={rejectionDialog.reason}
              onChange={(e) =>
                setRejectionDialog((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Ví dụ: Hình ảnh chứng chỉ mờ, thông tin không trùng khớp..."
              rows={5}
              className="resize-none focus-visible:ring-rose-500"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() =>
                setRejectionDialog({ ...rejectionDialog, open: false })
              }
            >
              Hủy
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-800"
              onClick={confirmRejectOcop}
              disabled={isProcessing || !rejectionDialog.reason.trim()}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewImagesDialog.open}
        onOpenChange={() =>
          setViewImagesDialog({ ...viewImagesDialog, open: false })
        }
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Hình ảnh chứng chỉ OCOP</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {viewImagesDialog.images.length > 0 ? (
              viewImagesDialog.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm cursor-zoom-in hover:border-green-500 transition-colors"
                  onClick={() => setZoomedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt="Certificate"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 text-center text-gray-400 italic">
                Không có hình ảnh đính kèm.
              </div>
            )}
          </div>
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
