import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

export default function AuthPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Nông dân đang chăm sóc cây trồng"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-8 flex flex-col justify-end">
              <h2 className="mb-4 text-3xl font-bold text-white">Nông Nghiệp Thông Minh</h2>
              <p className="text-lg text-green-100">
                Nền tảng hỗ trợ toàn diện cho nông dân Việt Nam với thông tin thời tiết, giá cả thị trường, diễn đàn
                trao đổi và các sản phẩm nông nghiệp chất lượng cao.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
              Chào mừng bạn đến với Nông Nghiệp Thông Minh
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Đăng ký hoặc đăng nhập để trải nghiệm đầy đủ các tính năng
            </p>
          </div>

          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Đăng Ký</TabsTrigger>
              <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800 dark:text-green-300">Tạo tài khoản mới</CardTitle>
                  <CardDescription>Nhập thông tin của bạn để tạo tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Họ</Label>
                      <Input id="first-name" placeholder="Nguyễn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Tên</Label>
                      <Input id="last-name" placeholder="Văn A" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0912345678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Khu vực canh tác</Label>
                    <Select>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mekong-delta">Đồng bằng sông Cửu Long</SelectItem>
                        <SelectItem value="red-river-delta">Đồng bằng sông Hồng</SelectItem>
                        <SelectItem value="central-highlands">Tây Nguyên</SelectItem>
                        <SelectItem value="southeast">Đông Nam Bộ</SelectItem>
                        <SelectItem value="north-central">Bắc Trung Bộ</SelectItem>
                        <SelectItem value="south-central">Nam Trung Bộ</SelectItem>
                        <SelectItem value="northwest">Tây Bắc</SelectItem>
                        <SelectItem value="northeast">Đông Bắc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      Tôi đồng ý với{" "}
                      <Link href="#" className="text-green-600 hover:underline dark:text-green-500">
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link href="#" className="text-green-600 hover:underline dark:text-green-500">
                        Chính sách bảo mật
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                    Đăng Ký
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800 dark:text-green-300">Đăng nhập vào tài khoản</CardTitle>
                  <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email hoặc số điện thoại</Label>
                    <Input id="login-email" type="email" placeholder="example@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Mật khẩu</Label>
                      <Link href="#" className="text-sm text-green-600 hover:underline dark:text-green-500">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <Input id="login-password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                    Đăng Nhập
                  </Button>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <span className="relative bg-card px-2 text-sm text-muted-foreground">Hoặc đăng nhập với</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Google"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      Facebook
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
