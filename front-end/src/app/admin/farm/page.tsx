"use client";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, FileEdit, Trash2, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { IFarmerResponse, IFarmerStatus } from "@/types/farmer";
import FarmerService from "@/services/farmer.service";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
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
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState<IFarmerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { toast } = useToast();
  const getMessageByApiCode = useMessageByApiCode();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<IFarmerResponse | null>(
    null
  );
  const [actionType, setActionType] = useState<"block" | "unblock" | null>(
    null
  );

  const fetchFarmers = async () => {
    setIsLoading(true);
    setError(null);

    const [data, err] = await FarmerService.getAllFarmers();

    if (err) {
      setError(getMessageByApiCode(err.code));
      toast({
        title: "Lỗi",
        description: getMessageByApiCode(err.code),
        variant: "destructive",
      });
      console.error("Failed to fetch farmers:", err);
    } else {
      setFarmers(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleStatusChange = async () => {
    if (!selectedFarmer || !actionType) return;

    const newStatus = actionType === "block" ? "ADMIN_BLOCK" : "ACTIVE";
    const [data, err] = await FarmerService.changeFarmerStatus(
      selectedFarmer.id,
      {
        status: newStatus,
      }
    );

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
        description: `Đã ${
          actionType === "block" ? "khóa" : "bỏ khóa"
        } nông dân ${data.name}`,
      });
      fetchFarmers(); // Refresh the list
    }
    setIsAlertDialogOpen(false);
    setSelectedFarmer(null);
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

  const columns: ColumnDef<IFarmerResponse>[] = [
    {
      accessorKey: "name",
      header: "Tên nông dân",
      cell: ({ row }) => {
        const farmer = row.original as IFarmerResponse;
        return <div className="font-medium">{farmer.name}</div>;
      },
    },
    {
      accessorKey: "rating",
      header: "Đánh giá",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return <span className="font-medium">⭐ {rating}</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <p className="text-sm text-gray-600 max-w-xs line-clamp-1">
            {description || "N/A"}
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as IFarmerStatus;
        return getStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const farmer = row.original as IFarmerResponse;
        const isBlocked = farmer.status === "ADMIN_BLOCK";
        return (
          <div className="flex space-x-2">
            <Link href={`/admin/farm/${farmer.id}`}>
              <Button variant="ghost" size="icon" title="Xem chi tiết">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={isBlocked ? "text-green-500" : "text-orange-500"}
              title={isBlocked ? "Bỏ khóa" : "Khóa"}
              onClick={() => {
                setSelectedFarmer(farmer);
                setActionType(isBlocked ? "unblock" : "block");
                setIsAlertDialogOpen(true);
              }}
            >
              <Ban className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              title="Xóa"
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
            Quản lý nông dân
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và hoạt động của các nông dân
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng nông dân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredFarmers.length}</div>
            <p className="text-xs text-muted-foreground">Đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredFarmers.filter((f) => f.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">Nông dân hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tự khóa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredFarmers.filter((f) => f.status === "SELF_BLOCK").length}
            </div>
            <p className="text-xs text-muted-foreground">Tạm dừng hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bị khóa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredFarmers.filter((f) => f.status === "ADMIN_BLOCK").length}
            </div>
            <p className="text-xs text-muted-foreground">Vi phạm chính sách</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nông dân</CardTitle>
          <CardDescription>
            Quản lý tất cả nông dân trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-red-500">Lỗi: {error}</div>
          ) : (
            <DataTable columns={columns} data={filteredFarmers} />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "block" ? "Khóa nông dân" : "Bỏ khóa nông dân"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn{" "}
              {actionType === "block" ? "khóa" : "bỏ khóa"} nông dân{" "}
              <span className="font-bold">{selectedFarmer?.name}</span> không?
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
