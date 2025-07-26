"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductReviewFormProps {
  productId: string
  onReviewSubmitted: (review: {
    id: string
    productId: string
    userName: string
    rating: number
    comment: string
    date: Date
  }) => void
}

export function ProductReviewForm({ productId, onReviewSubmitted }: ProductReviewFormProps) {
  const { toast } = useToast()
  const [userName, setUserName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên của bạn",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số sao đánh giá",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung đánh giá",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Giả lập gửi đánh giá lên server
    setTimeout(() => {
      const newReview = {
        id: Math.random().toString(36).substring(2, 15), // Giả lập ID ngẫu nhiên
        productId,
        userName,
        rating,
        comment,
        date: new Date(),
      }

      onReviewSubmitted(newReview)

      // Reset form
      setUserName("")
      setRating(0)
      setComment("")
      setIsSubmitting(false)

      toast({
        title: "Thành công",
        description: "Cảm ơn bạn đã gửi đánh giá!",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Viết đánh giá của bạn</h3>

      <div className="space-y-2">
        <Label htmlFor="userName">Tên của bạn</Label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Nhập tên của bạn"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Đánh giá</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={isSubmitting}
              aria-label="button"
            >
              <Star
                className={`h-6 w-6 ${
                  (hoverRating ? star <= hoverRating : star <= rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {rating > 0 ? `${rating} sao` : "Chọn số sao"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Nội dung đánh giá</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </form>
  )
}
