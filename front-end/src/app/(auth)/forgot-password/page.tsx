"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail } from "lucide-react";
import AuthService from "@/services/auth.service";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const getMessageByApiCode = useMessageByApiCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const [result, error] = await AuthService.forgotPassword({ email });

      if (error) {
        if (error.code) {
          setError(getMessageByApiCode(error.code));
        } else {
          setError(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
        return;
      }

      // Success - redirect to confirmation page
      router.push(
        `/forgot-password/send-email?email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      console.error("Error sending forgot password email:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Đặt lại mật khẩu
            </CardTitle>
            <CardDescription className="text-center">
              Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
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
        </Card>
      </div>
    </div>
  );
}
