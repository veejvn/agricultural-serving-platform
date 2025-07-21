import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud, CloudDrizzle, CloudRain, Droplets, Sun, Wind } from "lucide-react"
import WeatherForecastChart from "@/components/weather/weather-forecast-chart"

export default function WeatherPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">Dự Báo Thời Tiết</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Thông tin thời tiết chính xác cho hoạt động nông nghiệp
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xs">
          <Select defaultValue="mekong-delta">
            <SelectTrigger className="w-full">
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
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-4">
        <Card className="col-span-full lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Hôm nay</CardTitle>
            <CardDescription>Thứ Hai, 11/05/2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Sun className="h-24 w-24 text-yellow-500" />
              <div className="mt-4 text-4xl font-bold">32°C</div>
              <div className="mt-1 text-lg">Nắng</div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Droplets className="mr-1 h-4 w-4 text-blue-500" />
                  <span>Độ ẩm: 75%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="mr-1 h-4 w-4" />
                  <span>Gió: 12 km/h</span>
                </div>
                <div className="flex items-center">
                  <CloudRain className="mr-1 h-4 w-4 text-blue-500" />
                  <span>Mưa: 0%</span>
                </div>
                <div className="flex items-center">
                  <Sun className="mr-1 h-4 w-4 text-yellow-500" />
                  <span>UV: Cao</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Dự báo 7 ngày tới</CardTitle>
            <CardDescription>Cập nhật lúc 08:00 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {weatherForecast.map((day) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <div className="font-medium">{day.day}</div>
                  <div className="text-xs text-gray-500">{day.date}</div>
                  <div className="my-2">{getWeatherIcon(day.condition)}</div>
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-gray-500">{day.low}°</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{day.condition}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="temperature" className="mb-8">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
          <TabsTrigger value="rainfall">Lượng mưa</TabsTrigger>
          <TabsTrigger value="humidity">Độ ẩm</TabsTrigger>
          <TabsTrigger value="wind">Gió</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">Biểu đồ nhiệt độ</CardTitle>
              <CardDescription>Dự báo nhiệt độ 7 ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="temperature" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainfall" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">Biểu đồ lượng mưa</CardTitle>
              <CardDescription>Dự báo lượng mưa 7 ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="rainfall" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humidity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">Biểu đồ độ ẩm</CardTitle>
              <CardDescription>Dự báo độ ẩm 7 ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="humidity" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wind" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">Biểu đồ gió</CardTitle>
              <CardDescription>Dự báo tốc độ gió 7 ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="wind" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Lời khuyên cho nông dân</CardTitle>
            <CardDescription>Dựa trên dự báo thời tiết hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Sun className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                <span>Nên tưới nước vào buổi sáng sớm hoặc chiều tối để giảm lượng nước bốc hơi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CloudRain className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                <span>Dự báo có mưa vào cuối tuần, nên lên kế hoạch thu hoạch trước thời điểm này.</span>
              </li>
              <li className="flex items-start gap-2">
                <Wind className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>Gió mạnh vào thứ Tư, cần gia cố các công trình nhà lưới, nhà kính.</span>
              </li>
              <li className="flex items-start gap-2">
                <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                <span>Độ ẩm cao, cần chú ý phòng trừ các bệnh nấm và thối rễ.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Cảnh báo thời tiết</CardTitle>
            <CardDescription>Các hiện tượng thời tiết cực đoan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
              <div className="mb-2 flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Cảnh báo mưa lớn</h3>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Dự báo có mưa lớn vào cuối tuần tại khu vực Đồng bằng sông Cửu Long. Lượng mưa có thể đạt 50-70mm. Nông
                dân cần chủ động các biện pháp phòng tránh ngập úng.
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-orange-50 p-4 dark:bg-orange-950">
              <div className="mb-2 flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-medium text-orange-800 dark:text-orange-300">Cảnh báo nắng nóng</h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Nhiệt độ cao nhất trong 3 ngày tới có thể lên đến 35-37°C. Nông dân cần bổ sung nước cho cây trồng và
                tránh làm việc ngoài trời vào giờ nắng gắt (11h-15h).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hàm lấy biểu tượng thời tiết
function getWeatherIcon(condition: string) {
  switch (condition) {
    case "Nắng":
      return <Sun className="h-8 w-8 text-yellow-500" />
    case "Mây":
      return <Cloud className="h-8 w-8 text-gray-500" />
    case "Mưa nhẹ":
      return <CloudDrizzle className="h-8 w-8 text-blue-500" />
    case "Mưa":
      return <CloudRain className="h-8 w-8 text-blue-500" />
    case "Mưa lớn":
      return <CloudRain className="h-8 w-8 text-blue-700" />
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />
  }
}

// Dữ liệu mẫu
const weatherForecast = [
  { day: "Thứ 2", date: "11/05", condition: "Nắng", high: 32, low: 24 },
  { day: "Thứ 3", date: "12/05", condition: "Nắng", high: 33, low: 25 },
  { day: "Thứ 4", date: "13/05", condition: "Mây", high: 31, low: 24 },
  { day: "Thứ 5", date: "14/05", condition: "Mây", high: 30, low: 23 },
  { day: "Thứ 6", date: "15/05", condition: "Mưa nhẹ", high: 29, low: 23 },
  { day: "Thứ 7", date: "16/05", condition: "Mưa", high: 28, low: 22 },
  { day: "CN", date: "17/05", condition: "Mưa lớn", high: 27, low: 22 },
]
