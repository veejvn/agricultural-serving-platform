"use client";

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
import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  Droplets,
  Search,
  Sun,
  Wind,
  X,
} from "lucide-react";
import WeatherForecastChart from "@/components/weather/weather-forecast-chart";

import { useEffect, useState } from "react";
import type {
  IWeatherWithCityResponse,
  IForecastResponse,
} from "@/types/weather";
import { mapWeatherIcon } from "@/utils/weather/mapWeatherIcon";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function WeatherPage() {
  const { toast } = useToast();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [weatherData, setWeatherData] =
    useState<IWeatherWithCityResponse | null>(null);
  const [forecastData, setForecastData] = useState<IForecastResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  // State cho ô tìm kiếm vị trí (đưa lên trước useEffect để không lỗi)
  const [searchValue, setSearchValue] = useState("");
  const date = new Date();
  const formattedDate = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    let watchId: number | null = null;
    // Chỉ theo dõi vị trí khi không nhập/tìm kiếm địa điểm
    if (!searchValue.trim() && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.warn("Không lấy được vị trí:", err);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const [resCurrent, resForecast] = await Promise.all([
            fetch(
              `/api/weather/location?lat=${location.lat}&lon=${location.lon}`
            ),
            fetch(
              `/api/weather/forecast/location?lat=${location.lat}&lon=${location.lon}`
            ),
          ]);
          if (!resCurrent.ok)
            throw new Error("Lỗi khi lấy dữ liệu thời tiết hiện tại");
          if (!resForecast.ok) throw new Error("Lỗi khi lấy dữ liệu dự báo");
          const dataCurrent: IWeatherWithCityResponse = await resCurrent.json();
          const dataForecast: IForecastResponse = await resForecast.json();
          setWeatherData(dataCurrent);
          setForecastData(dataForecast);
        } catch (err) {
          console.error("Lỗi khi gọi API thời tiết:", err);
        }
      };
      fetchWeather();
    }
  }, [location]);

  console.log("weatherData", weatherData);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const [resCurrent, resForecast] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(searchValue.trim())}`),
        fetch(
          `/api/weather/forecast?city=${encodeURIComponent(searchValue.trim())}`
        ),
      ]);
      if (!resCurrent.ok || !resForecast.ok) {
        toast({
          title: "Không tìm thấy địa điểm",
          description: "Vui lòng kiểm tra lại tên thành phố.",
          variant: "error",
        });
        return;
      }
      const dataCurrent: IWeatherWithCityResponse = await resCurrent.json();
      const dataForecast: IForecastResponse = await resForecast.json();
      if (dataCurrent && dataForecast) {
        setWeatherData(dataCurrent);
        setForecastData(dataForecast);
      } else {
        toast({
          title: "Không lấy được vị trí địa lý",
          description: "Vui lòng thử lại với một địa điểm khác.",
          variant: "error",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi khi tìm kiếm vị trí",
        description: "Đã xảy ra lỗi khi tìm kiếm vị trí thời tiết.",
        variant: "error",
      });
      console.error("Lỗi khi gọi API tìm kiếm vị trí:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      {/* Ô tìm kiếm vị trí */}
      <div className="mb-4 flex w-full max-w-md items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm dark:bg-gray-900">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-base text-gray-800 dark:text-gray-100"
          placeholder="Nhập tên địa điểm (ví dụ: Hà Nội, Cần Thơ, ... )"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          type="button"
          className="ml-2 text-green-700 hover:text-green-900 text-xl dark:text-green-300 dark:hover:text-green-100"
          aria-label="Tìm kiếm vị trí"
          title="Tìm kiếm vị trí"
          disabled={!searchValue.trim() || loading}
          onClick={handleSearch}
        >
          <Search className="size-5" />
        </button>
        {/* Nút clear nội dung tìm kiếm */}
        {searchValue && (
          <button
            type="button"
            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Xóa tìm kiếm"
            title="Xóa tìm kiếm"
            onClick={() => setSearchValue("")}
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="mb-8 grid gap-3 lg:grid-cols-4">
        {/* Hiển thị thời tiết hôm nay */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Hôm nay
            </CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center min-h-[220px] justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-300">
                  <LoadingSpinner />
                  <span>Đang tải dữ liệu thời tiết...</span>
                </div>
              ) : weatherData ? (
                <>
                  {mapWeatherIcon(weatherData.weather[0].icon)}
                  <div className="mt-4 text-4xl font-bold">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                  <div className="mt-1 text-lg capitalize">
                    {weatherData.weather[0].description}
                  </div>
                  <div className="mt-4 grid w-full grid-cols-2 text-sm">
                    <div className="flex items-center">
                      <Droplets className="mr-1 h-4 w-4 text-blue-500" />
                      <span>Độ ẩm: {weatherData.main.humidity}%</span>
                    </div>
                    <div className="flex items-center whitespace-nowrap">
                      <Wind className="mr-1 h-4 w-4 shrink-0" />
                      <span className="">
                        Gió: {weatherData.wind.speed} km/h
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CloudRain className="mr-1 h-4 w-4 text-blue-500" />
                      <span>Mây: {weatherData.clouds.all}%</span>
                    </div>
                    <div className="flex items-center whitespace-nowrap">
                      <Sun className="mr-1 h-4 w-4 text-yellow-500 shrink-0" />
                      <span>Áp suất: {weatherData.main.pressure} hPa</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {weatherData.name}
                  </div>
                </>
              ) : (
                <div>Chưa có dữ liệu thời tiết.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hiển thị dự báo thời tiết 5 ngày */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Dự báo những ngày tới
            </CardTitle>
            <CardDescription>
              {forecastData && forecastData.list.length > 0
                ? (() => {
                    const dt = forecastData.list[0].dt_txt;
                    const date = new Date(dt.replace(/-/g, "/"));
                    return `Cập nhật lúc ${date.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                  })()
                : "Đang cập nhật..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <LoadingSpinner />
                <span>Đang tải dữ liệu thời tiết...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {forecastData
                  ? getDailyForecasts(forecastData).map((day) => (
                      <div
                        key={day.date}
                        className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <div className="font-medium">{day.day}</div>
                        <div className="text-xs text-gray-500">{day.date}</div>
                        <div className="my-2">{mapWeatherIcon(day.icon)}</div>
                        <div className="flex gap-2 text-sm">
                          <span className="font-medium">{day.high}°</span>
                          <span className="text-gray-500">{day.low}°</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {day.description}
                        </div>
                      </div>
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center rounded-lg p-2 text-center opacity-50"
                      >
                        <div className="font-medium">--</div>
                        <div className="text-xs text-gray-500">--/--</div>
                        <div className="my-2">{mapWeatherIcon("")}</div>
                        <div className="flex gap-2 text-sm">
                          <span className="font-medium">--°</span>
                          <span className="text-gray-500">--°</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">--</div>
                      </div>
                    ))}
              </div>
            )}
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
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Biểu đồ nhiệt độ
              </CardTitle>
              <CardDescription>Dự báo nhiệt độ những ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="temperature" forcast={forecastData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainfall" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Biểu đồ lượng mưa
              </CardTitle>
              <CardDescription>Dự báo lượng mưa những ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="rainfall" forcast={forecastData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humidity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Biểu đồ độ ẩm
              </CardTitle>
              <CardDescription>Dự báo độ ẩm những ngày tới</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="humidity" forcast={forecastData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wind" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                Biểu đồ gió
              </CardTitle>
              <CardDescription>
                Dự báo tốc độ gió những ngày tới
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <WeatherForecastChart type="wind" forcast={forecastData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Lời khuyên cho nông dân
            </CardTitle>
            <CardDescription>
              Dựa trên dự báo thời tiết hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Sun className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                <span>
                  Nên tưới nước vào buổi sáng sớm hoặc chiều tối để giảm lượng
                  nước bốc hơi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CloudRain className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                <span>
                  Dự báo có mưa vào cuối tuần, nên lên kế hoạch thu hoạch trước
                  thời điểm này.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Wind className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>
                  Gió mạnh vào thứ Tư, cần gia cố các công trình nhà lưới, nhà
                  kính.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                <span>
                  Độ ẩm cao, cần chú ý phòng trừ các bệnh nấm và thối rễ.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Cảnh báo thời tiết
            </CardTitle>
            <CardDescription>Các hiện tượng thời tiết cực đoan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
              <div className="mb-2 flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                  Cảnh báo mưa lớn
                </h3>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Dự báo có mưa lớn vào cuối tuần tại khu vực Đồng bằng sông Cửu
                Long. Lượng mưa có thể đạt 50-70mm. Nông dân cần chủ động các
                biện pháp phòng tránh ngập úng.
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-orange-50 p-4 dark:bg-orange-950">
              <div className="mb-2 flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-medium text-orange-800 dark:text-orange-300">
                  Cảnh báo nắng nóng
                </h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Nhiệt độ cao nhất trong 3 ngày tới có thể lên đến 35-37°C. Nông
                dân cần bổ sung nước cho cây trồng và tránh làm việc ngoài trời
                vào giờ nắng gắt (11h-15h).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Xử lý dữ liệu dự báo 5 ngày: lấy 1 mốc đại diện/ngày, nhiệt độ cao/thấp nhất, icon, mô tả
function getDailyForecasts(forecast: IForecastResponse) {
  // Group các bản ghi theo ngày (YYYY-MM-DD)
  const groups: Record<string, typeof forecast.list> = {};
  forecast.list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
  });
  // Lấy 5 ngày đầu tiên, nhưng bỏ ngày đầu tiên (ngày hiện tại)
  const days = Object.keys(groups).slice(1, 6);
  return days.map((dayStr) => {
    const items = groups[dayStr];
    // Tìm mốc gần 12:00 nhất
    let target = items[0];
    let minDiff = Infinity;
    for (const item of items) {
      const hour = Number(item.dt_txt.split(" ")[1].split(":")[0]);
      const diff = Math.abs(hour - 12);
      if (diff < minDiff) {
        minDiff = diff;
        target = item;
      }
    }
    console.log("target WeatherPage", target);
    // Tìm nhiệt độ cao/thấp nhất trong ngày
    const high = Math.round(Math.max(...items.map((i) => i.main.temp_max)));
    const low = Math.round(Math.min(...items.map((i) => i.main.temp_min)));
    // Lấy mô tả/icon từ mốc đại diện
    const description = target.weather[0].description;
    const icon = target.weather[0].icon;
    // Lấy thứ/ngày
    const dateObj = new Date(target.dt * 1000);
    const day = dateObj.toLocaleDateString("vi-VN", { weekday: "short" });
    const date = dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    return { day, date, high, low, description, icon };
  });
}
