"use client";

import type React from "react";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (
        formData.email === "admin@nongnghi.com" &&
        formData.password === "admin123"
      ) {
        router.push("/admin");
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md py-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Đăng nhập vào hệ thống quản trị
          </p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@nongnghi.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    handleInputChange("rememberMe", checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline dark:text-green-500"
              >
                Quên mật khẩu?
              </Link>
            </div>

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
