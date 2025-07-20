"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowLeft } from "lucide-react"

export default function EmailSentPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const handleResendEmail = () => {
    // In real app, call API to resend email
    console.log("Resending email to:", email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email đã được gửi</h2>
          <p className="mt-2 text-sm text-gray-600">Kiểm tra hộp thư của bạn để đặt lại mật khẩu</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến:
              <br />
              <strong className="text-gray-900">{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Kiểm tra cả thư mục spam/junk</p>
              <p>• Liên kết sẽ hết hạn sau 24 giờ</p>
              <p>• Nếu không nhận được email, hãy thử gửi lại</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={handleResendEmail} variant="outline" className="w-full bg-transparent">
              Gửi lại email
            </Button>

            <Link href="/dang-nhap" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}