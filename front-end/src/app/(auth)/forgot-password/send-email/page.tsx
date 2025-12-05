"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthService from "@/services/auth.service";
import useMessageByApiCode from "@/hooks/useMessageByApiCode";

export default function EmailSentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const getMessageByApiCode = useMessageByApiCode();

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Mã xác thực phải có 6 chữ số");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Verify the code by calling verifyForgotPassword without newPassword
      // This will validate the code and if valid, redirect to reset password page
      router.push(
        `/reset-password?email=${encodeURIComponent(
          email
        )}&code=${verificationCode}`
      );
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Có lỗi xảy ra khi xác thực mã");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setMessage("");
    setError("");

    try {
      const [result, error] = await AuthService.forgotPassword({ email });

      if (error) {
        if (error.code) {
          setError(getMessageByApiCode(error.code));
        } else {
          setError(error.message || "Có lỗi xảy ra khi gửi lại mã xác thực");
        }
        return;
      }

      setMessage("Mã xác thực đã được gửi lại thành công!");
    } catch (err) {
      console.error("Error resending email:", err);
      setError("Có lỗi xảy ra khi gửi lại mã xác thực");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi mã xác thực 6 số đến:
              <br />
              <strong className="text-gray-900">{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 space-y-2">
              <p>• Kiểm tra cả thư mục spam/junk</p>
              <p>• Mã xác thực sẽ hết hạn sau 3 phút</p>
              <p>• Mã xác thực gồm 6 chữ số</p>
              <p>• Nếu không nhận được email, hãy thử gửi lại</p>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nhập mã xác thực
                </label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                  }}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleVerifyCode}
              className="w-full"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Đang xác thực..." : "Xác thực mã"}
            </Button>

            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isResending || !email}
            >
              {isResending ? "Đang gửi..." : "Gửi lại mã xác thực"}
            </Button>

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
