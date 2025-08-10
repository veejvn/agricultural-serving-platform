import { IFarmerResponse } from "@/types/farmer";

// Interface cho dữ liệu category
export interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children: ICategory[];
}

export interface ImageResponse {
  id: string;
  path: string;
}

// Interface cho dữ liệu sản phẩm
export interface IProductResponese {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  sold: number;
  rating: number;
  thumbnail: string;
  unitPrice: string;
  status: string;
  images: ImageResponse[];
  category: string;
  farmer: IFarmerResponse;
  createdAt: string;
}

// Interface cho response phân trang
export interface IPageResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

// Interface cho ProductTagResponse (dùng trong danh sách sản phẩm)
export interface IProductTag {
  id: string;
  name: string;
  description: string;
  price: number;
  sold: number;
  rating: number;
  thumbnail: string;
  unitPrice: string;
  categoryId: string;
  farmer: {
    id: string;
    name: string;
    avatar: string | null;
    coverImage: string | null;
    rating: number;
    description: string | null;
    status: string;
  };
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  status: "approved" | "pending" | "rejected";
  reportCount?: number;
  moderationNotes?: string;
}

export interface ProductStats {
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number;
  monthlyData: {
    month: string;
    views: number;
    orders: number;
    revenue: number;
  }[];
}
