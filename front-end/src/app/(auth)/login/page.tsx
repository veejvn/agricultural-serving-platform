"use client";

import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorMessage, Field, Form, SubmitButton } from "@/components/Form";
import { LoginFormData } from "@/types/auth";
import loginSchema from "@/validations/loginSchema";
import { useState } from "react";
import AuthService from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/contants/router";

export default function LoginPage() {
  const [error, setError] = useState("");
  const { toast } = useToast();
  const getMessage = useMessageByApiCode();
  const router = useRouter();
  const redirect = useAuthStore((state) => state.redirect);
  const setTokens = useAuthStore.getState().setTokens;
  const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
  const setRedirect = useAuthStore.getState().setRedirect;

  const handleSubmit = async (data: LoginFormData) => {
    //console.log(data);
    const [result, error] = await AuthService.login(data);
    if (error) {
      //console.log(error);
      setError(getMessage(error.code));
      // toast({
      //   title: "Lỗi!",
      //   description: getMessage(error.code),
      //   variant: "error",
      // });
      return;
    }
    //console.log(result);
    if (result.data.accessToken && result.data.refreshToken) {
      setIsLoggedIn(true);
      setTokens(result.data.accessToken, result.data.refreshToken);

      toast({
        description: getMessage(result.code),
        variant: "success",
      });

      // Navigate to redirect page and then reset redirect
      // const redirectPath = redirect || "/";
      // console.log("Navigating to:", redirectPath);
      // router.push(redirectPath);
    } else {
      router.push(ROUTES.LOGIN);
      setError(getMessage(result.code));
      // toast({
      //   description: getMessage(result.code),
      //   variant: "error",
      // });
    }
  };
  
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
            <Image
              src="/images/authenticate_image.png"
              alt="Nông dân đang chăm sóc cây trồng"
              fill
              className="object-cover"
              loading="eager"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-8 flex flex-col justify-end">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Nông Nghiệp Xanh
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
          <div className="mb-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-xl">
              Chào mừng bạn đến với Nông Nghiệp Xanh
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Đăng ký hoặc đăng nhập để trải nghiệm đầy đủ các tính năng
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Đăng nhập vào tài khoản
              </CardTitle>
              <CardDescription>
                Nhập thông tin đăng nhập của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form<LoginFormData> schema={loginSchema} onSubmit={handleSubmit}>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-600 hover:underline dark:text-green-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <ErrorMessage message={error} />

                <SubmitButton loadingText="Đang đăng nhập...">
                  Đăng nhập
                </SubmitButton>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="relative bg-card px-2 text-sm text-muted-foreground">
                  Hoặc đăng nhập với
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <FcGoogle />
                  Google
                </Button>
                <Button variant="outline">
                  <FaFacebook className="text-blue-500" />
                  Facebook
                </Button>
              </div>
              <div>
                <span className="text-sm">Chưa có tài khoản? </span>
                <Link
                  href="/register"
                  className="text-sm text-green-600 hover:underline dark:text-green-500"
                >
                  Đăng ký ngay
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="text-sm text-green-600 hover:underline dark:text-green-500"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
