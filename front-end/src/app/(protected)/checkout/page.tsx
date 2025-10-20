"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Truck,
  Plus,
  Edit2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { IAddressResponse, IAddressRequest } from "@/types/address";
import AddressService from "@/services/address.service";
import addressData from "@/json/address.json";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/common/format";
import OrderService from "@/services/order.service";
import { IOrderRequest, IOrderResponse, IPaymentMethod } from "@/types/order";
import { useRouter } from "next/navigation";
import {
  useOrderStore,
  convertOrderRequestToPending,
} from "@/stores/useOrderStore";
import { useOrder } from "@/hooks/useOrder";

// Define types for address data structure
interface Ward {
  name: string;
  code: string;
  type: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  parent_code: string;
}

interface District {
  name: string;
  code: string;
  type: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  parent_code: string;
  wards: Ward[];
}

interface Province {
  name: string;
  code: string;
  type: string;
  name_with_type: string;
  slug: string;
  districts: District[];
}

// Convert addressData object to array
const addressArray = Object.values(addressData as Record<string, any>).map(
  (province: any) => ({
    name: province.name,
    code: province.code,
    type: province.type,
    name_with_type: province.name_with_type,
    slug: province.slug,
    districts: Object.values(province.district || {}).map((district: any) => ({
      name: district.name,
      code: district.code,
      type: district.type,
      name_with_type: district.name_with_type,
      path: district.path,
      path_with_type: district.path_with_type,
      parent_code: district.parent_code,
      wards: Object.values(district.ward || {}).map((ward: any) => ({
        name: ward.name,
        code: ward.code,
        type: ward.type,
        name_with_type: ward.name_with_type,
        path: ward.path,
        path_with_type: ward.path_with_type,
        parent_code: ward.parent_code,
      })),
    })),
  })
) as Province[];

const addressSchema = z.object({
  receiverName: z.string().min(1, "Họ tên không được để trống"),
  receiverPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
  provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  districtCode: z.string().min(1, "Vui lòng chọn quận/huyện"),
  wardCode: z.string().min(1, "Vui lòng chọn phường/xã"),
  detail: z.string().min(1, "Địa chỉ chi tiết không được để trống"),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<IAddressResponse[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [orderNote, setOrderNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>("COD");
  const [isCreatingOrders, setIsCreatingOrders] = useState(false);

  // Address selection states
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const [availableWards, setAvailableWards] = useState<
    Array<{ code: string; name: string }>
  >([]);

  // Use order store
  const { setLastCreatedOrders } = useOrder();

  // Use real cart data
  const {
    items: cartItems,
    isLoading: isLoadingCart,
    totalPrice,
    fetchCartItems,
    clearCart,
  } = useCart();

  // Filter out invalid items
  const validCartItems = cartItems.filter((item) => {
    const isValid = item && item.id && item.product && item.product.id;
    return isValid;
  });

  // Group cart items by farmer
  const groupedByFarmer = validCartItems.reduce((groups, item) => {
    const farmerId = item.product?.farmer?.id;
    const farmerName = item.product?.farmer?.name || "Không xác định";

    if (!farmerId) return groups;

    if (!groups[farmerId]) {
      groups[farmerId] = {
        farmer: item.product.farmer,
        items: [],
      };
    }

    groups[farmerId].items.push(item);
    return groups;
  }, {} as Record<string, { farmer: any; items: typeof validCartItems }>);

  const farmerGroups = Object.values(groupedByFarmer);

  //console.log("Address data:", addressArray);

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      detail: "",
      isDefault: false,
    },
  });

  const { watch, setValue } = addressForm;
  const watchedProvince = watch("provinceCode");
  const watchedDistrict = watch("districtCode");

  // Load existing addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  // Load cart items
  // useEffect(() => {
  //   fetchCartItems();
  // }, [fetchCartItems]);

  // Update districts when province changes
  useEffect(() => {
    if (watchedProvince) {
      setSelectedProvince(watchedProvince);
      setValue("districtCode", "");
      setValue("wardCode", "");
      setSelectedDistrict("");
      setSelectedWard("");

      const provinceData = Object.values(addressData).find(
        (p: any) => p.code === watchedProvince
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
      setAvailableWards([]);
    } else {
      setSelectedProvince("");
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
  }, [watchedProvince, setValue]);

  // Update wards when district changes
  useEffect(() => {
    if (watchedDistrict) {
      setSelectedDistrict(watchedDistrict);
      setValue("wardCode", "");
      setSelectedWard("");

      if (watchedProvince && watchedDistrict) {
        const provinceData = Object.values(addressData).find(
          (p: any) => p.code === watchedProvince
        ) as any;
        const districtData =
          provinceData?.district &&
          (Object.values(provinceData.district).find(
            (d: any) => d.code === watchedDistrict
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
    } else {
      setSelectedDistrict("");
      setAvailableWards([]);
    }
  }, [watchedProvince, watchedDistrict, setValue]);

  // Sync selectedWard with form field
  useEffect(() => {
    const watchedWard = addressForm.watch("wardCode");
    if (watchedWard) {
      setSelectedWard(watchedWard);
    }
  }, [addressForm]);

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const [result, error] = await AddressService.getAll();
      if (error) {
        toast.error("Không thể tải danh sách địa chỉ");
        return;
      }
      setAddresses(result);

      // Select default address if available
      const defaultAddress = result.find(
        (addr: IAddressResponse) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const onSubmitNewAddress = async (data: AddressFormData) => {
    try {
      setIsAddingAddress(true);
      const addressRequest: IAddressRequest = {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        province: data.provinceCode,
        district: data.districtCode,
        ward: data.wardCode,
        detail: data.detail,
        isDefault: data.isDefault || false,
      };

      const [result, error] = await AddressService.create(addressRequest);
      if (error) {
        toast.error("Không thể thêm địa chỉ mới");
        return;
      }
      const newAddress = result as IAddressResponse;
      //toast.success("Thêm địa chỉ thành công");

      // Reload addresses and select the new one
      await loadAddresses();
      setSelectedAddress(newAddress.id);

      // Reset form and close dialog
      resetFormState();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Không thể thêm địa chỉ mới");
    } finally {
      setIsAddingAddress(false);
    }
  };

  const getProvinces = () => {
    return addressArray
      .map((province: Province) => ({
        code: province.code,
        name: province.name_with_type,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
      );
  };

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

  const getSelectedAddressDetails = () => {
    return addresses.find((addr) => addr.id.toString() === selectedAddress);
  };

  // Handle province change
  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    addressForm.setValue("provinceCode", provinceCode);
    addressForm.setValue("districtCode", "");
    addressForm.setValue("wardCode", "");
  };

  // Handle district change
  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode);
    addressForm.setValue("districtCode", districtCode);
    addressForm.setValue("wardCode", "");
  };

  // Handle ward change
  const handleWardChange = (wardCode: string) => {
    setSelectedWard(wardCode);
    addressForm.setValue("wardCode", wardCode);
  };

  // Reset form and state when dialog closes
  const resetFormState = () => {
    addressForm.reset({
      receiverName: "",
      receiverPhone: "",
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      detail: "",
      isDefault: false,
    });
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setAvailableDistricts([]);
    setAvailableWards([]);
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetFormState();
    }
  };

  // Tạo đơn hàng cho từng farmer
  const handleCreateOrders = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (farmerGroups.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      setIsCreatingOrders(true);

      // Tạo pending orders và lưu vào store trước khi gọi API
      // createPendingOrders(farmerGroups, orderNote, selectedAddress);

      // Tạo mảng các promise để tạo đơn hàng song song
      const orderPromises = farmerGroups.map(async (group) => {
        const orderRequest: IOrderRequest = {
          note: orderNote,
          addressId: selectedAddress,
          farmerId: group.farmer.id,
          paymentMethod: paymentMethod,
          items: group.items.map((item) => ({
            cartItemId: item.id,
          })),
        };
        // console.log(
        //   `Tạo đơn hàng cho ${group.farmer.name} với ${group.items.length} sản phẩm`,
        //   orderRequest
        // );

        const [result, error] = await OrderService.create(orderRequest);
        //console.log(`Tạo đơn hàng cho ${group.farmer.name}:`, result, error);

        if (error) {
          throw new Error(
            `Không thể tạo đơn hàng cho ${group.farmer.name}: ${error}`
          );
        }

        const orderResponse = result as IOrderResponse;

        return {
          farmer: group.farmer,
          order: orderResponse,
          success: true,
        };
      });

      // Chờ tất cả đơn hàng được tạo
      const results = await Promise.allSettled(orderPromises);

      // Lấy danh sách orderResponse thành công
      const fulfilledOrders = results
        .filter((result) => result.status === "fulfilled")
        .map((result: any) => result.value.order);
      const successfulOrders = fulfilledOrders.length;
      const failedOrders = results.filter(
        (result) => result.status === "rejected"
      );

      if (successfulOrders > 0) {
        // Lưu orderResponse thực tế vào store
        setLastCreatedOrders(fulfilledOrders);
        // Clear cart nếu có ít nhất một đơn hàng thành công
        await clearCart();

        if (failedOrders.length === 0) {
          // Tất cả đơn hàng thành công
          toast.success(`Đã tạo thành công ${successfulOrders} đơn hàng!`);
        } else {
          // Một số đơn hàng thành công, một số thất bại
          toast.warning(
            `Đã tạo ${successfulOrders} đơn hàng thành công, ${failedOrders.length} đơn hàng thất bại`
          );
        }

        // Chuyển hướng đến trang đơn hàng
        router.push("/checkout/complete");
      } else {
        // Tất cả đơn hàng thất bại - xóa pending orders
        //createPendingOrders([], "", ""); // Clear by creating empty
        toast.error("Không thể tạo đơn hàng nào. Vui lòng thử lại");

        // Log chi tiết lỗi
        failedOrders.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`Đơn hàng ${index + 1} thất bại:`, result.reason);
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      //createPendingOrders([], "", ""); // Clear by creating empty
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setIsCreatingOrders(false);
    }
  };

  // Tính toán tổng tiền từ cart thật
  const shipping = 0; // Phí vận chuyển
  const total = totalPrice + shipping;

  // Check if cart is loading or empty
  if (isLoadingCart && validCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Đang tải giỏ hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if cart is empty
  if (validCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </p>
          <Button asChild>
            <Link href="/product">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
          Thanh Toán
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Hoàn tất thông tin giao hàng và phương thức thanh toán
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Thông tin giao hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </div>
                  {addresses.length > 0 && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/account/address">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Quản lý
                      </Link>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAddresses ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <span className="text-muted-foreground">
                        Đang tải địa chỉ...
                      </span>
                    </div>
                  </div>
                ) : addresses.length > 0 ? (
                  <>
                    <RadioGroup
                      value={selectedAddress}
                      onValueChange={setSelectedAddress}
                      className="space-y-3"
                    >
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg"
                        >
                          <RadioGroupItem
                            value={address.id}
                            id={`address-${address.id}`}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`address-${address.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {address.receiverName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {address.receiverPhone}
                                </span>
                                {address.isDefault && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {address.detail},{" "}
                                {getWardNameFromCode(
                                  address.province,
                                  address.district,
                                  address.ward
                                )}
                                ,{" "}
                                {getDistrictNameFromCode(
                                  address.province,
                                  address.district
                                )}
                                , {getProvinceNameFromCode(address.province)}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Chưa có địa chỉ giao hàng
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Vui lòng thêm địa chỉ giao hàng để tiếp tục
                    </p>
                  </div>
                )}

                {/* Single Dialog for adding address */}
                {!isLoadingAddresses && (
                  <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                      <Button
                        variant={addresses.length > 0 ? "outline" : "default"}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {addresses.length > 0
                          ? "Thêm địa chỉ mới"
                          : "Thêm địa chỉ đầu tiên"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {addresses.length > 0
                            ? "Thêm địa chỉ mới"
                            : "Thêm địa chỉ giao hàng"}
                        </DialogTitle>
                        <DialogDescription>
                          Điền thông tin địa chỉ giao hàng{" "}
                          {addresses.length > 0 ? "mới" : ""}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addressForm}>
                        <form
                          onSubmit={addressForm.handleSubmit(
                            onSubmitNewAddress
                          )}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={addressForm.control}
                              name="receiverName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Họ tên người nhận</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addressForm.control}
                              name="receiverPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số điện thoại</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={addressForm.control}
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
                                      {getProvinces().map((province) => (
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
                              control={addressForm.control}
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
                              control={addressForm.control}
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
                                        <SelectItem
                                          key={ward.code}
                                          value={ward.code}
                                        >
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
                            control={addressForm.control}
                            name="detail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Địa chỉ chi tiết</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Số nhà, tên đường..."
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={addressForm.control}
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
                                  <FormLabel>
                                    Đặt làm địa chỉ mặc định
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              disabled={isAddingAddress}
                            >
                              Hủy
                            </Button>
                            <Button type="submit" disabled={isAddingAddress}>
                              {isAddingAddress
                                ? "Đang thêm..."
                                : "Thêm địa chỉ"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Phương thức vận chuyển */}
            {/* <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Truck className="h-5 w-5 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Phương thức vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label
                      htmlFor="standard"
                      className="flex flex-1 cursor-pointer justify-between"
                    >
                      <div>
                        <p className="font-medium">Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nhận hàng trong 2-3 ngày
                        </p>
                      </div>
                      <div className="font-medium">{formatPrice(30000)}</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="express" id="express" />
                    <Label
                      htmlFor="express"
                      className="flex flex-1 cursor-pointer justify-between"
                    >
                      <div>
                        <p className="font-medium">Giao hàng nhanh</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nhận hàng trong 24 giờ
                        </p>
                      </div>
                      <div className="font-medium">{formatPrice(60000)}</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card> */}

            {/* Phương thức thanh toán */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl text-green-800 dark:text-green-300">
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as IPaymentMethod)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex flex-1 cursor-pointer items-center gap-4"
                    >
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="COD"
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="font-medium">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="VNPAY" id="bank" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-1 cursor-pointer items-center gap-4"
                    >
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Bank Transfer"
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="font-medium">Thanh toán VNPAY</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thanh toán qua ví điện tử VNPAY
                        </p>
                      </div>
                    </Label>
                  </div>
                  {/* <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label
                      htmlFor="momo"
                      className="flex flex-1 cursor-pointer items-center gap-4"
                    >
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="MoMo"
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="font-medium">Ví MoMo</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thanh toán qua ví điện tử MoMo
                        </p>
                      </div>
                    </Label>
                  </div> */}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Đơn hàng của bạn ({validCartItems.length} sản phẩm từ{" "}
                {farmerGroups.length} người bán)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delivery Address Summary */}
              {selectedAddress && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    Giao đến:
                  </h4>
                  {(() => {
                    const address = getSelectedAddressDetails();
                    return address ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {address.receiverName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {address.receiverPhone}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.detail},{" "}
                          {getWardNameFromCode(
                            address.province,
                            address.district,
                            address.ward
                          )}
                          ,{" "}
                          {getDistrictNameFromCode(
                            address.province,
                            address.district
                          )}
                          , {getProvinceNameFromCode(address.province)}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Danh sách sản phẩm */}
              <div className="max-h-[300px] space-y-4 overflow-auto pr-2">
                {farmerGroups.map((group, groupIndex) => (
                  <div key={group.farmer.id} className="space-y-3">
                    {/* Farmer Header */}
                    <div className="flex items-center gap-2 pb-2">
                      <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border">
                        <Image
                          src={group.farmer.avatar || "/placeholder.svg"}
                          alt={group.farmer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {group.farmer.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({group.items.length} sản phẩm)
                      </span>
                    </div>

                    {/* Products from this farmer */}
                    {group.items.map((item) => (
                      <div key={item.id} className="flex gap-4 ml-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.product?.thumbnail || "/placeholder.svg"}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <h4 className="font-medium text-green-800 dark:text-green-300">
                            {item.product?.name || "Không có tên sản phẩm"}
                          </h4>
                          <div className="mt-1">
                            <span className="font-medium text-green-600 dark:text-green-500">
                              {formatPrice(item.product?.price || 0)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              /{item.product?.unitPrice || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Separator between farmers (except for the last group) */}
                    {groupIndex < farmerGroups.length - 1 && (
                      <div className="border-b border-gray-200 dark:border-gray-700 my-3" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Thông tin các đơn hàng sẽ tạo */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  Đơn hàng sẽ được tạo ({farmerGroups.length} đơn hàng):
                </h4>
                {farmerGroups.map((group, index) => {
                  const groupTotal = group.items.reduce(
                    (sum, item) =>
                      sum + (item.product?.price || 0) * item.quantity,
                    0
                  );

                  return (
                    <div
                      key={group.farmer.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          #{index + 1}
                        </span>
                        <span className="text-sm">{group.farmer.name}</span>
                        <span className="text-xs text-gray-500">
                          ({group.items.length} sản phẩm)
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(groupTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tạm tính
                  </span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Phí vận chuyển
                  </span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Khuyến mãi
                  </span>
                  <span className="font-medium">0₫</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-medium text-green-800 dark:text-green-300">
                  Tổng cộng
                </span>
                <span className="text-lg font-bold text-green-800 dark:text-green-300">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <strong>Thông tin đơn hàng:</strong>
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                  <li>
                    • Sẽ tạo {farmerGroups.length} đơn hàng riêng biệt cho{" "}
                    {farmerGroups.length} người bán
                  </li>
                  <li>• Mỗi đơn hàng sẽ được xử lý độc lập</li>
                  <li>• Có thể giao hàng với thời gian khác nhau</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:underline dark:text-green-500"
                  >
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:underline dark:text-green-500"
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                disabled={!selectedAddress || isCreatingOrders}
                onClick={handleCreateOrders}
              >
                {isCreatingOrders ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang tạo đơn hàng...</span>
                  </div>
                ) : selectedAddress ? (
                  <span>Đặt hàng ({farmerGroups.length} đơn hàng)</span>
                ) : (
                  <span>Vui lòng chọn địa chỉ giao hàng</span>
                )}
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại giỏ hàng
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
