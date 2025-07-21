import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-6 rounded-full bg-green-100 p-6 dark:bg-green-900">
        <ShoppingBag className="h-12 w-12 text-green-600 dark:text-green-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-green-800 dark:text-green-300">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="mb-8 max-w-md text-center text-gray-600 dark:text-gray-400">
        Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng. Hãy khám phá
        các sản phẩm nông nghiệp chất lượng cao của chúng tôi.
      </p>
      <div className="mb-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg border p-4 text-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Phân bón"
            width={80}
            height={80}
            className="mb-4"
          />
          <h3 className="mb-1 font-medium text-green-800 dark:text-green-300">
            Phân bón
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Các loại phân bón chất lượng cao
          </p>
          <Button
            variant="outline"
            className="mt-auto border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/product?category=fertilizers">Xem ngay</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-4 text-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Hạt giống"
            width={80}
            height={80}
            className="mb-4"
          />
          <h3 className="mb-1 font-medium text-green-800 dark:text-green-300">
            Hạt giống
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Các loại hạt giống năng suất cao
          </p>
          <Button
            variant="outline"
            className="mt-auto border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/product?category=seeds">Xem ngay</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-4 text-center sm:col-span-2 lg:col-span-1">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Thuốc bảo vệ thực vật"
            width={80}
            height={80}
            className="mb-4"
          />
          <h3 className="mb-1 font-medium text-green-800 dark:text-green-300">
            Thuốc bảo vệ thực vật
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Các loại thuốc an toàn và hiệu quả
          </p>
          <Button
            variant="outline"
            className="mt-auto border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
            asChild
          >
            <Link href="/product?category=pesticides">Xem ngay</Link>
          </Button>
        </div>
      </div>
      <Button
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        size="lg"
        asChild
      >
        <Link href="/product">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Mua sắm ngay
        </Link>
      </Button>
    </div>
  );
}
