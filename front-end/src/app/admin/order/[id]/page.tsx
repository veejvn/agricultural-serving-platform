"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  AlertTriangle,
} from "lucide-react"
import type { IOrderResponse, IOrderStatus, IChangeOrderStatusRequest } from "@/types/order"

// Mock data - same as customer page
const mockOrder: IOrderResponse = {
  id: "ORD-2024-001",
  totalPrice: 285000,
  totalQuantity: 3,
  note: "Giao hàng vào buổi sáng, gọi trước 15 phút",
  status: "DELIVERING",
  address: {
    id: "addr-1",
    receiverName: "Nguyễn Văn An",
    receiverPhone: "0901234567",
    detail: "123 Đường Lê Lợi",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  account: {
    id: "acc-1",
    email: "nguyenvanan@email.com",
    displayName: "Nguyễn Văn An",
    phone: "0901234567",
    dob: "1990-01-01",
    avatar: "/placeholder.svg?height=40&width=40&text=NA",
    roles: ["CUSTOMER"],
  },
  orderItems: [
    {
      orderItemId: "item-1",
      quantity: 2,
      product: {
        id: "prod-1",
        name: "Vú sữa hoàng kim",
        thumbnail: "/placeholder.svg?height=80&width=80&text=Vú+sữa",
        price: 85000,
        category: "Trái cây",
      },
    },
    {
      orderItemId: "item-2",
      quantity: 1,
      product: {
        id: "prod-2",
        name: "Rau cải xanh hữu cơ",
        thumbnail: "/placeholder.svg?height=80&width=80&text=Rau+cải",
        price: 115000,
        category: "Rau củ",
      },
    },
  ],
  createdAt: "2024-01-15T10:30:00Z",
}

const statusConfig = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  DELIVERING: {
    label: "Đang giao hàng",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Package,
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
}

const statusOptions: { value: IOrderStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "DELIVERING", label: "Đang giao hàng" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "RECEIVED", label: "Đã nhận hàng" },
  { value: "CANCELED", label: "Đã hủy" },
]

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<IOrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<IOrderStatus>("PENDING")
  const [adminNote, setAdminNote] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchOrder = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (params.id === mockOrder.id) {
          setOrder(mockOrder)
          setNewStatus(mockOrder.status)
        } else {
          throw new Error("Order not found")
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng",
          variant: "destructive",
        })
        router.push("/admin/don-hang")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, router])

  const handleUpdateStatus = async () => {
    if (!order) return

    try {
      setUpdating(true)

      const request: IChangeOrderStatusRequest = {
        orderId: order.id,
        status: newStatus,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOrder({
        ...order,
        status: newStatus,
      })

      setIsEditingStatus(false)

      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái đơn hàng thành "${statusOptions.find((s) => s.value === newStatus)?.label}"`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h1>
          <Button onClick={() => router.push("/admin/don-hang")}>Quay lại danh sách đơn hàng</Button>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.status].icon

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng #{order.id}</h1>
          <p className="text-gray-600">Đặt hàng lúc {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Quản lý trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Trạng thái hiện tại:</span>
                    <Badge className={`${statusConfig[order.status].color} border`}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  {!isEditingStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingStatus(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Thay đổi trạng thái
                    </Button>
                  )}
                </div>

                {isEditingStatus && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái mới</Label>
                      <Select value={newStatus} onValueChange={(value: IOrderStatus) => setNewStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-note">Ghi chú admin (tùy chọn)</Label>
                      <Textarea
                        id="admin-note"
                        placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateStatus}
                        disabled={updating || newStatus === order.status}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingStatus(false)
                          setNewStatus(order.status)
                          setAdminNote("")
                        }}
                      >
                        Hủy
                      </Button>
                    </div>

                    {newStatus === "CANCELED" && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium">Lưu ý khi hủy đơn hàng:</p>
                          <ul className="mt-1 list-disc list-inside space-y-1">
                            <li>Khách hàng sẽ được hoàn tiền (nếu đã thanh toán)</li>
                            <li>Sản phẩm sẽ được trả về kho</li>
                            <li>Thao tác này không thể hoàn tác</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm đã đặt ({order.totalQuantity} sản phẩm)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.orderItemId}>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.thumbnail || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          ID: {item.product.id} • Danh mục: {item.product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < order.orderItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Note */}
          {order.note && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ghi chú từ khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>ID đơn hàng:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng sản phẩm:</span>
                <span>{order.totalQuantity}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Tổng tiền:</span>
                <span className="text-green-600">{formatPrice(order.totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={order.account.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{order.account.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.account.displayName}</p>
                  <p className="text-sm text-gray-600">ID: {order.account.id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.account.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{order.account.phone}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => router.push(`/admin/nguoi-dung/${order.account.id}`)}
              >
                Xem chi tiết khách hàng
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.address.receiverName}</p>
              <p className="text-sm text-gray-600">{order.address.receiverPhone}</p>
              <p className="text-sm text-gray-700">
                {order.address.detail}, {order.address.ward}, {order.address.district}, {order.address.province}
              </p>
              {order.address.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Địa chỉ mặc định
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch sử đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Đơn hàng được tạo</p>
                    <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.status !== "PENDING" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã xác nhận</p>
                      <p className="text-gray-600">15/01/2024 11:00</p>
                    </div>
                  </div>
                )}
                {["DELIVERING", "DELIVERED", "RECEIVED"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đang giao hàng</p>
                      <p className="text-gray-600">15/01/2024 14:30</p>
                    </div>
                  </div>
                )}
                {["DELIVERED", "RECEIVED"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã giao hàng</p>
                      <p className="text-gray-600">16/01/2024 09:15</p>
                    </div>
                  </div>
                )}
                {order.status === "RECEIVED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã nhận hàng</p>
                      <p className="text-gray-600">16/01/2024 10:00</p>
                    </div>
                  </div>
                )}
                {order.status === "CANCELED" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Đã hủy</p>
                      <p className="text-gray-600">Hôm nay</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}