"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  IMarkerPriceResponse,
  IMarketPriceCreationRequest,
  IMarketPricPatchUpdateRequest,
} from "@/types/market-price";
import { IProductNameResponse } from "@/types/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MarketPriceFormValues,
  marketPriceSchema,
} from "@/validations/marketPriceSchema";
import MarketPriceService from "@/services/marketPrice.service";
import ProductService from "@/services/product.service";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const REGIONS = [
  {
    name: "Đồng bằng sông Cửu Long",
    value: "dong-bang-song-cuu-long",
  },
  {
    name: "Đông Nam Bộ",
    value: "dong-nam-bo",
  },
  {
    name: "Tây Nguyên",
    value: "tay-nguyen",
  },
  {
    name: "Đồng bằng sông Hồng",
    value: "dong-bang-song-hong",
  },
];

export default function AdminMarketPricePage() {
  const { toast } = useToast();
  const getMessage = useMessageByApiCode();
  const [marketPrices, setMarketPrices] = useState<IMarkerPriceResponse[]>([]);
  const [products, setProducts] = useState<IProductNameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<IMarkerPriceResponse | null>(
    null
  );
  const [selectedProductFilter, setSelectedProductFilter] =
    useState<string>("all");
  const [selectedRegionFilter, setSelectedRegionFilter] =
    useState<string>("all");

  const form = useForm<MarketPriceFormValues>({
    resolver: zodResolver(marketPriceSchema),
    defaultValues: {
      productId: "",
      price: "0", // Giá trị mặc định là chuỗi
      region: "",
      dateRecorded: new Date().toISOString(), // Thêm lại để đảm bảo giá trị ban đầu khi form được khởi tạo
    },
  });

  useEffect(() => {
    if (isCreateDialogOpen || isEditDialogOpen) {
      form.setValue("dateRecorded", new Date().toISOString());
    }
  }, [isCreateDialogOpen, isEditDialogOpen, form]);

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      const [data, error] = await MarketPriceService.getAllMarketPrices();
      if (data) {
        setMarketPrices(data);
        console.log("Products fetched:", data);
      } else {
        toast({
          title: "Lỗi",
          description:
            error?.message || "Không thể tải danh sách giá thị trường.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách giá thị trường.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const [data, error] = await ProductService.getProductNames();
      if (data) {
        setProducts(data);
      } else {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể tải danh sách sản phẩm.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMarketPrices();
    fetchProducts();
  }, []);

  const filteredPrices = marketPrices
    .filter((price) => {
      const matchProduct =
        selectedProductFilter === "all" ||
        price.product.id === selectedProductFilter;
      const matchRegion =
        selectedRegionFilter === "all" || price.region === selectedRegionFilter;
      return matchProduct && matchRegion;
    })
    .sort(
      (a, b) =>
        new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime()
    );

  const handleCreate = async (values: MarketPriceFormValues) => {
    setLoading(true);
    try {
      const createRequest: IMarketPriceCreationRequest = {
        productId: values.productId,
        price: parseInt(values.price), // Parse chuỗi thành số nguyên
        region: values.region,
        dateRecorded: values.dateRecorded,
      };
      const [data, error] = await MarketPriceService.createMarketPrice(
        createRequest
      );

      if (error) {
        toast({
          title: "Lỗi",
          description:
            error?.message || "Đã xảy ra lỗi khi thêm giá thị trường.",
          variant: "error",
        });
        return;
      }
      toast({
        title: "Thành công",
        description: "Thêm giá thị trường thành công.",
      });
      fetchMarketPrices(); // Refresh data
      form.reset();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi thêm giá thị trường.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: MarketPriceFormValues) => {
    if (!editingPrice) return;

    setLoading(true);
    try {
      const updateRequest: IMarketPricPatchUpdateRequest = {
        price: parseInt(values.price), // Parse chuỗi thành số nguyên
        region: values.region,
        dateRecorded: values.dateRecorded,
      };
      const [data, error] = await MarketPriceService.updateMarketPrice(
        editingPrice.id,
        updateRequest
      );

      if (error) {
        toast({
          title: "Lỗi",
          description:
            error?.message || "Đã xảy ra lỗi khi cập nhật giá thị trường.",
          variant: "error",
        });
        return;
      }
      toast({
        title: "Thành công",
        description: "Cập nhật giá thị trường thành công.",
      });
      fetchMarketPrices(); // Refresh data
      form.reset();
      setIsEditDialogOpen(false);
      setEditingPrice(null);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật giá thị trường.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const [data, error] = await MarketPriceService.deleteMarketPrice(id);
      if (error) {
        toast({
          title: "Lỗi",
          description:
            error?.message || "Đã xảy ra lỗi khi xóa giá thị trường.",
          variant: "error",
        });
        return;
      }
      toast({
        title: "Thành công",
        description: "Xóa giá thị trường thành công.",
      });
      fetchMarketPrices(); // Refresh data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa giá thị trường.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (price: IMarkerPriceResponse) => {
    setEditingPrice(price);
    form.reset({
      productId: price.product.id,
      price: price.price.toString(), // Chuyển số thành chuỗi khi reset form
      region: price.region,
      dateRecorded: new Date(price.dateRecorded).toISOString(), // Định dạng ISO 8601 đầy đủ (UTC)
    });
    setIsEditDialogOpen(true);
  };

  const columns: ColumnDef<IMarkerPriceResponse>[] = [
    {
      accessorKey: "product.name",
      header: "Sản phẩm",
      cell: ({ row }) => {
        const price = row.original as IMarkerPriceResponse;
        return (
          <div>
            <p className="font-medium">{price.product.name}</p>
            <p className="text-xs text-gray-500">{price.product.category}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "region",
      header: "Vùng miền",
      cell: ({ row }) => {
        const regionValue: string = row.getValue("region");
        const region = REGIONS.find((r) => r.value === regionValue);
        return (
          <Badge className="bg-gray-100 text-black hover:bg-gray-300 w-44">
            {region ? region.name : regionValue}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Giá hiện tại",
      cell: ({ row }) => {
        const price = row.getValue("price");
        return (
          <span className="font-medium">{price?.toLocaleString()} VNĐ</span>
        );
      },
    },
    {
      accessorKey: "dateRecorded",
      header: "Ngày ghi nhận",
      cell: ({ row }) => {
        const value = row.getValue("dateRecorded");
        if (!value) return "";

        // Parse UTC
        const utcDate = new Date(value as string);
        if (isNaN(utcDate.getTime())) return "";

        // Cộng 7 giờ (VN = UTC+7)
        const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

        const year = vnDate.getFullYear();
        const month = String(vnDate.getMonth() + 1).padStart(2, "0");
        const day = String(vnDate.getDate()).padStart(2, "0");
        const hours = String(vnDate.getHours()).padStart(2, "0");
        const minutes = String(vnDate.getMinutes()).padStart(2, "0");
        const seconds = String(vnDate.getSeconds()).padStart(2, "0");

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const price = row.original as IMarkerPriceResponse;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(price)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa giá thị trường này? Hành động này
                    không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(price.id)}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
            Quản lý giá thị trường
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý giá nông sản theo vùng miền
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm giá
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm giá thị trường mới</DialogTitle>
              <DialogDescription>
                Ghi nhận giá nông sản mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreate)}
                className="grid gap-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sản phẩm</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-80">
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vùng miền</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vùng miền" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REGIONS.map((region, index) => (
                            <SelectItem key={index} value={region.value}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRecorded"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày ghi nhận</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value &&
                              !isNaN(new Date(field.value).getTime()) ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value &&
                              !isNaN(new Date(field.value).getTime())
                                ? new Date(field.value)
                                : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange("");
                                return;
                              }

                              const now = new Date();

                              const localDateTime = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                now.getHours(),
                                now.getMinutes(),
                                now.getSeconds(),
                                0
                              );

                              const yyyy = localDateTime.getFullYear();
                              const MM = String(
                                localDateTime.getMonth() + 1
                              ).padStart(2, "0");
                              const dd = String(
                                localDateTime.getDate()
                              ).padStart(2, "0");
                              const HH = String(
                                localDateTime.getHours()
                              ).padStart(2, "0");
                              const mm = String(
                                localDateTime.getMinutes()
                              ).padStart(2, "0");
                              const ss = String(
                                localDateTime.getSeconds()
                              ).padStart(2, "0");

                              field.onChange(
                                `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Đang thêm..." : "Thêm giá"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng ghi nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketPrices.length}</div>
            <p className="text-xs text-muted-foreground">
              Giá thị trường đã ghi nhận
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sản phẩm theo dõi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(marketPrices.map((p) => p.product.id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Loại sản phẩm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vùng miền
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(marketPrices.map((p) => p.region)).size}
            </div>
            <p className="text-xs text-muted-foreground">Vùng đang theo dõi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách giá thị trường</CardTitle>
              <CardDescription>
                Quản lý tất cả ghi nhận giá nông sản
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedProductFilter}
                onValueChange={setSelectedProductFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedRegionFilter}
                onValueChange={setSelectedRegionFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo vùng miền" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vùng miền</SelectItem>
                  {REGIONS.map((region, index) => (
                    <SelectItem key={index} value={region.value}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredPrices} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giá thị trường</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin giá nông sản
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEdit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sản phẩm</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={true} // Disable product selection on update
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-80">
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vùng miền</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vùng miền" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REGIONS.map((region, index) => (
                          <SelectItem key={index} value={region.value}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRecorded"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày ghi nhận</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value &&
                            !isNaN(new Date(field.value).getTime()) ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value &&
                            !isNaN(new Date(field.value).getTime())
                              ? new Date(field.value)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const utcDate = new Date(
                                Date.UTC(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate()
                                )
                              );
                              field.onChange(utcDate.toISOString());
                            } else {
                              field.onChange("");
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
