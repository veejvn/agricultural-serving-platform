import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">Sản Phẩm Nông Nghiệp</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Các sản phẩm, công cụ và vật tư nông nghiệp chất lượng cao
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input type="search" placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/gio-hang">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Giỏ hàng (0)
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="seeds">Hạt giống</TabsTrigger>
          <TabsTrigger value="fertilizers">Phân bón</TabsTrigger>
          <TabsTrigger value="pesticides">Thuốc bảo vệ thực vật</TabsTrigger>
          <TabsTrigger value="tools">Công cụ & Thiết bị</TabsTrigger>
          <TabsTrigger value="irrigation">Hệ thống tưới</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seeds" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((product) => product.category === "seeds")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="fertilizers" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((product) => product.category === "fertilizers")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pesticides" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((product) => product.category === "pesticides")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((product) => product.category === "tools")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="irrigation" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((product) => product.category === "irrigation")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 rounded-lg bg-green-50 p-6 dark:bg-green-900">
        <h2 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">
          Sản phẩm đề xuất cho mùa vụ hiện tại
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${featured ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-800"}`}
    >
      <Link href={`/san-pham/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
              -{product.discount}%
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="line-clamp-1 text-lg text-green-800 dark:text-green-300">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-lg font-bold text-green-600 dark:text-green-500">
                    {formatPrice(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-green-600 dark:text-green-500">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{product.unit}</div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}

// Định dạng giá tiền
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

// Dữ liệu mẫu
interface Product {
  id: number
  name: string
  description: string
  price: number
  discount: number
  unit: string
  image: string
  category: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Hạt giống lúa ST25",
    description: "Giống lúa thơm đạt giải gạo ngon nhất thế giới",
    price: 120000,
    discount: 0,
    unit: "1kg",
    image: "/placeholder.svg?height=300&width=300",
    category: "seeds",
  },
  {
    id: 2,
    name: "Phân bón NPK Đầu Trâu",
    description: "Phân bón tổng hợp cho cây trồng phát triển toàn diện",
    price: 250000,
    discount: 10,
    unit: "Bao 25kg",
    image: "/placeholder.svg?height=300&width=300",
    category: "fertilizers",
  },
  {
    id: 3,
    name: "Thuốc trừ sâu sinh học BT",
    description: "An toàn cho người sử dụng và môi trường",
    price: 180000,
    discount: 0,
    unit: "Chai 1L",
    image: "/placeholder.svg?height=300&width=300",
    category: "pesticides",
  },
  {
    id: 4,
    name: "Máy phun thuốc điện tử",
    description: "Tiết kiệm thuốc và thời gian phun",
    price: 1500000,
    discount: 15,
    unit: "Cái",
    image: "/placeholder.svg?height=300&width=300",
    category: "tools",
  },
  {
    id: 5,
    name: "Hệ thống tưới nhỏ giọt",
    description: "Tiết kiệm nước và tự động hóa tưới tiêu",
    price: 850000,
    discount: 0,
    unit: "Bộ 100m²",
    image: "/placeholder.svg?height=300&width=300",
    category: "irrigation",
  },
  {
    id: 6,
    name: "Hạt giống rau muống",
    description: "Giống rau phát triển nhanh, năng suất cao",
    price: 25000,
    discount: 0,
    unit: "100g",
    image: "/placeholder.svg?height=300&width=300",
    category: "seeds",
  },
  {
    id: 7,
    name: "Phân hữu cơ vi sinh",
    description: "Cải tạo đất và bổ sung dinh dưỡng",
    price: 180000,
    discount: 5,
    unit: "Bao 10kg",
    image: "/placeholder.svg?height=300&width=300",
    category: "fertilizers",
  },
  {
    id: 8,
    name: "Thuốc phòng bệnh đạo ôn",
    description: "Phòng trừ hiệu quả bệnh đạo ôn trên lúa",
    price: 220000,
    discount: 0,
    unit: "Gói 500g",
    image: "/placeholder.svg?height=300&width=300",
    category: "pesticides",
  },
]
