"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Edit, Plus, Trash, MapPin } from "lucide-react";

import AddressService from "@/services/address.service";
import FarmerService from "@/services/farmer.service";

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
import { IAddressRequest } from "@/types/address";
import { IFarmerResponse } from "@/types/farmer";

const addressFormSchema = z.object({
  receiverName: z.string().min(2, {
    message: "Tên người nhận phải có ít nhất 2 ký tự.",
  }),
  receiverPhone: z.string().min(10, {
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
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function FarmerAddressPage() {
  const [farmer, setFarmer] = useState<IFarmerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Address data state
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [availableProvinces, setAvailableProvinces] = useState<
    Array<{ code: string; name_with_type: string }>
  >([]);
  const [availableWards, setAvailableWards] = useState<
    Array<{ code: string; name_with_type: string }>
  >([]);

  // Load farmer and its address from API
  useEffect(() => {
    loadFarmerAddress();
  }, []);

  const loadFarmerAddress = async () => {
    try {
      setIsLoadingList(true);
      const [result, error] = await FarmerService.getFarmerByOwner();
      if (error) {
        console.error("Error loading farmer address:", error);
        toast.error("Không thể tải địa chỉ trang trại");
        setFarmer(null);
      } else {
        setFarmer(result || null);
      }
    } catch (error) {
      console.error("Error loading farmer address:", error);
      toast.error("Có lỗi xảy ra khi tải địa chỉ trang trại");
      setFarmer(null);
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
            a.name_with_type.localeCompare(b.name_with_type, "vi", { numeric: true })
        )
      );
    } else {
      setAvailableWards([]);
    }
  }, [selectedProvince]);

  // Handle edit address data loading
  useEffect(() => {
    if (farmer?.address && isEditDialogOpen) {
      // Reset wards first
      //setAvailableWards([]);

      // Set province first
      setSelectedProvince(farmer.address.province);
    }
  }, [farmer, isEditDialogOpen]);

  // Set ward after province is set and wards are loaded
  useEffect(() => {
    if (
      farmer?.address &&
      isEditDialogOpen &&
      selectedProvince === farmer.address.province &&
      availableWards.length > 0
    ) {
      setSelectedWard(farmer.address.ward);
    }
  }, [farmer, selectedProvince, availableWards, isEditDialogOpen]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      provinceCode: "",
      wardCode: "",
      detail: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: AddressFormValues) {
    setIsLoading(true);

    try {
      // Prepare data for API
      const addressRequest: IAddressRequest = {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        province: data.provinceCode,
        ward: data.wardCode,
        detail: data.detail,
        isDefault: true, // Farmer's address is always default
      };

      if (farmer?.address?.id) {
        // Update existing address
        const [result, error] = await FarmerService.updateAddress(
          farmer.address.id,
          addressRequest
        );
        if (error) {
          console.error("Error updating farmer address:", error);
          toast.error("Không thể cập nhật địa chỉ trang trại");
        } else {
          toast.success("Địa chỉ trang trại đã được cập nhật");
          setIsEditDialogOpen(false);
          await loadFarmerAddress(); // Reload farmer address
        }
      } else {
        // Add new address
        const [result, error] = await FarmerService.createAddress(
          addressRequest
        );
        if (error) {
          console.error("Error creating farmer address:", error);
          toast.error("Không thể thêm địa chỉ trang trại mới");
        } else {
          toast.success("Địa chỉ trang trại đã được thêm mới");
          setIsAddDialogOpen(false);
          await loadFarmerAddress(); // Reload farmer address
        }
      }

      form.reset();
      setSelectedProvince("");
      setSelectedWard("");
    } catch (error) {
      console.error("Error submitting farmer address:", error);
      toast.error("Có lỗi xảy ra khi lưu địa chỉ trang trại");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit() {
    if (farmer?.address) {
      form.reset({
        receiverName: farmer.address.receiverName,
        receiverPhone: farmer.address.receiverPhone,
        provinceCode: farmer.address.province,
        wardCode: farmer.address.ward,
        detail: farmer.address.detail,
      });

      // Set the editing address to trigger the useEffect
      setSelectedProvince(farmer.address.province);
      setIsEditDialogOpen(true);
    }
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
  function getProvinceNameFromCode(code: string): string {
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

  async function handleDelete() {
    if (!farmer?.address?.id) return;
    try {
      const [result, error] = await FarmerService.deleteAddress(
        farmer.address.id
      );
      if (error) {
        console.error("Error deleting farmer address:", error);
        toast.error("Không thể xóa địa chỉ trang trại");
      } else {
        toast.success("Địa chỉ trang trại đã được xóa");
        await loadFarmerAddress(); // Reload farmer address
      }
    } catch (error) {
      console.error("Error deleting farmer address:", error);
      toast.error("Có lỗi xảy ra khi xóa địa chỉ trang trại");
    }
  }

  // Reset form and state when dialogs close
  function resetFormState() {
    form.reset({
      receiverName: "",
      receiverPhone: "",
      provinceCode: "",
      wardCode: "",
      detail: "",
    });
    setSelectedProvince("");
    setSelectedWard("");
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
          <h2 className="text-2xl font-semibold">Địa chỉ trang trại</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý địa chỉ cho trang trại của bạn
          </p>
        </div>

        {/* Add Address Modal */}
        {!farmer?.address && (
          <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogClose}>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm địa chỉ trang trại mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin địa chỉ trang trại của bạn.
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
                      name="receiverName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên người nhận</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="receiverPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại người nhận</FormLabel>
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
                          <Input
                            placeholder="Số nhà, tên đường..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
        )}

        {/* Edit Address Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa địa chỉ trang trại</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin địa chỉ trang trại của bạn.
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
                    name="receiverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người nhận</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiverPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại người nhận</FormLabel>
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
                Đang tải địa chỉ trang trại...
              </p>
            </CardContent>
          </Card>
        ) : farmer?.address ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {farmer.address.receiverName}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Chỉnh sửa</span>
                  </Button>
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
                          Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động
                          này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardDescription>{farmer.address.receiverName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {farmer.address.detail},{" "}
                {getWardNameFromCode(
                  farmer.address.ward,
                  farmer.address.province
                )}
                , {getProvinceNameFromCode(farmer.address.province)}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">
                Bạn chưa có địa chỉ trang trại nào. Nhấn nút "Thêm địa chỉ mới"
                phía trên để tạo địa chỉ đầu tiên.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
