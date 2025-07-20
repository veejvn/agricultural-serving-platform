"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { ErrorMessage, Field, Form, SubmitButton } from "@/components/Form";
import { RegisterFormData } from "@/types/auth";
import registerSchema from "@/validations/registerSchema";
import { useState } from "react";
import AuthService from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [error, setError] = useState("");
  const { toast } = useToast();
  const getMessage = useMessageByApiCode();
  const router = useRouter();

  const handleSubmit = async (data: RegisterFormData) => {
    const [result, error] = await AuthService.register(data);
    if (error) {
      setError(getMessage(error.code));
      toast({
        title: "Lỗi!",
        description: getMessage(error.code),
        variant: "error"
      })
      return;
    }
    toast({
      title: "Thành công",
      description: getMessage(result.code),
      variant: "success"
    })
    router.push("/");
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
            <Image
              src="/register-image.png?height=800&width=600"
              alt="Nông dân đang chăm sóc cây trồng"
              fill
              className="object-cover"
              loading="eager"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-8 flex flex-col justify-end">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Nông Nghiệp Thông Minh
              </h2>
              <p className="text-lg text-green-100">
                Nền tảng hỗ trợ toàn diện cho nông dân Việt Nam với thông tin
                thời tiết, giá cả thị trường, diễn đàn trao đổi và các sản phẩm
                nông nghiệp chất lượng cao.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
              Chào mừng bạn đến với Nông Nghiệp Thông Minh
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Đăng ký hoặc đăng nhập để trải nghiệm đầy đủ các tính năng
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Tạo tài khoản mới
              </CardTitle>
              <CardDescription>
                Nhập thông tin của bạn để tạo tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form<RegisterFormData>
                schema={registerSchema}
                onSubmit={handleSubmit}
              >
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                />
                <Field
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  placeholder="••••••••"
                />
                <Field
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="••••••••"
                />

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    Tôi đồng ý với{" "}
                    <Link
                      href="#"
                      className="text-green-600 hover:underline dark:text-green-500"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="#"
                      className="text-green-600 hover:underline dark:text-green-500"
                    >
                      Chính sách bảo mật
                    </Link>
                  </Label>
                </div>

                <ErrorMessage message={error} />

                <SubmitButton loadingText="Creating account...">
                  Create account
                </SubmitButton>
              </Form>

              {/* <div className="space-y-2">
                <Label htmlFor="display-name">Tên hiển thị</Label>
                <Input id="display-name" placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" placeholder="0912345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Khu vực canh tác</Label>
                <Select>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mekong-delta">
                      Đồng bằng sông Cửu Long
                    </SelectItem>
                    <SelectItem value="red-river-delta">
                      Đồng bằng sông Hồng
                    </SelectItem>
                    <SelectItem value="central-highlands">
                      Tây Nguyên
                    </SelectItem>
                    <SelectItem value="southeast">Đông Nam Bộ</SelectItem>
                    <SelectItem value="north-central">Bắc Trung Bộ</SelectItem>
                    <SelectItem value="south-central">Nam Trung Bộ</SelectItem>
                    <SelectItem value="northwest">Tây Bắc</SelectItem>
                    <SelectItem value="northeast">Đông Bắc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  Tôi đồng ý với{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:underline dark:text-green-500"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:underline dark:text-green-500"
                  >
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div> */}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-sm text-green-600 hover:underline dark:text-green-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              {/* <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                Đăng Ký
              </Button>
              <div className="flex items-center justify-content-center">
                <div className="w-full">
                  <span className="text-sm">Đã có tài khoản? </span>
                  <Link
                    href="/login"
                    className="text-sm text-green-600 hover:underline dark:text-green-500"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              </div> */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
