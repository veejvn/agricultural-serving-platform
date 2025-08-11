import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import MarketPriceChart from "@/components/market-price/market-price-chart";

export default function MarketPricePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
          Giá Cả Thị Trường
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Theo dõi biến động giá nông sản theo thời gian thực
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-48">
            <Select defaultValue="rice">
              <SelectTrigger>
                <SelectValue placeholder="Chọn nông sản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Lúa gạo</SelectItem>
                <SelectItem value="coffee">Cà phê</SelectItem>
                <SelectItem value="pepper">Hồ tiêu</SelectItem>
                <SelectItem value="cashew">Điều</SelectItem>
                <SelectItem value="fruit">Trái cây</SelectItem>
                <SelectItem value="vegetable">Rau củ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select defaultValue="mekong-delta">
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mekong-delta">
                  Đồng bằng sông Cửu Long
                </SelectItem>
                <SelectItem value="central-highlands">Tây Nguyên</SelectItem>
                <SelectItem value="southeast">Đông Nam Bộ</SelectItem>
                <SelectItem value="red-river-delta">
                  Đồng bằng sông Hồng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Lọc theo ngày
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
          >
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Giá hiện tại</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              7,500 đ/kg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                +2.5% so với tuần trước
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Giá cao nhất (30 ngày)</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              7,800 đ/kg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">05/05/2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Giá thấp nhất (30 ngày)</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              7,100 đ/kg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">15/04/2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dự báo xu hướng</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              Tăng nhẹ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-500">
                Dự kiến tăng 3-5% trong 2 tuần tới
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="mb-8">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
          <TabsTrigger value="table">Bảng giá</TabsTrigger>
          <TabsTrigger value="analysis">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Biểu đồ giá lúa gạo
              </CardTitle>
              <CardDescription>Biến động giá 30 ngày qua</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <MarketPriceChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Bảng giá lúa gạo
              </CardTitle>
              <CardDescription>Cập nhật ngày 11/05/2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Ngày</th>
                      <th className="py-3 text-left font-medium">Giá mở cửa</th>
                      <th className="py-3 text-left font-medium">
                        Giá cao nhất
                      </th>
                      <th className="py-3 text-left font-medium">
                        Giá thấp nhất
                      </th>
                      <th className="py-3 text-left font-medium">
                        Giá đóng cửa
                      </th>
                      <th className="py-3 text-left font-medium">Biến động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((item) => (
                      <tr key={item.date} className="border-b">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.open}</td>
                        <td className="py-3">{item.high}</td>
                        <td className="py-3">{item.low}</td>
                        <td className="py-3">{item.close}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {item.change > 0 ? (
                              <>
                                <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  {item.change}%
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {Math.abs(item.change)}%
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Phân tích thị trường
              </CardTitle>
              <CardDescription>Nhận định và dự báo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">
                    Tổng quan thị trường
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Giá lúa gạo đang có xu hướng tăng nhẹ trong tháng qua, chủ
                    yếu do nhu cầu xuất khẩu tăng và nguồn cung giảm sau vụ Đông
                    Xuân. Các thị trường xuất khẩu chính như Philippines và
                    Indonesia đang tăng cường nhập khẩu để đảm bảo an ninh lương
                    thực.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">
                    Các yếu tố ảnh hưởng
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Thời tiết thuận lợi tại các vùng trồng lúa chính</li>
                    <li>Nhu cầu xuất khẩu tăng từ các thị trường Đông Nam Á</li>
                    <li>Chính sách thu mua của Chính phủ</li>
                    <li>Giá phân bón và vật tư nông nghiệp tăng nhẹ</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">
                    Dự báo ngắn hạn
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trong 2 tuần tới, giá lúa gạo dự kiến sẽ tiếp tục tăng nhẹ
                    khoảng 3-5% do nhu cầu xuất khẩu vẫn duy trì ở mức cao. Nông
                    dân có thể cân nhắc giữ lại một phần sản lượng để chờ giá
                    tốt hơn.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">
                    Dự báo dài hạn
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trong 3-6 tháng tới, giá lúa gạo có thể sẽ ổn định ở mức cao
                    do nhu cầu thế giới vẫn duy trì tốt. Tuy nhiên, cần theo dõi
                    tình hình thời tiết và sản xuất tại các nước xuất khẩu lớn
                    như Thái Lan và Ấn Độ để có chiến lược phù hợp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              So sánh giá các loại gạo
            </CardTitle>
            <CardDescription>Cập nhật ngày 11/05/2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">Loại gạo</th>
                    <th className="py-3 text-left font-medium">
                      Giá hiện tại (đ/kg)
                    </th>
                    <th className="py-3 text-left font-medium">
                      Thay đổi 7 ngày
                    </th>
                    <th className="py-3 text-left font-medium">
                      Thay đổi 30 ngày
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Gạo ST25</td>
                    <td className="py-3">22,500</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">2.3%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">5.1%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Gạo Nàng Hoa</td>
                    <td className="py-3">18,200</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">1.7%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">3.8%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Gạo Jasmine</td>
                    <td className="py-3">19,800</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">2.1%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">4.2%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Gạo IR50404</td>
                    <td className="py-3">12,500</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">1.2%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                        <span className="text-green-600">2.5%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Lời khuyên cho nông dân
            </CardTitle>
            <CardDescription>Dựa trên phân tích thị trường</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <div className="mb-2 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Thời điểm bán
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Với xu hướng giá đang tăng, nông dân có thể cân nhắc giữ lại
                  một phần sản lượng để bán vào cuối tháng 5 khi giá dự kiến đạt
                  đỉnh.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    Chiến lược canh tác
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Với giá gạo chất lượng cao đang có xu hướng tăng mạnh, nông
                  dân có thể cân nhắc chuyển đổi sang các giống lúa chất lượng
                  cao như ST25, Jasmine trong vụ tới.
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">
                    Quản lý rủi ro
                  </h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Mặc dù giá đang tăng, nông dân không nên giữ lại toàn bộ sản
                  lượng. Nên bán từng phần để phân tán rủi ro và đảm bảo dòng
                  tiền cho hoạt động sản xuất.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dữ liệu mẫu
const priceData = [
  {
    date: "11/05/2025",
    open: "7,450",
    high: "7,500",
    low: "7,400",
    close: "7,500",
    change: 0.7,
  },
  {
    date: "10/05/2025",
    open: "7,400",
    high: "7,450",
    low: "7,380",
    close: "7,450",
    change: 0.5,
  },
  {
    date: "09/05/2025",
    open: "7,380",
    high: "7,420",
    low: "7,350",
    close: "7,410",
    change: 0.4,
  },
  {
    date: "08/05/2025",
    open: "7,350",
    high: "7,400",
    low: "7,320",
    close: "7,380",
    change: 0.3,
  },
  {
    date: "07/05/2025",
    open: "7,320",
    high: "7,380",
    low: "7,300",
    close: "7,360",
    change: 0.6,
  },
  {
    date: "06/05/2025",
    open: "7,300",
    high: "7,350",
    low: "7,280",
    close: "7,320",
    change: 0.3,
  },
  {
    date: "05/05/2025",
    open: "7,280",
    high: "7,320",
    low: "7,250",
    close: "7,300",
    change: -0.4,
  },
];
