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

export default function MarketPriceChart() {
  const [chartData, setChartData] = useState<unknown[]>([]);

  useEffect(() => {
    // Trong thực tế, dữ liệu này sẽ được lấy từ API
    const data = generateChartData();
    setChartData(data);
  }, []);

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
            tickFormatter={(value) => `${value}đ`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{label}</div>
                      <div className="font-medium text-right">{`${(payload[0]?.value ?? 0).toLocaleString(
                        "vi-VN"
                      )}đ`}</div>
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
