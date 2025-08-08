"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import AuthService from "@/services/auth.service";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const getMessageByApiCode = useMessageByApiCode();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Get verification code and email from URL params
    const codeParam = searchParams.get("code");
    const emailParam = searchParams.get("email");

    if (!codeParam || !emailParam) {
      setError(
        "Thông tin không hợp lệ. Vui lòng thực hiện lại quá trình quên mật khẩu."
      );
      return;
    }

    setCode(codeParam);
    setEmail(emailParam);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!code || !email) {
      setError("Thông tin xác thực không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [result, error] = await AuthService.verifyForgotPassword({
        code,
        newPassword: data.newPassword,
      });

      if (error) {
        if (error.code) {
          setError(getMessageByApiCode(error.code));
        } else {
          setError(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu.");
        }
        return;
      }

      // Success - redirect to login with success message
      router.push("/login?message=reset-password-success");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Có lỗi xảy ra khi đặt lại mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show error state if no code or email
  if ((!code || !email) && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">
                Thông tin không hợp lệ
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-3">
              <Link href="/forgot-password" className="w-full">
                <Button className="w-full">Thực hiện lại quên mật khẩu</Button>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Mật khẩu mới</CardTitle>
            <CardDescription className="text-center">
              Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !code || !email}
                >
                  {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
