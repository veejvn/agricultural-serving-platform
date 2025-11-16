"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IProductAdminResponse, ProductStatus } from "@/types/product";
import ProductService from "@/services/product.service";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowUpDown, Eye, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/loading-spinner";

const STATUS : Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  PENDING: "Đang chờ duyệt",
  REJECTED: "Bị từ chối",
  BLOCKED: "Bị chặn",
  DELETED: "Đã xóa",
};

const ProductListPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<IProductAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">(
    "ALL"
  );
  const [selectedProduct, setSelectedProduct] =
    useState<IProductAdminResponse | null>(null);
  const [newStatus, setNewStatus] = useState<ProductStatus | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Thêm state để quản lý việc mở/đóng dialog

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [result, err] = await ProductService.getAllByAdmin();
        if (result) {
          setProducts(result);
        } else {
          setError(err?.message || "Failed to fetch products.");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleStatusChange = async () => {
    if (!selectedProduct || !newStatus) return;

    try {
      const [result, err] = await ProductService.adminChangeStatus({
        id: selectedProduct.id,
        status: newStatus,
      });

      if (result) {
        toast({
          title: "Thành công",
          description: `Trạng thái sản phẩm đã được thay đổi thành ${newStatus}.`,
        });
        // Update the product list
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === selectedProduct.id ? { ...p, status: newStatus } : p
          )
        );
      } else {
        toast({
          title: "Lỗi",
          description: err?.message || "Không thể thay đổi trạng thái sản phẩm.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err?.message || "Không thể thay đổi trạng thái sản phẩm.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSelectedProduct(null);
      setNewStatus("");
      setIsDialogOpen(false); // Đóng dialog sau khi xử lý
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setNewStatus("");
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Global filter (search by name, description, farmer name, category name)
    if (globalFilter) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(globalFilter.toLowerCase()) ||
          product.farmer.name
            .toLowerCase()
            .includes(globalFilter.toLowerCase()) ||
          product.category.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    return filtered;
  }, [products, globalFilter, statusFilter]);

  const columns: ColumnDef<IProductAdminResponse>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/product/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          {row.getValue("name")}
        </Link>
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
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.price.toLocaleString()} {row.original.unitPrice}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          className={`
            ${row.original.status === "ACTIVE" && "bg-green-500"}
            ${row.original.status === "PENDING" && "bg-yellow-500"}
            ${row.original.status === "REJECTED" && "bg-red-500"}
            ${row.original.status === "BLOCKED" && "bg-gray-500"}
            ${row.original.status === "DELETED" && "bg-purple-500"}
          `}
        >
          {STATUS[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy"),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/product/${row.original.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedProduct(row.original);
              setNewStatus(row.original.status); // Đặt trạng thái hiện tại làm mặc định
              setIsDialogOpen(true); // Mở dialog
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value: ProductStatus | "ALL") => setStatusFilter(value)}
          value={statusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">ĐANG HOẠT ĐỘNG</SelectItem>
            <SelectItem value="PENDING">ĐANG CHỜ DUYỆT</SelectItem>
            <SelectItem value="REJECTED">BỊ TỪ CHỐI</SelectItem>
            <SelectItem value="BLOCKED">BỊ CHẶN</SelectItem>
            <SelectItem value="DELETED">ĐÃ XÓA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
        </Button>
      </div>

      {/* AlertDialog được di chuyển ra ngoài */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thay đổi trạng thái sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái của sản phẩm "
              {selectedProduct?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select
                onValueChange={(value: ProductStatus) => setNewStatus(value)}
                value={newStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.status === "PENDING" && (
                    <>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="REJECTED">Từ chối</SelectItem>
                    </>
                  )}
                  {selectedProduct?.status === "ACTIVE" && (
                    <SelectItem value="BLOCKED">Chặn</SelectItem>
                  )}
                  {selectedProduct?.status === "BLOCKED" && (
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDialogClose}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Thay đổi trạng thái
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductListPage;
