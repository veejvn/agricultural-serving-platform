"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Loader2, Sprout, Users } from "lucide-react";
import Link from "next/link";

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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AccountService from "@/services/account.service";
import { IUpgradeToFarmerResponse } from "@/types/farmer";
import { useAuthStore } from "@/stores/useAuthStore";

export default function UpgradeToFarmerPage() {
  const [farmName, setFarmName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên trang trại",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the actual API
      const [response, error] = await AccountService.upgradeToFarmer({
        name: farmName.trim(),
        description: description.trim() || undefined,
      });

      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi gửi yêu cầu",
          variant: "destructive",
        });
        return;
      }

      if (response) {
        // Type assertion để TypeScript hiểu đúng kiểu dữ liệu
        const upgradeResponse = response as IUpgradeToFarmerResponse;

        // Cập nhật token mới nếu có
        if (upgradeResponse.accessToken && upgradeResponse.refreshToken) {
          const { setTokens } = useAuthStore.getState();
          setTokens(upgradeResponse.accessToken, upgradeResponse.refreshToken);

          // Có thể cập nhật user store với role mới ở đây nếu cần
          console.log("New tokens set, user can now access farmer APIs");
        }

        setIsSubmitted(true);
        toast({
          title: "Thành công",
          description: "Nâng cấp thành công! Bạn đã trở thành farmer.",
        });

        // Redirect đến farm dashboard sau 2 giây
        // setTimeout(() => {
        //   router.push("/farm");
        // }, 2000);
      }
    } catch (error: any) {
      console.error("Error upgrading to farmer:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                  Yêu cầu đã được gửi thành công!
                </CardTitle>
                <CardDescription className="text-lg">
                  Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Thông tin yêu cầu:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tên trang trại:
                      </span>
                      <span className="font-medium">{farmName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Thời gian gửi:
                      </span>
                      <span className="font-medium">
                        {new Date().toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      >
                        Đang chờ duyệt
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Các bước tiếp theo:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Xem xét hồ sơ</p>
                        <p className="text-sm text-muted-foreground">
                          Đội ngũ của chúng tôi sẽ xem xét thông tin bạn cung
                          cấp
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Thông báo kết quả</p>
                        <p className="text-sm text-muted-foreground">
                          Bạn sẽ nhận được email thông báo về kết quả xét duyệt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Kích hoạt tài khoản</p>
                        <p className="text-sm text-muted-foreground">
                          Sau khi được duyệt, tài khoản farmer sẽ được kích hoạt
                          tự động
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/account">Về trang tài khoản</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                  >
                    <Link href="/">Về trang chủ</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Sprout className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                Nâng cấp lên tài khoản Farmer
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trở thành farmer để bán sản phẩm nông nghiệp của bạn trên nền
                tảng
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Benefits */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Quyền lợi Farmer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Bán sản phẩm</p>
                        <p className="text-sm text-muted-foreground">
                          Đăng bán sản phẩm nông nghiệp của bạn
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Quản lý trang trại</p>
                        <p className="text-sm text-muted-foreground">
                          Dashboard chuyên dụng cho farmer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Thống kê doanh thu</p>
                        <p className="text-sm text-muted-foreground">
                          Theo dõi doanh thu và đơn hàng
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Hỗ trợ ưu tiên</p>
                        <p className="text-sm text-muted-foreground">
                          Được hỗ trợ ưu tiên từ đội ngũ
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Lưu ý quan trọng
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Yêu cầu nâng cấp sẽ được xem xét trong vòng 24-48 giờ. Bạn
                      sẽ nhận được email thông báo kết quả.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đăng ký</CardTitle>
                  <CardDescription>
                    Vui lòng cung cấp thông tin về trang trại của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="farmName">
                        Tên trang trại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="farmName"
                        placeholder="Ví dụ: Trang trại Xanh"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <p className="text-sm text-muted-foreground">
                        Tên này sẽ hiển thị trên các sản phẩm của bạn
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Mô tả trang trại (tùy chọn)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Mô tả ngắn về trang trại, loại sản phẩm chính, phương pháp canh tác..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        disabled={isLoading}
                      />
                      <p className="text-sm text-muted-foreground">
                        Thông tin này giúp khách hàng hiểu rõ hơn về trang trại
                        của bạn
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        Điều khoản và điều kiện
                      </h3>
                      <div className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
                        <p>
                          • Bạn cam kết cung cấp sản phẩm chất lượng và an toàn
                        </p>
                        <p>• Tuân thủ các quy định về bán hàng trên nền tảng</p>
                        <p>• Chịu trách nhiệm về chất lượng sản phẩm đã bán</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading || !farmName.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang gửi yêu cầu...
                        </>
                      ) : (
                        "Gửi yêu cầu nâng cấp"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
