"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Edit, Plus, Trash } from "lucide-react";

import AddressService from "@/services/address.service";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { IAddressRequest, IAddressResponse } from "@/types/address";

const addressFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số.",
  }),
  provinceCode: z.string().min(1, {
    message: "Vui lòng chọn tỉnh/thành phố.",
  }),
  wardCode: z.string().min(1, {
    message: "Vui lòng chọn phường/xã.",
  }),
  detail: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự.",
  }),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AddressPage() {
  const [addresses, setAddresses] = useState<IAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [editingAddress, setEditingAddress] = useState<IAddressResponse | null>(
    null
  );

  // Address data state
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [availableProvinces, setAvailableProvinces] = useState<
    Array<{ code: string; name_with_type: string }>
  >([]);
  const [availableWards, setAvailableWards] = useState<
    Array<{ code: string; name_with_type: string }>
  >([]);

  // Load addresses from API
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoadingList(true);
      const [result, error] = await AddressService.getAll();
      if (error) {
        console.error("Error loading addresses:", error);
        toast.error("Không thể tải danh sách địa chỉ");
      } else {
        setAddresses(result || []);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách địa chỉ");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Load provinces and wards when component mounts
  useEffect(() => {
    setAvailableProvinces(
      AddressService.getProvinces().sort((a: any, b: any) =>
        a.name_with_type.localeCompare(b.name_with_type, "vi", {
          numeric: true,
        })
      )
    );
  }, []);

  // Update wards when province changes
  useEffect(() => {
    if (selectedProvince) {
      setAvailableWards(
        AddressService.getWardsByProvinceCode(selectedProvince).sort(
          (a: any, b: any) =>
            a.name_with_type.localeCompare(b.name_with_type, "vi", {
              numeric: true,
            })
        )
      );
    } else {
      setAvailableWards([]);
    }
  }, [selectedProvince]);

  // Handle edit address data loading
  useEffect(() => {
    if (editingAddress && isEditDialogOpen) {
      // Reset wards first
      //setAvailableWards([]);

      // Set province first
      setSelectedProvince(editingAddress.province);
    }
  }, [editingAddress, isEditDialogOpen]);

  // Set ward after province is set and wards are loaded
  useEffect(() => {
    if (
      editingAddress &&
      isEditDialogOpen &&
      selectedProvince === editingAddress.province &&
      availableWards.length > 0
    ) {
      setSelectedWard(editingAddress.ward);
    }
  }, [editingAddress, selectedProvince, availableWards, isEditDialogOpen]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      provinceCode: "",
      wardCode: "",
      detail: "",
      isDefault: false,
    },
    mode: "onChange",
  });

  async function onSubmit(data: AddressFormValues) {
    setIsLoading(true);

    try {
      // Prepare data for API
      const addressRequest = {
        receiverName: data.fullName,
        receiverPhone: data.phone,
        province: data.provinceCode,
        ward: data.wardCode,
        detail: data.detail,
        isDefault: data.isDefault,
      };

      if (editingAddressId) {
        // Update existing address
        const [result, error] = await AddressService.update(
          editingAddressId,
          addressRequest
        );
        if (error) {
          console.error("Error updating address:", error);
          toast.error("Không thể cập nhật địa chỉ");
        } else {
          toast.success("Địa chỉ đã được cập nhật");
          setEditingAddressId(null);
          setEditingAddress(null);
          setIsEditDialogOpen(false);
          await loadAddresses(); // Reload addresses
        }
      } else {
        // Add new address
        const [result, error] = await AddressService.create(addressRequest);
        if (error) {
          console.error("Error creating address:", error);
          toast.error("Không thể thêm địa chỉ mới");
        } else {
          toast.success("Địa chỉ đã được thêm mới");
          setIsAddDialogOpen(false);
          await loadAddresses(); // Reload addresses
        }
      }

      form.reset();
      setSelectedProvince("");
      setSelectedWard("");
    } catch (error) {
      console.error("Error submitting address:", error);
      toast.error("Có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(address: IAddressResponse) {
    form.reset({
      fullName: address.receiverName,
      phone: address.receiverPhone,
      provinceCode: address.province,
      wardCode: address.ward,
      detail: address.detail,
      isDefault: address.isDefault,
    });

    // Set the editing address to trigger the useEffect
    setEditingAddress(address);
    setEditingAddressId(address.id);
    setIsEditDialogOpen(true);
  }

  // Handle province change
  function handleProvinceChange(provinceCode: string) {
    setSelectedProvince(provinceCode);
    form.setValue("provinceCode", provinceCode);
    form.setValue("wardCode", "");
  }

  // Handle ward change
  function handleWardChange(wardCode: string) {
    setSelectedWard(wardCode);
    form.setValue("wardCode", wardCode);
  }

  // Helper functions to get names from codes for display
  function getProvinceNameFromCode(code: string) {
    const province = AddressService.getProvinces().find(
      (p: any) => p.code === code
    ) as any;
    return province?.name_with_type || code;
  }

  function getWardNameFromCode(wardCode: string, provinceCode: string): string {
    const ward = AddressService.getWardsByProvinceCode(provinceCode).find(
      (w: any) => w.code === wardCode
    ) as any;
    return ward?.name_with_type || wardCode;
  }

  async function handleDelete(id: string) {
    try {
      const [result, error] = await AddressService.delete(id);
      if (error) {
        console.error("Error deleting address:", error);
        toast.error("Không thể xóa địa chỉ");
      } else {
        toast.success("Địa chỉ đã được xóa");
        await loadAddresses(); // Reload addresses
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Có lỗi xảy ra khi xóa địa chỉ");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const [result, error] = await AddressService.setAsDefault(id);
      if (error) {
        console.error("Error setting default address:", error);
        toast.error("Không thể đặt địa chỉ mặc định");
      } else {
        toast.success("Đã đặt làm địa chỉ mặc định");
        await loadAddresses(); // Reload addresses
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Có lỗi xảy ra khi đặt địa chỉ mặc định");
    }
  }

  // Reset form and state when dialogs close
  function resetFormState() {
    form.reset({
      fullName: "",
      phone: "",
      provinceCode: "",
      wardCode: "",
      detail: "",
      isDefault: false,
    });
    setSelectedProvince("");
    setSelectedWard("");
    setEditingAddressId(null);
    setEditingAddress(null);
  }

  // Handle opening add dialog with clean state
  function handleOpenAddDialog() {
    resetFormState();
    setIsAddDialogOpen(true);
  }

  // Handle dialog close
  function handleAddDialogClose(open: boolean) {
    setIsAddDialogOpen(open);
    if (!open) {
      resetFormState();
    }
  }

  function handleEditDialogClose(open: boolean) {
    setIsEditDialogOpen(open);
    if (!open) {
      resetFormState();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Địa chỉ của tôi</h2>
        </div>

        {/* Add Address Modal */}
        <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogClose}>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin địa chỉ giao hàng của bạn.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="provinceCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <Select
                          onValueChange={handleProvinceChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {availableProvinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name_with_type}
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
                    name="wardCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phường/Xã</FormLabel>
                        <Select
                          onValueChange={handleWardChange}
                          value={field.value}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedProvince
                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                    : "Chọn phường/xã"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {availableWards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code}>
                                {ward.name_with_type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ cụ thể</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, tên đường..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang lưu..." : "Lưu địa chỉ"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Address Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin địa chỉ giao hàng của bạn.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="provinceCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <Select
                          onValueChange={handleProvinceChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {availableProvinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name_with_type}
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
                    name="wardCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phường/Xã</FormLabel>
                        <Select
                          onValueChange={handleWardChange}
                          value={field.value}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedProvince
                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                    : "Chọn phường/xã"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {availableWards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code}>
                                {ward.name_with_type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ cụ thể</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, tên đường..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={addresses.length === 1}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                        {addresses.length === 1 && (
                          <p className="text-xs text-muted-foreground">
                            Địa chỉ duy nhất phải là mặc định
                          </p>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật địa chỉ"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoadingList ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">
                Đang tải danh sách địa chỉ...
              </p>
            </CardContent>
          </Card>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">
                Bạn chưa có địa chỉ nào. Nhấn nút "Thêm địa chỉ mới" phía trên
                để tạo địa chỉ đầu tiên.
              </p>
            </CardContent>
          </Card>
        ) : (
          addresses
            .sort((a, b) => {
              // Sort by default address first (true comes before false)
              if (a.isDefault && !b.isDefault) return -1;
              if (!a.isDefault && b.isDefault) return 1;
              return 0;
            })
            .map((address) => (
              <Card key={address.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      {address.receiverName}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(address)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      {!address.isDefault && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa địa chỉ</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa địa chỉ này không?
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(address.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                  <CardDescription>{address.receiverName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {address.detail},
                    {getWardNameFromCode(address.ward, address.province)},
                    {getProvinceNameFromCode(address.province)}
                  </p>
                </CardContent>
                {!address.isDefault && (
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Đặt làm địa chỉ mặc định
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
