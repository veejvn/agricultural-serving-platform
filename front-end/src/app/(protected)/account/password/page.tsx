"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import AuthService from "@/services/auth.service";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

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
import { Eye, EyeOff } from "lucide-react";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    }),
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
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function PasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const getMessageByApiCode = useMessageByApiCode();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);

    try {
      const [result, error] = await AuthService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (error) {
        // Handle specific error cases based on API codes
        if (error.code) {
          toast.error(getMessageByApiCode(error.code));
        } else if (error.status === 400) {
          toast.error(getMessageByApiCode("auth-e-07")); // Wrong current password
        } else if (error.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        } else if (error.status === 404) {
          toast.error(getMessageByApiCode("auth-e-06")); // Account not found
        } else {
          toast.error(error.message || "Có lỗi xảy ra khi cập nhật mật khẩu");
        }
      } else {
        // Handle success case
        if (result?.code) {
          toast.success(getMessageByApiCode(result.code));
        } else {
          toast.success(getMessageByApiCode("auth-s-06")); // Default success message
        }
        form.reset();
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Có lỗi xảy ra khi cập nhật mật khẩu");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Đổi mật khẩu</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật mật khẩu của bạn để bảo mật tài khoản
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mật khẩu</CardTitle>
          <CardDescription>
            Đảm bảo mật khẩu của bạn đủ mạnh và không được sử dụng ở nơi khác.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showCurrentPassword
                              ? "Ẩn mật khẩu"
                              : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          <span className="sr-only">
                            {showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Mật khẩu phải có ít nhất 8 ký tự.
                    </FormDescription>
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
                          <span className="sr-only">
                            {showConfirmPassword
                              ? "Ẩn mật khẩu"
                              : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
