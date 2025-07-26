// Interface cho dữ liệu category
export interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children: ICategory[];
}

// Interface cho dữ liệu sản phẩm
export interface IProduct {
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
