"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthService from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminLoginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  rememberMe: z.boolean().optional(),
});

type AdminLoginFormValues = z.infer<typeof AdminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const getMessage = useMessageByApiCode();
  const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
  const setTokens = useAuthStore.getState().setTokens;

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    const adminLoginRequest = {
      email: data.email,
      password: data.password,
    };
    const [result, error] = await AuthService.adminLogin(adminLoginRequest);
    if (error) {
      setError(getMessage(error.code));
      setIsLoading(false);
      return;
    }
    if (result.data.accessToken && result.data.refreshToken) {
      setIsLoggedIn(true);
      setTokens(result.data.accessToken, result.data.refreshToken);

      toast({
        description: getMessage(result.code),
        variant: "success",
      });

      router.push("/admin");
    } else {
      setError(getMessage(result.code));
    }
    form.reset();
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md py-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-green-800 dark:text-green-300">
              Đăng nhập Admin
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập để truy cập hệ thống quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setError("");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Nhập mật khẩu"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setError("");
                              }}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={form.watch("rememberMe")}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 mx-2"
                          />
                        </FormControl>
                        <FormLabel>Remember Me</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>

            {/* <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline dark:text-green-500"
              >
                Quên mật khẩu?
              </Link>
            </div> */}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  ← Quay về trang chủ
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
