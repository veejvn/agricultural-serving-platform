import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function StatsCard({ title, value, description, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">{icon}</span>
          {trend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
          {trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
