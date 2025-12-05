"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Frown, // Add Frown icon for "not found" state
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/contants/router";
import ProductService from "@/services/product.service";
import type { IProductResponse } from "@/types/product";
import { ProductReviewForm } from "@/components/product/product-review-form";
import {
  ProductReviewsList,
  type Review,
} from "@/components/product/product-reviews-list";
import LoadingSpinner from "@/components/common/loading-spinner";

// Định dạng giá tiền
function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

const products = [
  {
    id: 1,
    name: "Hạt giống lúa ST25",
    description: "Giống lúa thơm đạt giải gạo ngon nhất thế giới",
    longDescription:
      "Hạt giống lúa ST25 là giống lúa thơm cao cấp đã đạt giải gạo ngon nhất thế giới năm 2019. Giống lúa này có đặc điểm nổi bật là hạt dài, thon, trong mờ và có mùi thơm tự nhiên đặc trưng. Khi nấu chín, cơm mềm, dẻo và giữ được hương thơm lâu.",
    price: 120000,
    discount: 0,
    unit: "1kg",
    image: "/placeholder.svg?height=600&width=600",
    category: "seeds",
    stock: 50,
    rating: 4.8,
    reviews: 124,
    specifications: {
      "Xuất xứ": "Việt Nam",
      "Thời gian sinh trưởng": "95-105 ngày",
      "Năng suất trung bình": "7-8 tấn/ha",
      "Khả năng chống chịu": "Chống đổ tốt, kháng rầy nâu, đạo ôn",
      "Phù hợp với": "Vùng đồng bằng sông Cửu Long, đồng bằng sông Hồng",
    },
    usage:
      "Ngâm hạt trong nước sạch 24 giờ trước khi gieo. Lượng giống khuyến cáo: 40-50kg/ha. Bón lót trước khi gieo với phân hữu cơ và NPK. Duy trì mực nước phù hợp theo từng giai đoạn sinh trưởng.",
  },
  {
    id: 2,
    name: "Phân bón NPK Đầu Trâu",
    description: "Phân bón tổng hợp cho cây trồng phát triển toàn diện",
    longDescription:
      "Phân bón NPK Đầu Trâu là loại phân bón tổng hợp cung cấp đầy đủ các dưỡng chất thiết yếu cho cây trồng. Sản phẩm được sản xuất theo công nghệ tiên tiến, giúp cây trồng hấp thụ nhanh và hiệu quả các chất dinh dưỡng, từ đó phát triển khỏe mạnh, tăng năng suất và chất lượng nông sản.",
    price: 250000,
    discount: 10,
    unit: "Bao 25kg",
    image: "/placeholder.svg?height=600&width=600",
    category: "fertilizers",
    stock: 100,
    rating: 4.5,
    reviews: 89,
    specifications: {
      "Thành phần": "N:P:K = 16:16:8 + TE",
      "Dạng phân": "Hạt",
      "Xuất xứ": "Việt Nam",
      "Thời hạn sử dụng": "36 tháng kể từ ngày sản xuất",
      "Bảo quản": "Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp",
    },
    usage:
      "Bón lót: 70% lượng phân trước khi gieo trồng. Bón thúc: 30% lượng phân còn lại chia làm 2-3 lần bón vào các thời kỳ sinh trưởng quan trọng. Liều lượng tùy thuộc vào loại cây trồng, tham khảo hướng dẫn chi tiết trên bao bì.",
  },
  {
    id: 3,
    name: "Thuốc trừ sâu sinh học BT",
    description: "An toàn cho người sử dụng và môi trường",
    longDescription:
      "Thuốc trừ sâu sinh học BT là sản phẩm được chiết xuất từ vi khuẩn Bacillus thuringiensis, có khả năng tiêu diệt hiệu quả các loại sâu hại như sâu xanh, sâu keo, sâu tơ, sâu róm... mà không gây hại cho thiên địch, ong mật và các sinh vật có ích khác. Sản phẩm an toàn cho người sử dụng, không gây ô nhiễm môi trường và không để lại dư lượng độc hại trên nông sản.",
    price: 180000,
    discount: 0,
    unit: "Chai 1L",
    image: "/placeholder.svg?height=600&width=600",
    category: "pesticides",
    stock: 75,
    rating: 4.7,
    reviews: 56,
    specifications: {
      "Thành phần chính": "Bacillus thuringiensis 10^9 CFU/ml",
      "Dạng thuốc": "Dạng lỏng đậm đặc",
      "Xuất xứ": "Việt Nam",
      "Thời hạn sử dụng": "24 tháng kể từ ngày sản xuất",
      "Phổ tác động": "Sâu ăn lá, sâu đục quả, sâu đục thân",
    },
    usage:
      "Pha với nước sạch theo tỷ lệ 10-15ml/bình 16L. Phun đều lên toàn bộ tán lá, đặc biệt là mặt dưới lá nơi sâu thường trú ngụ. Phun vào buổi chiều mát để tránh ánh nắng làm giảm hiệu quả của thuốc. Phun định kỳ 7-10 ngày/lần hoặc khi phát hiện sâu hại.",
  },
  {
    id: 4,
    name: "Máy phun thuốc điện tử",
    description: "Tiết kiệm thuốc và thời gian phun",
    longDescription:
      "Máy phun thuốc điện tử là thiết bị hiện đại giúp nông dân phun thuốc bảo vệ thực vật một cách hiệu quả và tiết kiệm. Máy được trang bị động cơ mạnh mẽ, bình chứa dung tích lớn và hệ thống phun áp lực cao, giúp phun thuốc đều và mịn, tiết kiệm thuốc và thời gian. Thiết kế nhẹ nhàng, tiện lợi, dễ sử dụng và bảo dưỡng.",
    price: 1500000,
    discount: 15,
    unit: "Cái",
    image: "/placeholder.svg?height=600&width=600",
    category: "tools",
    stock: 30,
    rating: 4.6,
    reviews: 42,
    specifications: {
      "Dung tích bình": "16L",
      "Công suất": "12V/8AH",
      "Thời gian sạc": "8-10 giờ",
      "Thời gian sử dụng": "4-6 giờ liên tục",
      "Áp lực phun": "0.15-0.4 MPa",
      "Trọng lượng": "3.5kg (không bao gồm dung dịch)",
      "Phụ kiện đi kèm": "Dây đeo, vòi phun, bộ sạc",
    },
    usage:
      "Sạc đầy pin trước khi sử dụng. Pha thuốc theo đúng nồng độ khuyến cáo. Điều chỉnh áp lực phun phù hợp với loại cây trồng và thuốc sử dụng. Sau khi sử dụng, xả sạch thuốc còn lại và rửa kỹ bình chứa bằng nước sạch.",
  },
  {
    id: 5,
    name: "Hệ thống tưới nhỏ giọt",
    description: "Tiết kiệm nước và tự động hóa tưới tiêu",
    longDescription:
      "Hệ thống tưới nhỏ giọt là giải pháp tưới tiêu hiện đại, giúp tiết kiệm nước và công sức. Hệ thống cung cấp nước trực tiếp đến gốc cây với lưu lượng nhỏ, đều đặn, giúp cây hấp thụ nước hiệu quả, giảm thiểu lượng nước bốc hơi và rửa trôi dinh dưỡng. Có thể kết hợp với bộ điều khiển tự động để tối ưu hóa thời gian tưới.",
    price: 850000,
    discount: 0,
    unit: "Bộ 100m²",
    image: "/placeholder.svg?height=600&width=600",
    category: "irrigation",
    stock: 25,
    rating: 4.9,
    reviews: 37,
    specifications: {
      "Diện tích phủ sóng": "100m²",
      "Khoảng cách giữa các đầu nhỏ giọt": "30cm",
      "Lưu lượng nước": "2-4 lít/giờ/đầu nhỏ giọt",
      "Áp lực nước yêu cầu": "0.5-2.5 bar",
      "Thành phần bộ kit":
        "Ống PE 16mm, đầu nhỏ giọt, đầu nối, van khóa, bộ lọc",
    },
    usage:
      "Lắp đặt ống chính và các nhánh theo sơ đồ. Đặt đầu nhỏ giọt tại vị trí gốc cây. Kết nối với nguồn nước và kiểm tra toàn bộ hệ thống trước khi sử dụng. Vệ sinh bộ lọc định kỳ để đảm bảo hệ thống hoạt động hiệu quả.",
  },
  {
    id: 6,
    name: "Hạt giống rau muống",
    description: "Giống rau phát triển nhanh, năng suất cao",
    longDescription:
      "Hạt giống rau muống là giống rau ăn lá phổ biến, dễ trồng và phát triển nhanh. Cây có thân mềm, lá xanh đậm, giàu vitamin và khoáng chất. Giống rau này có khả năng chống chịu tốt với điều kiện thời tiết khắc nghiệt, ít sâu bệnh và cho thu hoạch liên tục trong thời gian dài.",
    price: 25000,
    discount: 0,
    unit: "100g",
    image: "/placeholder.svg?height=600&width=600",
    category: "seeds",
    stock: 200,
    rating: 4.3,
    reviews: 68,
    specifications: {
      "Xuất xứ": "Việt Nam",
      "Thời gian nảy mầm": "3-5 ngày",
      "Thời gian thu hoạch": "25-30 ngày sau gieo",
      "Năng suất trung bình": "15-20kg/10m²",
      "Tỷ lệ nảy mầm": ">85%",
    },
    usage:
      "Ngâm hạt trong nước ấm 4-6 giờ trước khi gieo. Gieo hạt trực tiếp trên luống đất đã chuẩn bị sẵn, độ sâu 1-2cm, khoảng cách giữa các hạt 10-15cm. Tưới nước đều đặn, giữ đất luôn ẩm. Có thể thu hoạch bằng cách cắt ngọn hoặc nhổ cả cây.",
  },
  {
    id: 7,
    name: "Phân hữu cơ vi sinh",
    description: "Cải tạo đất và bổ sung dinh dưỡng",
    longDescription:
      "Phân hữu cơ vi sinh là loại phân bón sinh học được sản xuất từ các nguyên liệu hữu cơ tự nhiên qua quá trình ủ hoai mục với sự tham gia của các vi sinh vật có ích. Sản phẩm giúp cải thiện cấu trúc đất, tăng độ phì nhiêu, kích thích hệ vi sinh vật đất hoạt động, từ đó giúp cây trồng phát triển khỏe mạnh, tăng sức đề kháng với sâu bệnh.",
    price: 180000,
    discount: 5,
    unit: "Bao 10kg",
    image: "/placeholder.svg?height=600&width=600",
    category: "fertilizers",
    stock: 85,
    rating: 4.7,
    reviews: 53,
    specifications: {
      "Thành phần":
        "Hữu cơ >15%, N:P:K = 3:2:3, vi sinh vật có ích >10^6 CFU/g",
      "Dạng phân": "Dạng bột mịn",
      "Xuất xứ": "Việt Nam",
      "Thời hạn sử dụng": "24 tháng kể từ ngày sản xuất",
      "Bảo quản": "Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp",
    },
    usage:
      "Bón lót: 0.5-1kg/m² trước khi trồng. Bón thúc: 0.3-0.5kg/m² sau mỗi đợt thu hoạch hoặc 1-2 tháng/lần. Có thể trộn với đất trồng chậu theo tỷ lệ 1:10 (phân:đất) để cải thiện chất lượng đất.",
  },
  {
    id: 8,
    name: "Thuốc phòng bệnh đạo ôn",
    description: "Phòng trừ hiệu quả bệnh đạo ôn trên lúa",
    longDescription:
      "Thuốc phòng bệnh đạo ôn là sản phẩm chuyên dụng để phòng và trị bệnh đạo ôn - một trong những bệnh nguy hiểm nhất trên cây lúa. Thuốc có tác dụng tiêu diệt nấm Pyricularia oryzae gây bệnh đạo ôn trên lá, cổ bông và thân lúa. Sử dụng thuốc đúng cách sẽ giúp bảo vệ cây lúa, tăng năng suất và chất lượng lúa gạo.",
    price: 220000,
    discount: 0,
    unit: "Gói 500g",
    image: "/placeholder.svg?height=600&width=600",
    category: "pesticides",
    stock: 60,
    rating: 4.6,
    reviews: 41,
    specifications: {
      "Hoạt chất chính": "Tricyclazole 75% WP",
      "Dạng thuốc": "Bột thấm nước",
      "Xuất xứ": "Việt Nam",
      "Thời hạn sử dụng": "36 tháng kể từ ngày sản xuất",
      "Phổ tác động": "Nấm Pyricularia oryzae gây bệnh đạo ôn",
    },
    usage:
      "Pha 10-15g thuốc với 16 lít nước sạch. Phun đều lên toàn bộ cây lúa. Phun phòng khi lúa bắt đầu đẻ nhánh và trước khi lúa trổ bông 7-10 ngày. Phun trị khi phát hiện bệnh. Không phun thuốc khi trời sắp mưa hoặc đang có gió lớn.",
  },
];

// Dữ liệu mẫu cho đánh giá
const sampleReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "101",
      productId: "1",
      userName: "Nguyễn Văn An",
      rating: 5,
      comment:
        "Hạt giống chất lượng cao, tỷ lệ nảy mầm tốt. Cây lúa phát triển khỏe mạnh và cho năng suất cao. Rất hài lòng với sản phẩm này!",
      date: new Date(2023, 5, 15),
    },
    {
      id: "102",
      productId: "1",
      userName: "Trần Thị Bình",
      rating: 4,
      comment:
        "Giống lúa phát triển tốt, kháng sâu bệnh khá tốt. Tuy nhiên, thời gian sinh trưởng hơi lâu hơn so với mô tả một chút.",
      date: new Date(2023, 6, 20),
    },
    {
      id: "103",
      productId: "1",
      userName: "Lê Văn Cường",
      rating: 5,
      comment:
        "Gạo thu hoạch được có mùi thơm đặc trưng, hạt gạo dài và đẹp. Đúng là giống lúa chất lượng cao, sẽ tiếp tục mua trong vụ sau.",
      date: new Date(2023, 7, 5),
    },
  ],
  "2": [
    {
      id: "201",
      productId: "2",
      userName: "Phạm Thị Dung",
      rating: 5,
      comment:
        "Phân bón hiệu quả, cây trồng phát triển xanh tốt sau khi bón. Giá cả hợp lý so với chất lượng.",
      date: new Date(2023, 4, 10),
    },
    {
      id: "202",
      productId: "2",
      userName: "Hoàng Văn Em",
      rating: 4,
      comment:
        "Sản phẩm tốt, dễ sử dụng. Tuy nhiên, bao bì đôi khi bị rách trong quá trình vận chuyển.",
      date: new Date(2023, 5, 25),
    },
  ],
  "3": [
    {
      id: "301",
      productId: "3",
      userName: "Vũ Thị Giang",
      rating: 5,
      comment:
        "Thuốc trừ sâu sinh học rất hiệu quả mà không gây hại cho môi trường. Sâu hại giảm đáng kể sau khi sử dụng.",
      date: new Date(2023, 3, 18),
    },
  ],
  "4": [
    {
      id: "401",
      productId: "4",
      userName: "Đặng Văn Hùng",
      rating: 4,
      comment:
        "Máy phun thuốc hoạt động tốt, pin trâu. Tuy nhiên, hơi nặng khi sử dụng trong thời gian dài.",
      date: new Date(2023, 2, 12),
    },
    {
      id: "402",
      productId: "4",
      userName: "Ngô Thị Lan",
      rating: 5,
      comment:
        "Máy phun thuốc chất lượng cao, áp lực phun mạnh và đều. Tiết kiệm được nhiều thời gian so với phun thủ công.",
      date: new Date(2023, 3, 5),
    },
  ],
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setRedirect = useAuthStore.getState().setRedirect;
  const router = useRouter();
  const pathname = usePathname();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  // State cho sản phẩm và loading
  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // State cho đánh giá (sử dụng sampleReviews)
  const [reviews, setReviews] = useState<Review[]>(sampleReviews["1"] || []);
  const [quantity, setQuantity] = useState(1);

  // Load sản phẩm theo ID
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const [data, error] = await ProductService.getById(productId);

        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải thông tin sản phẩm. " + (error.message || ""),
            variant: "destructive",
          });
          notFound();
          return;
        }

        setProduct(data);
        // Cập nhật selected image khi có dữ liệu
        setSelectedImage(0);
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tải sản phẩm",
          variant: "destructive",
        });
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, toast]);

  // Product not found
  if (!product && !isLoading) {
    notFound();
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
            <LoadingSpinner />
            <div className="text-center">
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                Đang tải thông tin sản phẩm...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Xử lý khi có đánh giá mới
  const handleNewReview = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Tăng số lượng
  const increaseQuantity = () => {
    if (!product) return;
    if (quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };

  // Giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    if (!isLoggedIn) {
      setRedirect(pathname);
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
      router.push(ROUTES.LOGIN);
      return;
    }
    // Kiểm tra số lượng tồn kho
    if (!product) return;
    if (quantity > product.inventory) {
      toast({
        title: "Lỗi",
        description: "Số lượng yêu cầu vượt quá số lượng tồn kho",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product.id, quantity);
      // Toast success đã được xử lý trong useCart hook
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Toast error đã được xử lý trong useCart hook
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product)
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8 text-center shadow-sm">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-0">
            <Frown className="h-24 w-24 text-gray-400 dark:text-gray-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-800 dark:text-gray-200">
              Sản phẩm không tồn tại hoặc đã bị xóa
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md">
              Rất tiếc, chúng tôi không tìm thấy sản phẩm bạn đang tìm kiếm. Vui
              lòng thử lại sau hoặc khám phá các sản phẩm khác.
            </p>
            <Link href="/product">
              <Button className="mt-8 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full text-lg px-8 py-3">
                <ChevronLeft className="mr-2 h-5 w-5" />
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link
            href="/product"
            className="flex items-center gap-1 hover:text-green-600"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại danh sách sản phẩm</span>
          </Link>
        </nav>
      </div>

      {/* Product Info Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          <Card className="relative aspect-3/2 object-cover overflow-hidden rounded-lg shadow-sm">
            <Image
              src={
                product.images[selectedImage]?.path ||
                product.thumbnail ||
                "/placeholder.svg"
              }
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </Card>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200",
                    selectedImage === index
                      ? "border-green-500 shadow-md"
                      : "border-gray-200 hover:border-green-300 dark:border-gray-700 dark:hover:border-green-600"
                  )}
                  aria-label={`Xem hình ảnh ${index + 1} của ${product.name}`}
                >
                  <Image
                    src={image.path || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-extrabold text-green-800 dark:text-green-200">
            {product.name}
          </h1>

          {/* Farmer Info Card */}
          <Card className="p-4 shadow-sm">
            <CardContent className="flex items-center justify-between p-0">
              <Link
                href={`/farmer/${product.farmer.id}`}
                className="flex items-center gap-3 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <img
                  src={product.farmer.avatar || "/placeholder.svg"}
                  alt={product.farmer.name}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {product.farmer.name}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>Đánh giá: {product.farmer.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
              {product.farmer.status !== "ACTIVE" && (
                <Badge className="ml-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {product.farmer.status === "SELF_BLOCK"
                    ? "Tạm ngưng"
                    : product.farmer.status === "ADMIN_BLOCK"
                    ? "Bị khóa"
                    : product.farmer.status}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Product Rating & Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-base text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)} ({reviews.length} đánh giá)
              </span>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Price & Unit */}
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold text-green-600 dark:text-green-400">
              {formatPrice(product.price)}
            </span>
            <span className="text-xl text-gray-600 dark:text-gray-400">
              / {product.unitPrice}
            </span>
          </div>

          {/* Product Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 text-sm font-medium"
            >
              {product.category}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "px-3 py-1 text-sm font-medium",
                product.inventory > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              )}
            >
              {product.inventory > 0
                ? `Còn ${product.inventory} ${product.unitPrice}`
                : "Hết hàng"}
            </Badge>
            {product.sold > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-sm font-medium"
              >
                Đã bán: {product.sold}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 text-sm font-medium"
            >
              <Truck className="h-4 w-4 mr-1" /> Giao hàng toàn quốc
            </Badge>
          </div>

          <Separator />

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-none"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="flex h-11 w-14 items-center justify-center text-lg font-medium text-gray-800 dark:text-gray-200 border-x border-gray-200 dark:border-gray-700">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-none"
                onClick={increaseQuantity}
                disabled={quantity >= product.inventory}
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="flex-1 h-11 text-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-full shadow-lg transition-all duration-200"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.inventory === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12 lg:mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            <TabsTrigger
              value="description"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Mô tả chi tiết
            </TabsTrigger>
            {/* <TabsTrigger
              value="specifications"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Hướng dẫn sử dụng
            </TabsTrigger> */}
            <TabsTrigger
              value="reviews"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-green-700 data-[state=active]:dark:text-green-300 data-[state=active]:shadow-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 border-b-2 border-transparent data-[state=active]:border-green-500 transition-colors"
            >
              Đánh giá ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                <p>{product?.longDescription || product?.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product?.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 text-base">
                            {value}
                          </span>
                          <Separator className="mt-2" />
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="usage" className="mt-4">
            <Card className="shadow-sm rounded-lg">
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                <p>{product?.usage}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-8">
              {/* Overall Review Summary */}
              <Card className="shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="text-6xl font-bold text-green-600 dark:text-green-500">
                        {product?.rating.toFixed(1)}
                      </span>
                      <div className="mt-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5",
                              i < Math.floor(product?.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                      <span className="mt-1 text-base text-gray-500 dark:text-gray-400">
                        ({reviews.length} đánh giá)
                      </span>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="h-auto hidden sm:block"
                    />
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const reviewsWithThisRating = reviews.filter(
                            (review) => review.rating === star
                          ).length;
                          const percentage =
                            reviews.length > 0
                              ? Math.floor(
                                  (reviewsWithThisRating / reviews.length) * 100
                                )
                              : 0;

                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10">
                                {star} sao
                              </span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                                  style={
                                    {
                                      width: `${percentage}%`,
                                    } as React.CSSProperties
                                  }
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                                {percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Form */}
              <Card className="shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <ProductReviewForm
                    productId={productId}
                    onReviewSubmitted={handleNewReview}
                  />
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">
                  Tất cả đánh giá ({reviews.length})
                </h3>
                <ProductReviewsList reviews={reviews} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
