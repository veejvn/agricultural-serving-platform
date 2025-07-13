import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, LineChart } from "lucide-react"
import Link from "next/link"

export default function MarketPriceWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-green-800 dark:text-green-300">Giá cả thị trường</CardTitle>
        <CardDescription>Cập nhật ngày 11/05/2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm">
                  <th className="pb-2 font-medium">Nông sản</th>
                  <th className="pb-2 font-medium">Giá (đ/kg)</th>
                  <th className="pb-2 font-medium">Thay đổi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-2">Lúa IR50404</td>
                  <td className="py-2">7,500</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                      <span className="text-green-600">2.5%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Gạo ST25</td>
                  <td className="py-2">22,500</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                      <span className="text-green-600">1.8%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cà phê Robusta</td>
                  <td className="py-2">85,000</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                      <span className="text-red-600">0.5%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Hồ tiêu</td>
                  <td className="py-2">120,000</td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                      <span className="text-green-600">3.2%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Link
            href="/gia-ca"
            className="mt-4 flex w-full items-center justify-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-500 dark:bg-transparent dark:text-green-400 dark:hover:bg-green-950"
          >
            <LineChart className="mr-2 h-4 w-4" />
            Xem biểu đồ chi tiết
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
