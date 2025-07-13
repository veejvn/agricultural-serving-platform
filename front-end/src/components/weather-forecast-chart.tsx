"use client";

import React, { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeatherForecastChartProps {
  type: "temperature" | "rainfall" | "humidity" | "wind";
}

export default function WeatherForecastChart({
  type,
}: WeatherForecastChartProps) {
  const [chartData, setChartData] = useState<unknown[]>([]);

  useEffect(() => {
    // Trong thực tế, dữ liệu này sẽ được lấy từ API
    const data = generateChartData(type);
    setChartData(data);
  }, [type]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="day"
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
            tickFormatter={(value) => `${value}${getUnit(type)}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">{label}</div>
                      <div className="font-medium text-right">{`${
                        payload[0].value
                      }${getUnit(type)}`}</div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            stroke={getLineColor(type)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Hàm tạo dữ liệu mẫu cho biểu đồ
function generateChartData(type: string) {
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

  switch (type) {
    case "temperature":
      return days.map((day, index) => ({
        day,
        value: Math.floor(Math.random() * 5) + 28 - (index % 3), // 28-32°C
      }));
    case "rainfall":
      return days.map((day, index) => ({
        day,
        value:
          index > 3
            ? Math.floor(Math.random() * 30) + 5
            : Math.floor(Math.random() * 5), // Tăng lượng mưa vào cuối tuần
      }));
    case "humidity":
      return days.map((day) => ({
        day,
        value: Math.floor(Math.random() * 15) + 70, // 70-85%
      }));
    case "wind":
      return days.map((day) => ({
        day,
        value: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
      }));
    default:
      return [];
  }
}

// Lấy đơn vị đo tương ứng với loại dữ liệu
function getUnit(type: string) {
  switch (type) {
    case "temperature":
      return "°C";
    case "rainfall":
      return "mm";
    case "humidity":
      return "%";
    case "wind":
      return "km/h";
    default:
      return "";
  }
}

// Lấy màu đường cho từng loại biểu đồ
function getLineColor(type: string) {
  switch (type) {
    case "temperature":
      return "#ef4444"; // red-500
    case "rainfall":
      return "#3b82f6"; // blue-500
    case "humidity":
      return "#22c55e"; // green-500
    case "wind":
      return "#a855f7"; // purple-500
    default:
      return "#6b7280"; // gray-500
  }
}
