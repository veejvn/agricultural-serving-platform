import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, ThumbsUp, Eye, Clock, Filter, PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 sm:text-4xl">Diễn Đàn Nông Nghiệp</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Kết nối, chia sẻ kinh nghiệm và giải đáp thắc mắc
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input type="search" placeholder="Tìm kiếm bài viết..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
          >
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="popular">Phổ biến</TabsTrigger>
          <TabsTrigger value="unanswered">Chưa trả lời</TabsTrigger>
          <TabsTrigger value="rice">Lúa gạo</TabsTrigger>
          <TabsTrigger value="fruit">Cây ăn trái</TabsTrigger>
          <TabsTrigger value="vegetable">Rau màu</TabsTrigger>
          <TabsTrigger value="livestock">Chăn nuôi</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-6">
            {forumPosts.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.views > 100)
              .sort((a, b) => b.views - a.views)
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="unanswered" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.replies === 0)
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rice" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.categories.includes("Lúa gạo"))
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="fruit" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.categories.includes("Cây ăn trái"))
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="vegetable" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.categories.includes("Rau màu"))
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="livestock" className="mt-0">
          <div className="space-y-6">
            {forumPosts
              .filter((post) => post.categories.includes("Chăn nuôi"))
              .map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center justify-center">
        <Button
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950"
        >
          Xem thêm bài viết
        </Button>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Chủ đề nổi bật</CardTitle>
            <CardDescription>Các chủ đề được quan tâm nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800 dark:text-green-300">
                      <Link href="#" className="hover:underline">
                        {topic.title}
                      </Link>
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {topic.replies} bình luận
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {topic.views} lượt xem
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Thành viên tích cực</CardTitle>
            <CardDescription>Những người đóng góp nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800 dark:text-green-300">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.posts} bài viết</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-600 text-green-600 dark:border-green-500 dark:text-green-500"
                  >
                    Cấp {member.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
            >
              Xem tất cả thành viên
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function ForumPostCard({ post }: { post: ForumPost }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="hidden h-12 w-12 overflow-hidden rounded-full sm:block">
            <Image
              src={post.authorAvatar || "/placeholder.svg"}
              alt={post.author}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <Link href="#" className="hover:underline">
              <h3 className="text-xl font-medium text-green-800 dark:text-green-300">{post.title}</h3>
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center">
                Đăng bởi <span className="ml-1 font-medium text-green-600 dark:text-green-500">{post.author}</span>
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                {post.replies} bình luận
              </span>
              <span className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {post.views} lượt xem
              </span>
              <span className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                {post.likes} thích
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-gray-600 dark:text-gray-400">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Dữ liệu mẫu
interface ForumPost {
  id: number
  title: string
  author: string
  authorAvatar: string
  date: string
  excerpt: string
  categories: string[]
  replies: number
  views: number
  likes: number
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "Kỹ thuật phòng trừ bệnh đạo ôn trên lúa",
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "11/05/2025",
    excerpt:
      "Mùa vụ này, bệnh đạo ôn đang có dấu hiệu bùng phát tại nhiều vùng. Tôi muốn chia sẻ một số kinh nghiệm phòng trừ hiệu quả mà không cần dùng nhiều thuốc hóa học...",
    categories: ["Lúa gạo", "Bệnh hại"],
    replies: 15,
    views: 230,
    likes: 42,
  },
  {
    id: 2,
    title: "Kinh nghiệm trồng xoài cát Hòa Lộc đạt năng suất cao",
    author: "Trần Thị B",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "10/05/2025",
    excerpt:
      "Sau 5 năm trồng xoài cát Hòa Lộc, tôi đã rút ra được nhiều bài học quý giá về kỹ thuật canh tác, từ khâu chọn giống, chăm sóc đến thu hoạch và bảo quản...",
    categories: ["Cây ăn trái", "Kỹ thuật canh tác"],
    replies: 23,
    views: 315,
    likes: 67,
  },
  {
    id: 3,
    title: "Hỏi về giống lúa chịu mặn ST25",
    author: "Lê Văn C",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "09/05/2025",
    excerpt:
      "Tôi đang canh tác ở vùng ven biển thường xuyên bị xâm nhập mặn. Có ai đã trồng thử giống lúa ST25 trong điều kiện này chưa? Xin chia sẻ kinh nghiệm...",
    categories: ["Lúa gạo", "Giống cây trồng"],
    replies: 8,
    views: 142,
    likes: 15,
  },
  {
    id: 4,
    title: "Chia sẻ mô hình trồng rau thủy canh tại nhà",
    author: "Phạm Thị D",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "08/05/2025",
    excerpt:
      "Tôi vừa triển khai mô hình trồng rau thủy canh quy mô nhỏ tại nhà với chi phí khoảng 5 triệu đồng. Sau 2 tháng đã thu hoạch được rau sạch đủ dùng cho gia đình...",
    categories: ["Rau màu", "Nông nghiệp công nghệ cao"],
    replies: 31,
    views: 420,
    likes: 89,
  },
  {
    id: 5,
    title: "Cách phòng trị bệnh lở mồm long móng trên bò",
    author: "Hoàng Văn E",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "07/05/2025",
    excerpt:
      "Gần đây trong khu vực của tôi có dấu hiệu bùng phát bệnh lở mồm long móng trên đàn bò. Tôi muốn chia sẻ một số biện pháp phòng ngừa và điều trị hiệu quả...",
    categories: ["Chăn nuôi", "Thú y"],
    replies: 12,
    views: 198,
    likes: 37,
  },
  {
    id: 6,
    title: "Kinh nghiệm sử dụng phân bón hữu cơ cho cây ăn trái",
    author: "Trần Văn F",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "06/05/2025",
    excerpt:
      "Sau 3 năm chuyển đổi từ phân hóa học sang phân hữu cơ cho vườn cây ăn trái, tôi nhận thấy nhiều thay đổi tích cực về chất lượng đất và sức khỏe cây trồng...",
    categories: ["Cây ăn trái", "Phân bón"],
    replies: 19,
    views: 267,
    likes: 53,
  },
  {
    id: 7,
    title: "Hỏi về kỹ thuật ghép cà chua trên gốc cà tím",
    author: "Nguyễn Thị G",
    authorAvatar: "/placeholder.svg?height=48&width=48",
    date: "05/05/2025",
    excerpt:
      "Tôi mới đọc được thông tin về kỹ thuật ghép cà chua trên gốc cà tím để tăng sức chống chịu bệnh và năng suất. Có ai đã thử kỹ thuật này chưa?",
    categories: ["Rau màu", "Kỹ thuật canh tác"],
    replies: 0,
    views: 87,
    likes: 5,
  },
]

interface HotTopic {
  title: string
  replies: number
  views: number
}

const hotTopics: HotTopic[] = [
  {
    title: "Kinh nghiệm trồng lúa ST25 đạt năng suất cao",
    replies: 45,
    views: 780,
  },
  {
    title: "Cách phòng trừ sâu đục thân trên cây mía",
    replies: 38,
    views: 650,
  },
  {
    title: "Mô hình VAC mang lại hiệu quả kinh tế cao",
    replies: 32,
    views: 590,
  },
  {
    title: "Kỹ thuật nuôi tôm thẻ chân trắng trong môi trường nước lợ",
    replies: 29,
    views: 520,
  },
  {
    title: "Ứng dụng IoT trong nông nghiệp thông minh",
    replies: 27,
    views: 510,
  },
]

interface ActiveMember {
  name: string
  avatar: string
  posts: number
  level: number
}

const activeMembers: ActiveMember[] = [
  {
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 156,
    level: 5,
  },
  {
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 132,
    level: 4,
  },
  {
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 98,
    level: 4,
  },
  {
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 87,
    level: 3,
  },
  {
    name: "Hoàng Văn E",
    avatar: "/placeholder.svg?height=40&width=40",
    posts: 75,
    level: 3,
  },
]
