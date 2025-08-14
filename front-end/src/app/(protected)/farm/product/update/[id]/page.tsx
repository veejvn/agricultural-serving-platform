"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Upload,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  Tag,
  ImageIcon,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";
import ProductService from "@/services/product.service";
import categoryService from "@/services/category.service";
import UploadService from "@/services/upload.service";
import LoadingSpinner from "@/components/common/loading-spinner";
import { ICategory, IProductResponese, ImageResponse } from "@/types/product";

// interface ICategory {
//   id: string;
//   name: string;
//   children?: ICategory[];
// }

interface ProductForm {
  name: string;
  description: string;
  price: string;
  inventory: string;
  thumbnail: string;
  unitPrice: string;
  categoryId: string;
  imagePaths: string[];
}

const units = ["kg", "bao", "gram", "lạng", "tấn", "quả", "bó", "túi", "hộp"];

export default function UpdateProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImages, setDeletingImages] = useState<Set<number>>(new Set());
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    inventory: "",
    thumbnail: "",
    unitPrice: "kg",
    categoryId: "",
    imagePaths: [],
  });

  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sản phẩm là bắt buộc";
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }

    if (!formData.inventory || Number.parseInt(formData.inventory) < 0) {
      newErrors.inventory = "Số lượng tồn kho không được âm";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = "Ảnh đại diện là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        toast({
          title: "Lỗi",
          description: "ID sản phẩm không hợp lệ",
          variant: "destructive",
        });
        router.push("/farm/product");
        return;
      }

      setIsLoadingProduct(true);
      try {
        const [result, error] = await ProductService.getById(productId);
        if (error) {
          toast({
            title: "Lỗi",
            description:
              "Không thể tải thông tin sản phẩm. " + (error.message || ""),
            variant: "destructive",
          });
          router.push("/farm/product");
          return;
        }

        if (result) {
          console.log("Product data from API:", result); // Debug log

          // Xử lý categoryId - nếu category là tên thì tìm ID tương ứng
          let categoryId = result.category || "";

          // Nếu có categories đã load và category từ API là tên, tìm ID
          if (categories.length > 0) {
            const foundCategory =
              findCategoryById(categories, result.category) ||
              findCategoryByName(categories, result.category);
            if (foundCategory) {
              categoryId = foundCategory.id;
            }
          }

          setFormData({
            name: result.name || "",
            description: result.description || "",
            price: result.price?.toString() || "",
            inventory: result.inventory?.toString() || "",
            thumbnail: result.thumbnail || "",
            unitPrice: result.unitPrice || "kg",
            categoryId: categoryId,
            imagePaths:
              result.images?.map((img: ImageResponse) => img.path) || [],
          });
        }
      } catch (error: any) {
        console.error("Error loading product:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sản phẩm",
          variant: "destructive",
        });
        router.push("/farm/product");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [productId, toast, router]);

  // Load categories từ API
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const [result, error] = await categoryService.getAllCategories();
        if (error) {
          toast({
            title: "Lỗi",
            description: "Không thể tải danh mục. " + (error.message || ""),
            variant: "destructive",
          });
          return;
        }
        if (result) {
          setCategories(result);
          // Tự động mở rộng các danh mục cấp đầu tiên
          const rootCategoryIds = result.map((cat: ICategory) => cat.id);
          setExpandedCategories(new Set(rootCategoryIds));
        }
      } catch (error: any) {
        console.error("Error loading categories:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh mục",
          variant: "destructive",
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Reload product khi categories đã load để xử lý categoryId đúng
  useEffect(() => {
    if (
      categories.length > 0 &&
      formData.categoryId &&
      !findCategoryById(categories, formData.categoryId)
    ) {
      // Nếu categoryId hiện tại không tìm thấy trong danh sách categories, thử tìm theo tên
      const loadProductAgain = async () => {
        try {
          const [result, error] = await ProductService.getById(productId);
          if (result && result.category) {
            const foundCategory = findCategoryByName(
              categories,
              result.category
            );
            if (foundCategory) {
              setFormData((prev) => ({
                ...prev,
                categoryId: foundCategory.id,
              }));
            }
          }
        } catch (error) {
          console.warn("Failed to reload product for category mapping:", error);
        }
      };
      loadProductAgain();
    }
  }, [categories, formData.categoryId, productId]);

  // Hàm toggle mở/đóng category
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Hàm tìm category theo ID hoặc tên
  const findCategoryById = (
    categories: ICategory[],
    id: string
  ): ICategory | null => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Hàm tìm category theo tên (fallback nếu API trả về tên thay vì ID)
  const findCategoryByName = (
    categories: ICategory[],
    name: string
  ): ICategory | null => {
    for (const category of categories) {
      if (category.name === name) return category;
      if (category.children) {
        const found = findCategoryByName(category.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  // Hàm render từng category item
  const renderCategoryItem = (category: ICategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = formData.categoryId === category.id;

    // Tạo padding class based on level
    const paddingClass =
      level === 0
        ? "pl-2"
        : level === 1
        ? "pl-6"
        : level === 2
        ? "pl-10"
        : level === 3
        ? "pl-14"
        : "pl-18";

    return (
      <div key={category.id}>
        <div
          className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${paddingClass} ${
            isSelected ? "bg-blue-50 text-blue-700" : ""
          }`}
          onClick={() => {
            handleInputChange("categoryId", category.id);
            setCategoryPopoverOpen(false);
          }}
        >
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              className="mr-1 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          <Folder className="h-4 w-4 mr-2 text-yellow-600" />
          <span className="text-sm">{category.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) =>
              renderCategoryItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Hàm render toàn bộ cây category
  const renderCategoryTree = () => {
    return (
      <div className="max-h-80 w-[512px] overflow-y-auto">
        {categories.map((category) => renderCategoryItem(category))}
      </div>
    );
  };

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle thumbnail file selection with upload
  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!UploadService.isImageFile(file)) {
        toast({
          title: "File không hợp lệ",
          description: "Vui lòng chọn file ảnh (jpg, png, gif, etc.)",
          variant: "destructive",
        });
        return;
      }

      setUploadingThumbnail(true);
      try {
        const [imageUrl, error] = await UploadService.uploadImage(file);

        if (error) {
          throw new Error(error.message || "Upload failed");
        }

        if (imageUrl) {
          setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
          if (errors.thumbnail) {
            setErrors((prev) => ({ ...prev, thumbnail: undefined }));
          }
          toast({
            title: "Upload thành công",
            description: "Ảnh đại diện đã được tải lên",
          });
        }
      } catch (error: any) {
        console.error("Upload thumbnail error:", error);
        toast({
          title: "Lỗi upload",
          description: error.message || "Không thể tải ảnh lên server",
          variant: "destructive",
        });
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  // Handle additional images file selection with upload
  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => UploadService.isImageFile(file));

    if (imageFiles.length !== files.length) {
      toast({
        title: "Một số file không hợp lệ",
        description: "Chỉ các file ảnh được chấp nhận",
        variant: "destructive",
      });
    }

    if (imageFiles.length === 0) return;

    setUploadingImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(imageFiles);

      if (error) {
        throw new Error(error.message || "Upload failed");
      }

      if (imageUrls) {
        // Thêm các URL mới vào danh sách, loại bỏ duplicate
        setFormData((prev) => {
          const existingPaths = new Set(prev.imagePaths);
          const newPaths = imageUrls.filter(
            (url: string) => !existingPaths.has(url)
          );
          return {
            ...prev,
            imagePaths: [...prev.imagePaths, ...newPaths],
          };
        });

        toast({
          title: "Upload thành công",
          description: `Đã tải lên ${imageUrls.length} ảnh`,
        });
      }
    } catch (error: any) {
      console.error("Upload additional images error:", error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }

    // Reset input
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = "";
    }
  };

  // Handle drag and drop for thumbnail
  const handleThumbnailDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => UploadService.isImageFile(file));

    if (!imageFile) {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng kéo thả file ảnh",
        variant: "destructive",
      });
      return;
    }

    setUploadingThumbnail(true);
    try {
      const [imageUrl, error] = await UploadService.uploadImage(imageFile);

      if (error) {
        throw new Error(error.message || "Upload failed");
      }

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
        if (errors.thumbnail) {
          setErrors((prev) => ({ ...prev, thumbnail: undefined }));
        }
        toast({
          title: "Upload thành công",
          description: "Ảnh đại diện đã được tải lên",
        });
      }
    } catch (error: any) {
      console.error("Upload thumbnail error:", error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle drag and drop for additional images
  const handleAdditionalImagesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      UploadService.isImageFile(file)
    );

    if (files.length === 0) {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng kéo thả file ảnh",
        variant: "destructive",
      });
      return;
    }

    setUploadingImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(files);

      if (error) {
        throw new Error(error.message || "Upload failed");
      }

      if (imageUrls) {
        // Thêm các URL mới vào danh sách, loại bỏ duplicate
        setFormData((prev) => {
          const existingPaths = new Set(prev.imagePaths);
          const newPaths = imageUrls.filter(
            (url: string) => !existingPaths.has(url)
          );
          return {
            ...prev,
            imagePaths: [...prev.imagePaths, ...newPaths],
          };
        });

        toast({
          title: "Upload thành công",
          description: `Đã tải lên ${imageUrls.length} ảnh`,
        });
      }
    } catch (error: any) {
      console.error("Upload additional images error:", error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImagePath = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagePaths: prev.imagePaths.filter((_, i) => i !== index),
    }));
  };

  const setAsThumbnail = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    if (errors.thumbnail) {
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    }
    toast({
      title: "Đã cập nhật",
      description: "Đã đặt làm ảnh đại diện",
    });
  };

  const removeThumbnail = async () => {
    const thumbnailToDelete = formData.thumbnail;

    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }

    // Call API to delete file from server
    if (thumbnailToDelete) {
      try {
        const [result, error] = await UploadService.deleteFile(
          thumbnailToDelete
        );
        console.log("Thumbnail deleted from server:", result);
        if (error) {
          console.warn("Failed to delete thumbnail from server:", error);
          // Don't show error to user as the file might already be deleted or not exist
        } else {
          console.log("Thumbnail deleted from server successfully");
        }
      } catch (error) {
        console.warn("Error deleting thumbnail:", error);
      }
    }

    toast({
      title: "Đã xóa",
      description: "Ảnh đại diện đã được xóa",
    });
  };

  const removeImagePathWithAPI = async (index: number) => {
    const imageToDelete = formData.imagePaths[index];

    // Add to deleting set to show loading state
    setDeletingImages((prev) => new Set(prev).add(index));

    try {
      // Remove from UI first
      setFormData((prev) => ({
        ...prev,
        imagePaths: prev.imagePaths.filter((_, i) => i !== index),
      }));

      // Call API to delete file from server
      const [result, error] = await UploadService.deleteFile(imageToDelete);
      console.log("Image deleted from server:", result);
      if (error) {
        console.warn("Failed to delete image from server:", error);
        // Don't show error to user as the file might already be deleted or not exist
      } else {
        console.log("Image deleted from server successfully");
      }

      toast({
        title: "Đã xóa",
        description: "Ảnh đã được xóa khỏi danh sách và server",
      });
    } catch (error) {
      console.warn("Error deleting image:", error);
      toast({
        title: "Cảnh báo",
        description:
          "Ảnh đã được xóa khỏi danh sách nhưng có thể chưa xóa khỏi server",
        variant: "destructive",
      });
    } finally {
      // Remove from deleting set
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const resetForm = async () => {
    // Reload lại dữ liệu gốc từ server
    setIsLoadingProduct(true);
    try {
      const [result, error] = await ProductService.getById(productId);
      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải lại thông tin sản phẩm",
          variant: "destructive",
        });
        return;
      }

      if (result) {
        // Xử lý categoryId - nếu category là tên thì tìm ID tương ứng
        let categoryId = result.category || "";

        // Nếu có categories đã load và category từ API là tên, tìm ID
        if (categories.length > 0) {
          const foundCategory =
            findCategoryById(categories, result.category) ||
            findCategoryByName(categories, result.category);
          if (foundCategory) {
            categoryId = foundCategory.id;
          }
        }

        setFormData({
          name: result.name || "",
          description: result.description || "",
          price: result.price?.toString() || "",
          inventory: result.inventory?.toString() || "",
          thumbnail: result.thumbnail || "",
          unitPrice: result.unitPrice || "kg",
          categoryId: categoryId,
          imagePaths:
            result.images?.map((img: ImageResponse) => img.path) || [],
        });
        setErrors({});
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        if (additionalImagesInputRef.current)
          additionalImagesInputRef.current.value = "";

        toast({
          title: "Đã khôi phục",
          description: "Dữ liệu đã được khôi phục về trạng thái ban đầu",
        });
      }
    } catch (error: any) {
      console.error("Error reloading product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lại thông tin sản phẩm",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng kiểm tra lại thông tin đã nhập",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên server
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        inventory: parseInt(formData.inventory),
        thumbnail: formData.thumbnail,
        unitPrice: formData.unitPrice,
        categoryId: formData.categoryId,
        imagePaths: formData.imagePaths,
      };

      console.log("Updating product data:", productData);

      // Gọi API cập nhật sản phẩm
      const [result, error] = await ProductService.updateProduct(
        productId,
        productData
      );

      if (error) {
        throw new Error(error.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
      }

      if (result) {
        toast({
          title: "Cập nhật sản phẩm thành công!",
          description: `Sản phẩm "${formData.name}" đã được cập nhật`,
        });

        // Redirect về trang danh sách sản phẩm
        router.push("/farm/product");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Có lỗi xảy ra",
        description:
          error.message || "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formData);

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <Link href="/farm/product">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách sản phẩm
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
        <div className="w-28"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cơ bản của sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={categoryPopoverOpen}
                  onOpenChange={setCategoryPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={`w-full justify-between ${
                        errors.categoryId ? "border-red-500" : ""
                      }`}
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải danh mục...
                        </span>
                      ) : formData.categoryId ? (
                        findCategoryById(categories, formData.categoryId)
                          ?.name || "Chọn danh mục"
                      ) : (
                        "Chọn danh mục"
                      )}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="bottom" align="start">
                    {renderCategoryTree()}
                  </PopoverContent>
                </Popover>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Nhập mô tả chi tiết về sản phẩm"
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá bán (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  min="0"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">
                  Đơn vị tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.unitPrice}
                  onValueChange={(value) =>
                    handleInputChange("unitPrice", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory">
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={(e) =>
                    handleInputChange("inventory", e.target.value)
                  }
                  placeholder="0"
                  min="0"
                  className={errors.inventory ? "border-red-500" : ""}
                />
                {errors.inventory && (
                  <p className="text-sm text-red-500">{errors.inventory}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hình ảnh sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hình ảnh sản phẩm
            </CardTitle>
            <CardDescription>
              Tải lên ảnh đại diện và các ảnh mô tả sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ảnh đại diện */}
            <div className="space-y-2">
              <Label>
                Ảnh đại diện <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Upload area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver === "thumbnail"
                      ? "border-blue-500 bg-blue-50"
                      : errors.thumbnail
                      ? "border-red-300"
                      : "border-gray-300"
                  } ${
                    uploadingThumbnail ? "pointer-events-none opacity-50" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver("thumbnail");
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={handleThumbnailDrop}
                >
                  {uploadingThumbnail ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-600">Đang tải lên...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Kéo thả ảnh vào đây hoặc{" "}
                        <button
                          type="button"
                          className="text-blue-500 hover:underline"
                          onClick={() => thumbnailInputRef.current?.click()}
                        >
                          chọn file
                        </button>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    title="Chọn ảnh đại diện cho sản phẩm"
                  />
                </div>

                {/* Preview */}
                {formData.thumbnail && (
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-200 bg-green-50">
                      <Image
                        src={formData.thumbnail}
                        alt="Ảnh đại diện"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                          Ảnh đại diện
                        </div>
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Xóa ảnh đại diện"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-center text-green-700 font-medium">
                      Ảnh đại diện hiện tại
                    </p>
                  </div>
                )}
              </div>
              {errors.thumbnail && (
                <p className="text-sm text-red-500">{errors.thumbnail}</p>
              )}
            </div>

            {/* Ảnh bổ sung */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ảnh mô tả thêm</Label>
                <span className="text-sm text-gray-500">
                  {formData.imagePaths.length} ảnh
                </span>
              </div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver === "additional"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                } ${uploadingImages ? "pointer-events-none opacity-50" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver("additional");
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={handleAdditionalImagesDrop}
              >
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-600">Đang tải lên...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Kéo thả nhiều ảnh vào đây hoặc{" "}
                      <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={() =>
                          additionalImagesInputRef.current?.click()
                        }
                      >
                        chọn files
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      Có thể chọn nhiều ảnh cùng lúc (PNG, JPG, GIF tối đa 10MB
                      mỗi ảnh)
                    </p>
                  </div>
                )}
                <input
                  ref={additionalImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                  aria-label="Chọn ảnh mô tả thêm"
                />
              </div>
              {/* Additional Images Preview */}
              {formData.imagePaths.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Ảnh mô tả ({formData.imagePaths.length})
                    </h4>
                    <p className="text-sm text-gray-500">
                      Hover để xem các hành động
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.imagePaths.map((imagePath, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-200 bg-blue-50">
                          <Image
                            src={imagePath}
                            alt={`Ảnh mô tả ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-80">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setAsThumbnail(imagePath)}
                                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                                title="Đặt làm ảnh đại diện"
                              >
                                <Tag className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImagePathWithAPI(index)}
                                disabled={deletingImages.has(index)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                  deletingImages.has(index)
                                    ? "Đang xóa..."
                                    : "Xóa ảnh khỏi server"
                                }
                              >
                                {deletingImages.has(index) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-600 truncate">
                          Ảnh mô tả {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isLoading || isLoadingProduct}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Khôi phục
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
}
