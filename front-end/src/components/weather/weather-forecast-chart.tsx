"use client";

import { IForecastResponse } from "@/types/weather";
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
  forcast: IForecastResponse | null;
  type: "temperature" | "rainfall" | "humidity" | "wind";
  data?: Array<{ day: string; value: number }>;
}

export default function WeatherForecastChart({
  forcast,
  type,
  data,
}: WeatherForecastChartProps) {
  // Nếu có data từ props thì dùng, không thì để []
  const chartData = data || buildChartData(forcast, type);

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

// Hàm tạo dữ liệu biểu đồ từ forecastData (dạng daily)
export function buildChartData(
  forecast: IForecastResponse | null,
  type: "temperature" | "rainfall" | "humidity" | "wind"
): Array<{ day: string; value: number }> {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return [];
  }
  // Group các bản ghi theo ngày (YYYY-MM-DD)
  const groups: Record<string, typeof forecast.list> = {};
  forecast.list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
  });
  // Lấy 5 ngày đầu tiên
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
    console.log("target WeatherForecastChart", target);
    const dateObj = new Date(target.dt * 1000);
    const day = dateObj.toLocaleDateString("vi-VN", { weekday: "short" });
    let value = 0;
    switch (type) {
      case "temperature":
        value = Math.round(target.main.temp);
        break;
      case "rainfall":
        value = target.rain?.["3h"] || 0;
        break;
      case "humidity":
        value = target.main.humidity;
        break;
      case "wind":
        value = target.wind.speed;
        break;
      default:
        value = 0;
    }
    return { day, value };
  });
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
