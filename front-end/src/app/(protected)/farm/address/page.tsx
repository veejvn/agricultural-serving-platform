"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Edit, Plus, Trash, MapPin } from "lucide-react";

// Import address data
import addressData from "@/json/address.json";
import FarmerService from "@/services/farmer.service"; // Using FarmerService

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
  districtCode: z.string().min(1, {
    message: "Vui lòng chọn quận/huyện.",
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const [availableWards, setAvailableWards] = useState<
    Array<{ code: string; name: string }>
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

  // Get provinces from address data and sort alphabetically
  const provinces = Object.values(addressData)
    .map((province: any) => ({
      code: province.code,
      name: province.name_with_type,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi", { numeric: true }));

  // Update districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const provinceData = Object.values(addressData).find(
        (p: any) => p.code === selectedProvince
      ) as any;
      if (provinceData?.district) {
        const districts = Object.values(provinceData.district)
          .map((district: any) => ({
            code: district.code,
            name: district.name_with_type,
          }))
          .sort((a, b) =>
            a.name.localeCompare(b.name, "vi", { numeric: true })
          );
        setAvailableDistricts(districts);
      } else {
        setAvailableDistricts([]);
      }
      setSelectedDistrict("");
      setAvailableWards([]);
    } else {
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
  }, [selectedProvince]);

  // Update wards when district changes
  useEffect(() => {
    if (selectedProvince && selectedDistrict) {
      const provinceData = Object.values(addressData).find(
        (p: any) => p.code === selectedProvince
      ) as any;
      const districtData =
        provinceData?.district &&
        (Object.values(provinceData.district).find(
          (d: any) => d.code === selectedDistrict
        ) as any);
      if (districtData?.ward) {
        const wards = Object.values(districtData.ward)
          .map((ward: any) => ({
            code: ward.code,
            name: ward.name_with_type,
          }))
          .sort((a, b) =>
            a.name.localeCompare(b.name, "vi", { numeric: true })
          );
        setAvailableWards(wards);
      } else {
        setAvailableWards([]);
      }
    } else {
      setAvailableWards([]);
    }
  }, [selectedProvince, selectedDistrict]);

  // Handle edit address data loading
  useEffect(() => {
    if (farmer?.address && isEditDialogOpen) {
      // Reset wards first
      setAvailableWards([]);

      // Set province first
      setSelectedProvince(farmer.address.province);
    }
  }, [farmer, isEditDialogOpen]);

  // Set district after province is set
  useEffect(() => {
    if (
      farmer?.address &&
      isEditDialogOpen &&
      selectedProvince === farmer.address.province
    ) {
      setSelectedDistrict(farmer.address.district);
    }
  }, [farmer, selectedProvince, isEditDialogOpen]);

  // Set ward after district is set and wards are loaded
  useEffect(() => {
    if (
      farmer?.address &&
      isEditDialogOpen &&
      selectedProvince === farmer.address.province &&
      selectedDistrict === farmer.address.district &&
      availableWards.length > 0
    ) {
      setSelectedWard(farmer.address.ward);
    }
  }, [
    farmer,
    selectedProvince,
    selectedDistrict,
    availableWards,
    isEditDialogOpen,
  ]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      provinceCode: "",
      districtCode: "",
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
        district: data.districtCode,
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
        const [result, error] = await FarmerService.createAddress(addressRequest);
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
      setSelectedDistrict("");
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
        districtCode: farmer.address.district,
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
    form.setValue("districtCode", "");
    form.setValue("wardCode", "");
  }

  // Handle district change
  function handleDistrictChange(districtCode: string) {
    setSelectedDistrict(districtCode);
    form.setValue("districtCode", districtCode);
    form.setValue("wardCode", "");
  }

  // Handle ward change
  function handleWardChange(wardCode: string) {
    setSelectedWard(wardCode);
    form.setValue("wardCode", wardCode);
  }

  // Helper functions to get names from codes for display
  function getProvinceNameFromCode(code: string): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === code
    ) as any;
    return province?.name_with_type || code;
  }

  function getDistrictNameFromCode(
    provinceCode: string,
    districtCode: string
  ): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === provinceCode
    ) as any;
    const district =
      province?.district &&
      (Object.values(province.district).find(
        (d: any) => d.code === districtCode
      ) as any);
    return district?.name_with_type || districtCode;
  }

  function getWardNameFromCode(
    provinceCode: string,
    districtCode: string,
    wardCode: string
  ): string {
    const province = Object.values(addressData).find(
      (p: any) => p.code === provinceCode
    ) as any;
    const district =
      province?.district &&
      (Object.values(province.district).find(
        (d: any) => d.code === districtCode
      ) as any);
    const ward =
      district?.ward &&
      (Object.values(district.ward).find(
        (w: any) => w.code === wardCode
      ) as any);
    return ward?.name_with_type || wardCode;
  }

  async function handleDelete() {
    if (!farmer?.address?.id) return;
    try {
      const [result, error] = await FarmerService.deleteAddress(farmer.address.id);
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
      districtCode: "",
      wardCode: "",
      detail: "",
    });
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAvailableDistricts([]);
    setAvailableWards([]);
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
                            <SelectContent className="max-h-70">
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={province.code}
                                >
                                  {province.name}
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
                      name="districtCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quận/Huyện</FormLabel>
                          <Select
                            onValueChange={handleDistrictChange}
                            value={field.value}
                            disabled={!selectedProvince}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedProvince
                                      ? "Vui lòng chọn tỉnh/thành phố trước"
                                      : "Chọn quận/huyện"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-70">
                              {availableDistricts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.code}
                                >
                                  {district.name}
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
                            disabled={!selectedDistrict}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedProvince
                                      ? "Vui lòng chọn tỉnh/thành phố trước"
                                      : !selectedDistrict
                                      ? "Vui lòng chọn quận/huyện trước"
                                      : "Chọn phường/xã"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-70">
                              {availableWards.map((ward) => (
                                <SelectItem key={ward.code} value={ward.code}>
                                  {ward.name}
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
                          <SelectContent className="max-h-70">
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name}
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
                    name="districtCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quận/Huyện</FormLabel>
                        <Select
                          onValueChange={handleDistrictChange}
                          value={field.value}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedProvince
                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                    : "Chọn quận/huyện"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-70">
                            {availableDistricts.map((district) => (
                              <SelectItem
                                key={district.code}
                                value={district.code}
                              >
                                {district.name}
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
                          disabled={!selectedDistrict}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedProvince
                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                    : !selectedDistrict
                                    ? "Vui lòng chọn quận/huyện trước"
                                    : "Chọn phường/xã"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-70">
                            {availableWards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code}>
                                {ward.name}
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
                  <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                    Mặc định
                  </span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                  >
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
                          Bạn có chắc chắn muốn xóa địa chỉ này không?
                          Hành động này không thể hoàn tác.
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
              <CardDescription>{farmer.address.receiverPhone}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {farmer.address.detail},{" "}
                {getWardNameFromCode(
                  farmer.address.province,
                  farmer.address.district,
                  farmer.address.ward
                )}
                ,{" "}
                {getDistrictNameFromCode(
                  farmer.address.province,
                  farmer.address.district
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
