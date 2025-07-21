import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ForumPreview() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-green-800 dark:text-green-300">Diễn đàn trao đổi</CardTitle>
        <CardDescription>Chủ đề mới nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-green-50 dark:hover:bg-green-950"
            >
              <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
              <div>
                <Link href="/forum" className="font-medium text-green-800 hover:underline dark:text-green-300">
                  {topic.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{topic.author}</span>
                  <span>•</span>
                  <span>{topic.time}</span>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/forum"
            className="mt-2 block text-center text-sm font-medium text-green-600 hover:underline dark:text-green-500"
          >
            Xem tất cả chủ đề
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Dữ liệu mẫu
const recentTopics = [
  {
    title: "Kỹ thuật phòng trừ bệnh đạo ôn trên lúa",
    author: "Nguyễn Văn A",
    time: "2 giờ trước",
  },
  {
    title: "Kinh nghiệm trồng xoài cát Hòa Lộc đạt năng suất cao",
    author: "Trần Thị B",
    time: "4 giờ trước",
  },
  {
    title: "Hỏi về giống lúa chịu mặn ST25",
    author: "Lê Văn C",
    time: "6 giờ trước",
  },
]
