"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đặt lại mật khẩu thành công</h2>
          <p className="mt-2 text-sm text-gray-600">Mật khẩu của bạn đã được cập nhật thành công</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-600">Hoàn tất!</CardTitle>
            <CardDescription>
              Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-800 space-y-2">
                <p className="font-medium">Lưu ý bảo mật:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Không chia sẻ mật khẩu với ai khác</li>
                  <li>• Sử dụng mật khẩu mạnh và duy nhất</li>
                  <li>• Đăng xuất khỏi thiết bị công cộng</li>
                  <li>• Thay đổi mật khẩu định kỳ</li>
                </ul>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Đăng nhập ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
              Về trang chủ
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}