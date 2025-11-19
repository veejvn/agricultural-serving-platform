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
import { useEffect, useMemo, useState } from "react";
import MarketPriceService from "@/services/marketPrice.service";
import { IMarkerPriceResponse } from "@/types/market-price";
import { IProductMarketPriceResponse } from "@/types/product";

export default function MarketPricePage() {
  const [marketPrices, setMarketPrices] = useState<IMarkerPriceResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<IProductMarketPriceResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>(
    "dong-bang-song-cuu-long"
  );
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const today = new Date().toLocaleDateString("vi-VN");

  // Lọc products theo category được chọn
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    const products = marketPrices
      .filter((item) => item.product.category === selectedCategory)
      .map((item) => item.product);

    // Loại bỏ duplicates dựa trên product.id
    const uniqueProducts = products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    return uniqueProducts;
  }, [marketPrices, selectedCategory]);

  // Lọc marketPrices theo category, region và product được chọn
  const filteredMarketPrices = useMemo(() => {
    return marketPrices.filter(
      (item) =>
        (selectedCategory
          ? item.product.category === selectedCategory
          : true) &&
        (selectedRegion ? item.region === selectedRegion : true) &&
        (selectedProduct ? item.product.id === selectedProduct : true)
    );
  }, [marketPrices, selectedCategory, selectedRegion, selectedProduct]);

  // Lọc marketPrices theo selectedProduct
  const selectedProductMarketPrices = useMemo(() => {
    if (!selectedProduct) return [];
    return marketPrices.filter(
      (item) =>
        item.product.id === selectedProduct &&
        (selectedRegion ? item.region === selectedRegion : true)
    );
  }, [marketPrices, selectedProduct, selectedRegion]);

  // Tính toán giá hiện tại, cao nhất, thấp nhất cho sản phẩm được chọn
  const productPriceStats = useMemo(() => {
    if (selectedProductMarketPrices.length === 0) {
      return {
        currentPrice: null,
        highestPrice: null,
        lowestPrice: null,
        currentProduct: null,
      };
    }

    // Sắp xếp theo ngày để lấy giá hiện tại (mới nhất)
    const sortedByDate = [...selectedProductMarketPrices].sort(
      (a, b) =>
        new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime()
    );

    const currentPrice = sortedByDate[0];

    // Tính giá cao nhất và thấp nhất trong 15 ngày qua
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const last15DaysPrices = selectedProductMarketPrices.filter(
      (item) => new Date(item.dateRecorded) >= fifteenDaysAgo
    );

    const highestPrice = last15DaysPrices.reduce(
      (max, item) => (item.price > max.price ? item : max),
      last15DaysPrices[0]
    );

    const lowestPrice = last15DaysPrices.reduce(
      (min, item) => (item.price < min.price ? item : min),
      last15DaysPrices[0]
    );

    return {
      currentPrice,
      highestPrice,
      lowestPrice,
      currentProduct: currentPrice?.product,
    };
  }, [selectedProductMarketPrices]);

  // Tính toán % thay đổi so với tuần trước
  const priceChangePercentage = useMemo(() => {
    if (selectedProductMarketPrices.length < 2) return null;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Sắp xếp theo ngày
    const sortedPrices = [...selectedProductMarketPrices].sort(
      (a, b) =>
        new Date(a.dateRecorded).getTime() - new Date(b.dateRecorded).getTime()
    );

    const currentPrice = sortedPrices[sortedPrices.length - 1];

    // Tìm giá gần nhất cách đây 7 ngày
    const weekAgoPrice = sortedPrices.find(
      (price) => new Date(price.dateRecorded) <= sevenDaysAgo
    );

    if (!weekAgoPrice || !currentPrice) return null;

    const changePercent =
      ((currentPrice.price - weekAgoPrice.price) / weekAgoPrice.price) * 100;
    return parseFloat(changePercent.toFixed(1));
  }, [selectedProductMarketPrices]);

  // Tạo dữ liệu cho bảng giá từ selectedProductMarketPrices
  const tableData = useMemo(() => {
    if (selectedProductMarketPrices.length === 0) return [];

    // Sắp xếp theo ngày mới nhất trước
    const sortedData = [...selectedProductMarketPrices].sort(
      (a, b) =>
        new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime()
    );

    // Lấy tối đa 11 bản ghi gần đây nhất để có thể tính % thay đổi cho 10 bản ghi hiển thị
    const recentData = sortedData.slice(0, 11);

    // Tính toán % thay đổi cho từng ngày (chỉ lấy 10 bản ghi đầu để hiển thị)
    return recentData.slice(0, 10).map((item, index) => {
      let change = 0;
      // Kiểm tra có bản ghi trước đó không (có thể là bản ghi thứ 11)
      const previousItem = recentData[index + 1];
      if (previousItem) {
        change = ((item.price - previousItem.price) / previousItem.price) * 100;
      }

      return {
        date: new Date(item.dateRecorded).toLocaleDateString("vi-VN"),
        price: item.price.toLocaleString("vi-VN"),
        unitPrice: item.product.unitPrice,
        change: parseFloat(change.toFixed(1)),
      };
    });
  }, [selectedProductMarketPrices]);

  // Tạo dữ liệu so sánh giá các sản phẩm trong category được chọn
  const comparisonData = useMemo(() => {
    if (!selectedCategory || marketPrices.length === 0) return [];

    // Lấy tất cả sản phẩm trong category được chọn
    const categoryProducts = filteredProducts;

    return categoryProducts
      .map((product) => {
        // Lấy dữ liệu market prices cho từng sản phẩm trong khu vực được chọn
        const productPrices = marketPrices.filter(
          (item) =>
            item.product.id === product.id && item.region === selectedRegion
        );

        if (productPrices.length === 0) {
          return {
            name: product.name,
            currentPrice: 0,
            unitPrice: product.unitPrice,
            change7Days: 0,
            change15Days: 0,
          };
        }

        // Sắp xếp theo ngày
        const sortedPrices = productPrices.sort(
          (a, b) =>
            new Date(b.dateRecorded).getTime() -
            new Date(a.dateRecorded).getTime()
        );

        const currentPrice = sortedPrices[0];

        // Tính thay đổi 7 ngày
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const price7DaysAgo = sortedPrices.find(
          (price) => new Date(price.dateRecorded) <= sevenDaysAgo
        );

        let change7Days = 0;
        if (price7DaysAgo) {
          change7Days =
            ((currentPrice.price - price7DaysAgo.price) / price7DaysAgo.price) *
            100;
        }

        // Tính thay đổi 15 ngày
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const price15DaysAgo = sortedPrices.find(
          (price) => new Date(price.dateRecorded) <= fifteenDaysAgo
        );

        let change15Days = 0;
        if (price15DaysAgo) {
          change15Days =
            ((currentPrice.price - price15DaysAgo.price) /
              price15DaysAgo.price) *
            100;
        }

        return {
          name: product.name,
          currentPrice: currentPrice.price,
          unitPrice: product.unitPrice,
          change7Days: parseFloat(change7Days.toFixed(1)),
          change15Days: parseFloat(change15Days.toFixed(1)),
        };
      })
      .filter((item) => item.currentPrice > 0); // Chỉ hiển thị sản phẩm có giá
  }, [filteredProducts, marketPrices, selectedCategory, selectedRegion]);

  //console.log("Filtered Market Prices:", filteredMarketPrices);

  useEffect(() => {
    async function fetchMarketPrices() {
      try {
        const [marketPriceRes, error] =
          await MarketPriceService.getAllMarketPrices();
        if (error) {
          console.error("Error fetching market prices:", error);
          return;
        }
        setMarketPrices(marketPriceRes);
        // Lấy danh sách category duy nhất từ marketPrices
        const uniqueCategories = Array.from(
          new Set(
            marketPriceRes.map(
              (item: IMarkerPriceResponse) => item.product.category
            )
          )
        );
        setCategories(uniqueCategories as string[]);

        // Set category đầu tiên làm mặc định
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0] as string);
        }
      } catch (error) {
        console.error("Error fetching market prices:", error);
      }
    }

    fetchMarketPrices();
  }, []);

  // Auto-select first product when filteredProducts changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      // Reset selectedProduct when category changes or set first product
      setSelectedProduct(filteredProducts[0].id);
    } else {
      setSelectedProduct("");
    }
  }, [filteredProducts]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">
          Giá Cả Thị Trường
        </h1>
        {/* <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Theo dõi biến động giá nông sản theo thời gian thực
        </p> */}
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Hôm nay ngày {today}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-48">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nông sản" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dong-bang-song-cuu-long">
                  Đồng bằng sông Cửu Long
                </SelectItem>
                <SelectItem value="dong-nam-bo">Đông Nam Bộ</SelectItem>
                <SelectItem value="tay-nguyen">Tây Nguyên</SelectItem>
                <SelectItem value="dong-bang-song-hong">
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
              {productPriceStats.currentPrice
                ? `${productPriceStats.currentPrice.price.toLocaleString()} đ/${
                    productPriceStats.currentPrice.product.unitPrice
                  }`
                : "Đang tải..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {priceChangePercentage !== null ? (
                <>
                  {priceChangePercentage >= 0 ? (
                    <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      priceChangePercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {priceChangePercentage >= 0 ? "+" : ""}
                    {priceChangePercentage}% so với tuần trước
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  {productPriceStats.currentProduct
                    ? productPriceStats.currentProduct.name
                    : "Chưa chọn sản phẩm"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Giá cao nhất (15 ngày)</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              {productPriceStats.highestPrice
                ? `${productPriceStats.highestPrice.price.toLocaleString()} đ/${
                    productPriceStats.highestPrice.product.unitPrice
                  }`
                : "Đang tải..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {productPriceStats.highestPrice
                  ? new Date(
                      productPriceStats.highestPrice.dateRecorded
                    ).toLocaleDateString("vi-VN")
                  : "Đang tải..."}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Giá thấp nhất (15 ngày)</CardDescription>
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              {productPriceStats.lowestPrice
                ? `${productPriceStats.lowestPrice.price.toLocaleString()} đ/${
                    productPriceStats.lowestPrice.product.unitPrice
                  }`
                : "Đang tải..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {productPriceStats.lowestPrice
                  ? new Date(
                      productPriceStats.lowestPrice.dateRecorded
                    ).toLocaleDateString("vi-VN")
                  : "Đang tải..."}
              </span>
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
                {productPriceStats.currentProduct
                  ? `Biểu đồ giá ${productPriceStats.currentProduct.name}`
                  : "Biểu đồ giá sản phẩm"}
              </CardTitle>
              <CardDescription>Biến động giá 15 ngày qua</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <MarketPriceChart data={selectedProductMarketPrices} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 dark:text-green-300">
                {productPriceStats.currentProduct
                  ? `Bảng giá ${productPriceStats.currentProduct.name}`
                  : "Bảng giá sản phẩm"}
              </CardTitle>
              <CardDescription>
                {productPriceStats.currentPrice
                  ? `Cập nhật ngày ${new Date(
                      productPriceStats.currentPrice.dateRecorded
                    ).toLocaleDateString("vi-VN")}`
                  : "Cập nhật ngày 11/05/2025"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Ngày</th>
                      <th className="py-3 text-left font-medium">
                        Giá (
                        {productPriceStats.currentProduct?.unitPrice ||
                          "đơn vị"}
                        )
                      </th>
                      <th className="py-3 text-left font-medium">Biến động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr key={`${item.date}-${index}`} className="border-b">
                          <td className="py-3">{item.date}</td>
                          <td className="py-3">{item.price} đ</td>
                          <td className="py-3">
                            <div className="flex items-center">
                              {item.change > 0 ? (
                                <>
                                  <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                                  <span className="text-green-600">
                                    +{item.change}%
                                  </span>
                                </>
                              ) : item.change < 0 ? (
                                <>
                                  <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                                  <span className="text-red-600">
                                    {item.change}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500">0%</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-gray-500"
                        >
                          Không có dữ liệu để hiển thị
                        </td>
                      </tr>
                    )}
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

      <div className="mt-12 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              {selectedCategory
                ? `So sánh giá các loại ${selectedCategory.toLowerCase()}`
                : "So sánh giá sản phẩm"}
            </CardTitle>
            <CardDescription>
              {selectedRegion && comparisonData.length > 0
                ? `Khu vực: ${
                    selectedRegion === "dong-bang-song-cuu-long"
                      ? "Đồng bằng sông Cửu Long"
                      : selectedRegion === "tay-nguyen"
                      ? "Tây Nguyên"
                      : selectedRegion === "dong-nam-bo"
                      ? "Đông Nam Bộ"
                      : selectedRegion === "dong-bang-song-hong"
                      ? "Đồng bằng sông Hồng"
                      : selectedRegion
                  }`
                : `Cập nhật ngày ${today}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">Sản phẩm</th>
                    <th className="py-3 text-left font-medium">Giá hiện tại</th>
                    <th className="py-3 text-left font-medium">
                      Thay đổi 7 ngày
                    </th>
                    <th className="py-3 text-left font-medium">
                      Thay đổi 15 ngày
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.length > 0 ? (
                    comparisonData.map((item, index) => (
                      <tr key={`${item.name}-${index}`} className="border-b">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">
                          {item.currentPrice.toLocaleString("vi-VN")} đ/
                          {item.unitPrice}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {item.change7Days > 0 ? (
                              <>
                                <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  +{item.change7Days}%
                                </span>
                              </>
                            ) : item.change7Days < 0 ? (
                              <>
                                <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {item.change7Days}%
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500">0%</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {item.change15Days > 0 ? (
                              <>
                                <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  +{item.change15Days}%
                                </span>
                              </>
                            ) : item.change15Days < 0 ? (
                              <>
                                <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {item.change15Days}%
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500">0%</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        Không có dữ liệu để so sánh
                      </td>
                    </tr>
                  )}
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
