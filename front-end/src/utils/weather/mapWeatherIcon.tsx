// src/utils/mapWeatherIcon.tsx
import React, { ReactElement } from "react";
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudSun,
  CloudMoon,
} from "lucide-react";

/**
 * Map icon code của OpenWeather sang icon Lucide React
 * @param iconCode Ví dụ: "01d", "04n"
 */
export function mapWeatherIcon(iconCode: string) {
  const map: Record<string, ReactElement> = {
    // Trời quang
    "01d": <Sun className="size-24 text-yellow-500" />,
    "01n": <Moon className="size-24 text-gray-300" />,

    // Ít mây
    "02d": <CloudSun className="size-24 text-yellow-400" />,
    "02n": <CloudMoon className="size-24 text-gray-300" />,

    // Mây vừa
    "03d": <Cloud className="size-24 text-gray-400" />,
    "03n": <Cloud className="size-24 text-gray-500" />,

    // Mây dày
    "04d": <Cloud className="size-24 text-gray-500" />,
    "04n": <Cloud className="size-24 text-gray-600" />,

    // Mưa
    "09d": <CloudDrizzle className="size-24 text-blue-400" />,
    "09n": <CloudDrizzle className="size-24 text-blue-300" />,
    "10d": <CloudRain className="size-24 text-blue-500" />,
    "10n": <CloudRain className="size-24 text-blue-400" />,

    // Dông
    "11d": <CloudLightning className="size-24 text-yellow-300" />,
    "11n": <CloudLightning className="size-24 text-yellow-200" />,

    // Tuyết
    "13d": <CloudSnow className="size-24 text-blue-200" />,
    "13n": <CloudSnow className="size-24 text-blue-100" />,

    // Sương mù
    "50d": <CloudFog className="size-24 text-gray-400" />,
    "50n": <CloudFog className="size-24 text-gray-500" />,
  };

  return map[iconCode] || <Cloud size={32} />; // fallback icon
}
