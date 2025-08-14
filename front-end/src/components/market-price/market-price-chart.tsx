"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MarketPriceData {
  id: string;
  price: number;
  dateRecorded: string;
  region: string;
  product: {
    id: string;
    name: string;
    unitPrice: string;
  };
}

interface MarketPriceChartProps {
  data?: MarketPriceData[];
}

export default function MarketPriceChart({ data = [] }: MarketPriceChartProps) {
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>(
    []
  );

  useEffect(() => {
    if (data && data.length > 0) {
      // Sắp xếp dữ liệu theo ngày (từ cũ đến mới)
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(a.dateRecorded).getTime() -
          new Date(b.dateRecorded).getTime()
      );

      // Lấy tối đa 15 điểm dữ liệu gần đây nhất (không lọc thêm vì API đã cách 2 ngày sẵn)
      const recentData = sortedData.slice(-15);

      // Chuyển đổi dữ liệu cho chart
      const formattedData = recentData.map((item) => ({
        date: new Date(item.dateRecorded).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        price: item.price,
      }));

      setChartData(formattedData);
    } else {
      // Fallback to sample data if no data provided
      const fallbackData = generateChartData();
      setChartData(fallbackData);
    }
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString("vi-VN")}đ`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-medium text-sm">Ngày: {label}</div>
                      <div className="font-medium text-lg text-green-600">
                        {`${(payload[0]?.value ?? 0).toLocaleString("vi-VN")}đ`}
                        {data.length > 0 && data[0]?.product?.unitPrice && (
                          <span className="text-sm text-gray-500">
                            /{data[0].product.unitPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#16a34a"
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Hàm tạo dữ liệu mẫu cho biểu đồ
function generateChartData() {
  const dates = [
    "12/04",
    "14/04",
    "16/04",
    "18/04",
    "20/04",
    "22/04",
    "24/04",
    "26/04",
    "28/04",
    "30/04",
    "02/05",
    "04/05",
    "06/05",
    "08/05",
    "10/05",
  ];

  // Tạo dữ liệu giá với xu hướng tăng nhẹ
  let basePrice = 7100;

  return dates.map((date) => {
    // Tạo biến động giá ngẫu nhiên nhưng có xu hướng tăng
    const randomChange = Math.floor(Math.random() * 100) - 30;
    basePrice += randomChange;

    // Đảm bảo giá không giảm quá thấp
    if (basePrice < 7000) basePrice = 7000 + Math.floor(Math.random() * 100);

    return {
      date,
      price: basePrice,
    };
  });
}
