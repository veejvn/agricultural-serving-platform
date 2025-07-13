import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  // Giả lập dữ liệu giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: "Phân bón NPK Đầu Trâu",
      price: 250000,
      discount: 10,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Hạt giống lúa ST25",
      price: 120000,
      discount: 0,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Thuốc trừ sâu sinh học BT",
      price: 180000,
      discount: 0,
      quantity: 3,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
    return total + itemPrice * item.quantity
  }, 0)

  const shipping = 30000 // Phí vận chuyển
  const total = subtotal + shipping

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">Thanh Toán</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Hoàn tất thông tin giao hàng và phương thức thanh toán
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* Thông tin giao hàng */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl text-green-800 dark:text-green-300">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="0912345678" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
                  <Select>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hn">Hà Nội</SelectItem>
                      <SelectItem value="ct">Cần Thơ</SelectItem>
                      <SelectItem value="dn">Đà Nẵng</SelectItem>
                      <SelectItem value="ag">An Giang</SelectItem>
                      <SelectItem value="bt">Bến Tre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select>
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">Quận 1</SelectItem>
                        <SelectItem value="q2">Quận 2</SelectItem>
                        <SelectItem value="q3">Quận 3</SelectItem>
                        <SelectItem value="q4">Quận 4</SelectItem>
                        <SelectItem value="q5">Quận 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select>
                      <SelectTrigger id="ward">
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p1">Phường 1</SelectItem>
                        <SelectItem value="p2">Phường 2</SelectItem>
                        <SelectItem value="p3">Phường 3</SelectItem>
                        <SelectItem value="p4">Phường 4</SelectItem>
                        <SelectItem value="p5">Phường 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ cụ thể</Label>
                  <Input id="address" placeholder="Số nhà, tên đường..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Phương thức vận chuyển */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Truck className="h-5 w-5 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl text-green-800 dark:text-green-300">Phương thức vận chuyển</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex flex-1 cursor-pointer justify-between">
                      <div>
                        <p className="font-medium">Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhận hàng trong 2-3 ngày</p>
                      </div>
                      <div className="font-medium">{formatCurrency(30000)}</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex flex-1 cursor-pointer justify-between">
                      <div>
                        <p className="font-medium">Giao hàng nhanh</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhận hàng trong 24 giờ</p>
                      </div>
                      <div className="font-medium">{formatCurrency(60000)}</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Phương thức thanh toán */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl text-green-800 dark:text-green-300">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="cod" className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center gap-4">
                      <Image src="/placeholder.svg?height=40&width=40" alt="COD" width={40} height={40} />
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-4">
                      <Image src="/placeholder.svg?height=40&width=40" alt="Bank Transfer" width={40} height={40} />
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thanh toán qua chuyển khoản ngân hàng
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex flex-1 cursor-pointer items-center gap-4">
                      <Image src="/placeholder.svg?height=40&width=40" alt="MoMo" width={40} height={40} />
                      <div>
                        <p className="font-medium">Ví MoMo</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Thanh toán qua ví điện tử MoMo</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[300px] space-y-4 overflow-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-medium text-green-800 dark:text-green-300">{item.name}</h3>
                      <div className="mt-1">
                        {item.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600 dark:text-green-500">
                              {formatCurrency(item.price * (1 - item.discount / 100))}
                            </span>
                            <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-green-600 dark:text-green-500">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển</span>
                  <span className="font-medium">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Khuyến mãi</span>
                  <span className="font-medium">0₫</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-medium text-green-800 dark:text-green-300">Tổng cộng</span>
                <span className="text-lg font-bold text-green-800 dark:text-green-300">{formatCurrency(total)}</span>
              </div>

              <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <Link href="#" className="text-green-600 hover:underline dark:text-green-500">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="#" className="text-green-600 hover:underline dark:text-green-500">
                    Chính sách bảo mật
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                asChild
              >
                <Link href="/thanh-toan/hoan-tat">Đặt hàng</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/gio-hang">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại giỏ hàng
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
