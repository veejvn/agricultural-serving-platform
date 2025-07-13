import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Cloud,
  LineChart,
  MessageSquare,
  ShoppingBag,
  Users,
} from "lucide-react";
import WeatherWidget from "@/components/weather-widget";
import MarketPriceWidget from "@/components/market-price-widget";
import ForumPreview from "@/components/forum-preview";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter text-green-800 dark:text-green-300 sm:text-5xl xl:text-6xl">
                Nông Nghiệp Thông Minh
              </h1>
              <p className="max-w-[600px] text-lg text-gray-700 dark:text-gray-300">
                Nền tảng toàn diện hỗ trợ nông dân Việt Nam với thông tin thời
                tiết, giá cả thị trường, diễn đàn trao đổi và các sản phẩm nông
                nghiệp chất lượng cao.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <Link href="/dang-ky">Đăng Ký Ngay</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
                >
                  <Link href="/san-pham">Xem Sản Phẩm</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Nông dân đang chăm sóc cây trồng"
                width={600}
                height={500}
                className="rounded-xl shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
            Tính Năng Nổi Bật
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Những công cụ thiết yếu giúp nông dân phát triển sản xuất
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <Cloud className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Dự Báo Thời Tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Cập nhật thông tin thời tiết chính xác theo khu vực, giúp lên kế
                hoạch canh tác hiệu quả.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/thoi-tiet">Xem dự báo</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <LineChart className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Giá Cả Thị Trường
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Theo dõi biến động giá nông sản theo thời gian thực, giúp quyết
                định thời điểm thu hoạch và bán sản phẩm.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/gia-ca">Xem giá cả</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <MessageSquare className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Diễn Đàn Trao Đổi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Kết nối với cộng đồng nông dân, chia sẻ kinh nghiệm và giải đáp
                thắc mắc về kỹ thuật canh tác.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/dien-dan">Tham gia ngay</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <ShoppingBag className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Sản Phẩm Nông Nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Tiếp cận các sản phẩm, công cụ và vật tư nông nghiệp chất lượng
                cao với giá cả hợp lý.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/san-pham">Khám phá</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <Users className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Cộng Đồng Hỗ Trợ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Kết nối với chuyên gia nông nghiệp và cộng đồng nông dân để được
                tư vấn và hỗ trợ kịp thời.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/cong-dong">Tham gia</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader className="pb-2">
              <CalendarDays className="h-10 w-10 text-green-600 dark:text-green-500" />
              <CardTitle className="mt-2 text-xl text-green-800 dark:text-green-300">
                Lịch Canh Tác
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Lập kế hoạch canh tác theo mùa vụ, nhận thông báo về thời điểm
                gieo trồng, chăm sóc và thu hoạch.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="ghost"
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-0"
              >
                <Link href="/lich-canh-tac">Xem lịch</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-green-50 dark:bg-green-950 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
              Thông Tin Hữu Ích
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Cập nhật thông tin quan trọng cho hoạt động nông nghiệp
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1">
              <WeatherWidget />
            </div>
            <div className="col-span-1">
              <MarketPriceWidget />
            </div>
            <div className="col-span-1">
              <ForumPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
            Nông Dân Nói Gì Về Chúng Tôi
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Những trải nghiệm thực tế từ cộng đồng nông dân
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-100 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-green-100">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Ảnh đại diện"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-800 dark:text-green-300">
                    Nguyễn Văn A
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nông dân trồng lúa, Đồng Tháp
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;Nhờ dự báo thời tiết chính xác, tôi đã lên kế hoạch thu
                hoạch trước khi mưa lớn, tránh được thiệt hại đáng kể. Cảm ơn
                nền tảng rất nhiều!&quot;
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-green-100">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Ảnh đại diện"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-800 dark:text-green-300">
                    Trần Thị B
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nông dân trồng rau, Lâm Đồng
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;Diễn đàn trao đổi giúp tôi học hỏi nhiều kỹ thuật canh tác
                mới. Tôi đã áp dụng và tăng năng suất lên 30% so với trước
                đây.&quot;
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-green-100">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Ảnh đại diện"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-800 dark:text-green-300">
                    Lê Văn C
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nông dân trồng cà phê, Đắk Lắk
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                &quot;Theo dõi giá cả thị trường giúp tôi quyết định thời điểm
                bán cà phê hợp lý. Năm nay lợi nhuận tăng đáng kể nhờ bán đúng
                thời điểm.&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 dark:bg-green-800">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="lg:max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Sẵn sàng nâng cao hiệu quả canh tác?
              </h2>
              <p className="mt-4 text-lg text-green-100">
                Đăng ký ngay hôm nay để tiếp cận đầy đủ các tính năng và thông
                tin hữu ích cho hoạt động nông nghiệp của bạn.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-green-700 hover:text-white"
              >
                <Link href="/dang-ky">Đăng Ký Miễn Phí</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-green-700 hover:bg-green-700 hover:text-white"
              >
                <Link href="/lien-he">Liên Hệ Tư Vấn</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
