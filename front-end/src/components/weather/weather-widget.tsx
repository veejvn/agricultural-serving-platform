import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cloud, CloudDrizzle, Sun } from "lucide-react";
import Link from "next/link";

export default function WeatherWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-green-800 dark:text-green-300">
          Dự báo thời tiết
        </CardTitle>
        <CardDescription>Đồng bằng sông Cửu Long</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center">
            <p className="text-sm text-gray-500">Hôm nay, 11/05/2025</p>
            <div className="mt-2 flex items-center justify-center">
              <Sun className="h-12 w-12 text-yellow-500" />
              <span className="ml-2 text-3xl font-bold">32°C</span>
            </div>
            <p className="mt-1 text-lg">Nắng</p>
          </div>

          <div className="mt-4 grid w-full grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-green-50 dark:hover:bg-green-950">
              <p className="text-xs text-gray-500">12/05</p>
              <Sun className="my-1 h-8 w-8 text-yellow-500" />
              <p className="text-sm font-medium">33°C</p>
            </div>
            <div className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-green-50 dark:hover:bg-green-950">
              <p className="text-xs text-gray-500">13/05</p>
              <Cloud className="my-1 h-8 w-8 text-gray-500" />
              <p className="text-sm font-medium">31°C</p>
            </div>
            <div className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-green-50 dark:hover:bg-green-950">
              <p className="text-xs text-gray-500">14/05</p>
              <CloudDrizzle className="my-1 h-8 w-8 text-blue-500" />
              <p className="text-sm font-medium">29°C</p>
            </div>
          </div>

          <Link
            href="/weather"
            className="mt-4 text-sm font-medium text-green-600 hover:underline dark:text-green-500"
          >
            Xem dự báo chi tiết
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
