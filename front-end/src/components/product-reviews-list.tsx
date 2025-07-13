import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export interface Review {
  id: number
  productId: number
  userName: string
  rating: number
  comment: string
  date: Date
}

interface ProductReviewsListProps {
  reviews: Review[]
}

export function ProductReviewsList({ reviews }: ProductReviewsListProps) {
  // Hàm định dạng ngày tháng
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Lấy chữ cái đầu của tên người dùng
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {getInitials(review.userName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{review.userName}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.date)}</span>
                </div>

                <div className="mt-1 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-3 text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
