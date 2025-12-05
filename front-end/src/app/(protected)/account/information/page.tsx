"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AccountService from "@/services/account.service";
import UploadService from "@/services/upload.service";
import { IAccountResponse } from "@/types/account";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số.",
  }),
  dob: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [accountData, setAccountData] = useState<IAccountResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const getMessageByApiCode = useMessageByApiCode();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      dob: "",
    },
    mode: "onChange",
  });

  // Load account data on component mount
  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoadingData(true);
      const [data, error] = await AccountService.getAccount();

      if (error) {
        if (error.code) {
          toast({
            title: "Lỗi",
            description: getMessageByApiCode(error.code),
            variant: "error",
          });
        } else {
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin tài khoản",
            variant: "error",
          });
        }
        console.error("Error loading account data:", error);
        return;
      }

      if (data) {
        setAccountData(data);
        // Update form with loaded data
        form.reset({
          displayName: data.displayName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob ? data.dob.split("T")[0] : "", // Format date for input
        });
      }
    } catch (error) {
      console.error("Error loading account data:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải thông tin tài khoản",
        variant: "error",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!UploadService.isImageFile(file)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP)",
        variant: "error",
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: "File ảnh không được vượt quá 5MB",
        variant: "error",
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Upload image first
      const [uploadResult, uploadError] = await UploadService.uploadImage(file);

      if (uploadError) {
        toast({
          title: "Lỗi",
          description: "Không thể tải lên ảnh đại diện",
          variant: "error",
        });
        return;
      }

      if (uploadResult) {
        // Update account with new avatar using PATCH (partial update)
        const [updateResult, updateError] = await AccountService.patchAccount({
          avatar: uploadResult,
        });

        if (updateError) {
          if (updateError.code) {
            toast({
              title: "Lỗi",
              description: getMessageByApiCode(updateError.code),
              variant: "error",
            });
          } else {
            toast({
              title: "Lỗi",
              description: "Không thể cập nhật ảnh đại diện",
              variant: "error",
            });
          }
          return;
        }

        if (updateResult) {
          setAccountData(updateResult);
          toast({
            title: "Thành công",
            description: getMessageByApiCode("account-s-02"),
          });
        }
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải lên ảnh đại diện",
        variant: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);

      // Use PATCH instead of PUT to avoid losing avatar
      const updateData = {
        displayName: data.displayName,
        phone: data.phone,
        dob: data.dob,
        // No need to include avatar with PATCH - it will be preserved
      };

      const [result, error] = await AccountService.patchAccount(updateData);

      if (error) {
        if (error.code) {
          toast({
            title: "Lỗi",
            description: getMessageByApiCode(error.code),
            variant: "error",
          });
        } else {
          toast({
            title: "Lỗi",
            description:
              error.message || "Có lỗi xảy ra khi cập nhật thông tin",
            variant: "error",
          });
        }
        console.error("Error updating account:", error);
        return;
      }

      if (result) {
        setAccountData(result);
        toast({
          title: "Thành công",
          description: getMessageByApiCode("account-s-02"),
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      {isLoadingData ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Đang tải thông tin...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
              <CardDescription>
                Cập nhật ảnh đại diện của bạn. Kích thước tối đa 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                    {accountData?.avatar ? (
                      <img
                        src={accountData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        <Camera className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileUpload}
                    disabled={isUploadingAvatar}
                    className="w-fit"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingAvatar ? "Đang tải lên..." : "Thay đổi ảnh"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF hoặc WebP. Tối đa 5MB.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  aria-label="Upload avatar image"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin này sẽ được hiển thị công khai, vì vậy hãy cẩn thận
                với những gì bạn chia sẻ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="displayName"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@example.com"
                              {...field}
                              disabled
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormDescription>
                            Email không thể thay đổi
                          </FormDescription>
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
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
