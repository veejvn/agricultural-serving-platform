"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import FarmerService from "@/services/farmer.service";
import UploadService from "@/services/upload.service";
import {
  IFarmerResponse,
  IFarmerUpdateInfoPatchRequest,
  IFarmerStatus,
} from "@/types/farmer";

export default function FarmSettingPage() {
  const { toast } = useToast();

  const [farmerData, setFarmerData] = useState<IFarmerResponse | null>(null);
  const [formData, setFormData] = useState<IFarmerUpdateInfoPatchRequest>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      setIsFetching(true);
      const [data, error] = await FarmerService.getFarmerByOwner();
      if (!error && data) {
        setFarmerData(data);
        setFormData({
          name: data.name,
          avatar: data.avatar,
          coverImage: data.coverImage,
          description: data.description,
        });
      }
      setIsFetching(false);
    };
    fetchFarmer();
  }, []);

  const handleInputChange = (
    field: keyof IFarmerUpdateInfoPatchRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (field: "avatar" | "coverImage") => {
    if (field === "avatar") {
      avatarInputRef.current?.click();
    } else {
      coverInputRef.current?.click();
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!UploadService.isImageFile(file)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: "File ảnh không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    if (field === "avatar") setIsUploadingAvatar(true);
    if (field === "coverImage") setIsUploadingCover(true);

    try {
      const [uploadResult, uploadError] = await UploadService.uploadImage(file);
      if (uploadError || !uploadResult) {
        toast({
          title: "Lỗi",
          description: "Không thể tải lên hình ảnh",
          variant: "destructive",
        });
        return;
      }
      handleInputChange(field, uploadResult);
      toast({
        title: "Ảnh đã được tải lên",
        description: `${
          field === "avatar" ? "Ảnh đại diện" : "Ảnh bìa"
        } đã được cập nhật thành công.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải lên hình ảnh",
        variant: "destructive",
      });
    } finally {
      if (field === "avatar") setIsUploadingAvatar(false);
      if (field === "coverImage") setIsUploadingCover(false);
      // Reset file input
      if (field === "avatar" && avatarInputRef.current)
        avatarInputRef.current.value = "";
      if (field === "coverImage" && coverInputRef.current)
        coverInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const [data, error] = await FarmerService.updateFarmerInfoPatch(formData);
      if (!error && data) {
        setFarmerData(data);
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin trang trại đã được cập nhật.",
        });
      } else {
        toast({
          title: "Lỗi",
          description:
            error?.message || "Có lỗi xảy ra khi cập nhật thông tin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Không tìm thấy thông tin trang trại
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/farm">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cài đặt trang trại
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và cài đặt trang trại của bạn
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin hiện tại</CardTitle>
            <CardDescription>Xem thông tin trang trại của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={farmerData.avatar || "/placeholder.svg"}
                  alt={farmerData.name}
                />
                <AvatarFallback>{farmerData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold">{farmerData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: FARMER_{farmerData.id.slice(0, 8)}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm">⭐ {farmerData.rating}</span>
                  {getStatusBadge(farmerData.status)}
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium">Mô tả</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {farmerData.description || "Chưa có mô tả"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cập nhật thông tin</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin trang trại của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Ảnh bìa trang trại</Label>
                <div className="relative">
                  <div
                    className="w-full h-32 bg-cover bg-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                    style={{ backgroundImage: `url(${formData.coverImage})` }}
                    onClick={() => handleImageSelect("coverImage")}
                  >
                    {isUploadingCover ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white bg-black bg-opacity-50 flex items-center justify-center"></div>
                    ) : (
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => handleImageSelect("coverImage")}
                    disabled={isUploadingCover}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingCover ? "Đang tải..." : "Thay đổi"}
                  </Button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "coverImage")}
                    aria-label="Upload cover image"
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={formData.avatar || "/placeholder.svg"}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {formData.name?.charAt(0) || "F"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageSelect("avatar")}
                    disabled={isUploadingAvatar}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingAvatar
                      ? "Đang tải..."
                      : "Thay đổi ảnh đại diện"}
                  </Button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    aria-label="Upload avatar image"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên trang trại</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên trang trại"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả trang trại</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Mô tả về trang trại, kinh nghiệm, và sản phẩm của bạn..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
