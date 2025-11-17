"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, ShoppingCart, DollarSign, Star, TrendingUp, AlertCircle, CheckCircle, Ban } from 'lucide-react'
import { IFarmerResponse, IFarmerStatus } from "@/types/farmer"

export default function AdminFarmerDetail() {
  const params = useParams()
  const router = useRouter()
  const farmerId = params.id as string

  const [farmer, setFarmer] = useState<IFarmerResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFarmerData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockFarmer: IFarmerResponse = {
        id: farmerId,
        name: "Trần Văn Nông",
        avatar: "/placeholder.svg?height=100&width=100",
        coverImage: "/placeholder.svg?height=300&width=800",
        rating: 4.8,
        description: "Trang trại lúa gạo hữu cơ chuyên sản xuất gạo sạch không sử dụng hóa chất",
        status: "ACTIVE",
      }

      setFarmer(mockFarmer)
      setLoading(false)
    }

    fetchFarmerData()
  }, [farmerId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy nông dân</h2>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: IFarmerStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Hoạt động</Badge>
      case "SELF_BLOCK":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Tự khóa</Badge>
      case "ADMIN_BLOCK":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Bị khóa</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết nông dân</h1>
          <p className="text-muted-foreground">Xem và quản lý thông tin nông dân</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarImage src={farmer.avatar || "/placeholder.svg"} alt={farmer.name} />
                <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{farmer.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusBadge(farmer.status)}
                    <Badge variant="outline">ID: {farmer.id}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Duyệt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Ban className="h-4 w-4 mr-2" />
                    Khóa tài khoản
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{farmer.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">tranvannong@example.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Điện thoại</p>
                  <p className="font-medium">0123 456 789</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="font-medium">Đồng Tháp, Việt Nam</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-medium">15/01/2024</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đang bán</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2M</div>
            <p className="text-xs text-muted-foreground">VNĐ tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmer.rating}</div>
            <p className="text-xs text-muted-foreground">Từ 324 đánh giá</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hoạt động</CardTitle>
              <CardDescription>Tóm tắt hoạt động gần đây</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Sản phẩm mới</p>
                  <p className="text-sm text-gray-600">Đã thêm 3 sản phẩm mới trong tuần qua</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Đơn hàng hoàn thành</p>
                  <p className="text-sm text-gray-600">234 đơn hàng hoàn thành thành công</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Cảnh báo</p>
                  <p className="text-sm text-gray-600">1 sản phẩm có báo cáo vi phạm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>24 sản phẩm đang được bán</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto text-gray-400" />
                <p>Danh sách sản phẩm</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>156 tổng đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-center py-8 text-gray-500">
                <ShoppingCart className="h-8 w-8 mx-auto text-gray-400" />
                <p>Danh sách đơn hàng</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá từ khách hàng</CardTitle>
              <CardDescription>324 đánh giá từ khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-center py-8 text-gray-500">
                <Star className="h-8 w-8 mx-auto text-gray-400" />
                <p>Danh sách đánh giá</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}