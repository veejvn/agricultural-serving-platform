"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="text-8xl font-bold text-green-600 mb-2">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy trang</h1>
            <p className="text-gray-600">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/product">
                <Search className="w-4 h-4 mr-2" />
                Xem sản phẩm
              </Link>
            </Button>

            <Button variant="ghost" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}