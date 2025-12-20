"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  X,
  Upload,
  ImageIcon,
  Package,
  Save,
  RotateCcw,
  Camera,
  Trash2,
  ArrowLeft,
  ChevronDown,
  Check,
  Star,
} from "lucide-react";
import ProductService from "@/services/product.service";
import UploadService from "@/services/upload.service";
import categoryService from "@/services/category.service";
import { ICategory } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface OcopForm {
  enabled: boolean;
  star: string;
  certificateNumber: string;
  issuedYear: string;
  issuer: string;
  imagePaths: string[];
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  inventory: string;
  thumbnail: string;
  unitPrice: string;
  categoryId: string;
  imagePaths: string[];
  ocopRequest?: OcopForm;
}

interface OcopFormErrors {
  star?: string;
  certificateNumber?: string;
  issuedYear?: string;
  issuer?: string;
  imagePaths?: string;
}

interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  inventory?: string;
  thumbnail?: string;
  unitPrice?: string;
  categoryId?: string;
  imagePaths?: string;
}


const units = [
  "kg",
  "gram",
  "lạng",
  "tấn",
  "quả",
  "bó",
  "túi",
  "hộp",
  "chai",
  "bao",
];

const stars = ["3", "4", "5"];

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingOcopImages, setUploadingOcopImages] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const ocopImagesInputRef = useRef<HTMLInputElement>(null);

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

  const [ocopFormData, setOcopFormData] = useState<OcopForm>({
    enabled: false,
    star: "",
    certificateNumber: "",
    issuedYear: "",
    issuer: "",
    imagePaths: [],
  });

  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [ocopErrors, setOcopErrors] = useState<Partial<OcopFormErrors>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductForm> = {};
    const newOcopErrors: OcopFormErrors = {};

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

    if (ocopFormData.enabled) {
      if (!ocopFormData.star) {
        newOcopErrors.star = "Số sao OCOP là bắt buộc";
      }
      if (!ocopFormData.certificateNumber.trim()) {
        newOcopErrors.certificateNumber = "Số chứng nhận OCOP là bắt buộc";
      }
      if (!ocopFormData.issuedYear) {
        newOcopErrors.issuedYear = "Năm cấp chứng nhận là bắt buộc";
      }
      if (!ocopFormData.issuer.trim()) {
        newOcopErrors.issuer = "Đơn vị cấp chứng nhận là bắt buộc";
      }
      if (ocopFormData.imagePaths.length === 0) {
        newOcopErrors.imagePaths = "Cần ít nhất một ảnh chứng nhận OCOP";
      }
    }

    setErrors(newErrors);
    setOcopErrors(newOcopErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newOcopErrors).length === 0;
  };

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

  // Hàm tìm category theo ID
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
              title={isExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
              aria-label={isExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCategory(category.id);
              }}
            >
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  isExpanded ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-6 mr-2" />}
          <span className="flex-1 text-sm">{category.name}</span>
          {isSelected && <Check className="h-4 w-4 text-blue-600" />}
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

  const handleOcopInputChange = (field: keyof OcopForm, value: string | boolean) => {
    setOcopFormData((prev) => ({ ...prev, [field]: value }));
    if (field in ocopErrors) {
      setOcopErrors((prev) => ({ ...prev, [field]: undefined }));
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
          const newImagePaths = [...prev.imagePaths];
          imageUrls.forEach((url: string) => {
            if (!newImagePaths.includes(url)) {
              newImagePaths.push(url);
            }
          });
          return { ...prev, imagePaths: newImagePaths };
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

  // Handle OCOP images file selection with upload
  const handleOcopImagesChange = async (
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

    setUploadingOcopImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(imageFiles);

      if (error) {
        throw new Error(error.message || "Upload failed");
      }

      if (imageUrls) {
        // Thêm các URL mới vào danh sách, loại bỏ duplicate
        setOcopFormData((prev) => {
          const newImagePaths = [...prev.imagePaths];
          imageUrls.forEach((url: string) => {
            if (!newImagePaths.includes(url)) {
              newImagePaths.push(url);
            }
          });
          return { ...prev, imagePaths: newImagePaths };
        });

        toast({
          title: "Upload thành công",
          description: `Đã tải lên ${imageUrls.length} ảnh chứng nhận OCOP`,
        });
      }
    } catch (error: any) {
      console.error("Upload OCOP images error:", error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh chứng nhận OCOP lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingOcopImages(false);
    }

    // Reset input
    if (ocopImagesInputRef.current) {
      ocopImagesInputRef.current.value = "";
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
          const newImagePaths = [...prev.imagePaths];
          imageUrls.forEach((url: string) => {
            if (!newImagePaths.includes(url)) {
              newImagePaths.push(url);
            }
          });
          return { ...prev, imagePaths: newImagePaths };
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

  // Handle drag and drop for OCOP images
  const handleOcopImagesDrop = async (e: React.DragEvent) => {
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

    setUploadingOcopImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(files);

      if (error) {
        throw new Error(error.message || "Upload failed");
      }

      if (imageUrls) {
        // Thêm các URL mới vào danh sách, loại bỏ duplicate
        setOcopFormData((prev) => {
          const newImagePaths = [...prev.imagePaths];
          imageUrls.forEach((url: string) => {
            if (!newImagePaths.includes(url)) {
              newImagePaths.push(url);
            }
          });
          return { ...prev, imagePaths: newImagePaths };
        });

        toast({
          title: "Upload thành công",
          description: `Đã tải lên ${imageUrls.length} ảnh chứng nhận OCOP`,
        });
      }
    } catch (error: any) {
      console.error("Upload OCOP images error:", error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh chứng nhận OCOP lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingOcopImages(false);
    }
  };

  const removeImagePath = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagePaths: prev.imagePaths.filter((_, i) => i !== index),
    }));
  };

  const removeOcopImagePath = (index: number) => {
    setOcopFormData((prev) => ({
      ...prev,
      imagePaths: prev.imagePaths.filter((_, i) => i !== index),
    }));
  };

  const setAsThumbnail = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const loadSampleData = () => {
    // Lấy category đầu tiên có sẵn làm mẫu
    const sampleCategoryId = categories.length > 0 ? categories[0].id : "";

    setFormData({
      name: "Vú sửa hoàng kim",
      description:
        "Vú sữa Hoàng Kim, còn gọi là vú sữa Abiu, là một loại trái cây có nguồn gốc từ Đài Loan và được du nhập vào Việt Nam",
      price: "25000",
      inventory: "100",
      thumbnail:
        "https://bizweb.dktcdn.net/100/482/702/products/2.jpg?v=1750734146287",
      unitPrice: "kg",
      categoryId: sampleCategoryId,
      imagePaths: [
        "https://bizweb.dktcdn.net/100/482/702/products/2.jpg?v=1750734146287",
      ],
    });
    setOcopFormData({
      enabled: true,
      star: "4",
      certificateNumber: "OCOP-SG-2023-001",
      issuedYear: "2023",
      issuer: "Sở Nông nghiệp và Phát triển nông thôn TP.HCM",
      imagePaths: [
        "https://example.com/ocop_cert_1.jpg",
        "https://example.com/ocop_cert_2.jpg",
      ] as string[], // Explicitly cast to string[]
    });
    setErrors({});
    setOcopErrors({});
    toast({
      title: "Đã tải dữ liệu mẫu",
      description: "Dữ liệu mẫu đã được điền vào form",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      inventory: "",
      thumbnail: "",
      unitPrice: "kg",
      categoryId: "",
      imagePaths: [],
    });
    setOcopFormData({
      enabled: false,
      star: "",
      certificateNumber: "",
      issuedYear: "",
      issuer: "",
      imagePaths: [],
    });
    setErrors({});
    setOcopErrors({});
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (additionalImagesInputRef.current)
      additionalImagesInputRef.current.value = "";
    if (ocopImagesInputRef.current) ocopImagesInputRef.current.value = "";
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
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        inventory: parseInt(formData.inventory),
        thumbnail: formData.thumbnail,
        unitPrice: formData.unitPrice,
        categoryId: formData.categoryId,
        imagePaths: formData.imagePaths,
      };

      if (ocopFormData.enabled) {
        productData.ocopRequest = {
          enabled: ocopFormData.enabled,
          star: parseInt(ocopFormData.star),
          certificateNumber: ocopFormData.certificateNumber,
          issuedYear: parseInt(ocopFormData.issuedYear),
          issuer: ocopFormData.issuer,
          imagePaths: ocopFormData.imagePaths,
        };
      }

      console.log("Sending product data:", productData);

      //Gọi API tạo sản phẩm
      const [result, error] = await ProductService.createProduct(productData);

      if (error) {
        throw new Error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
      }

      if (result) {
        toast({
          title: "Thêm sản phẩm thành công!",
          description: `Sản phẩm "${formData.name}" đã được thêm vào hệ thống`,
        });
        resetForm();
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Có lỗi xảy ra",
        description:
          error.message || "Không thể thêm sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/farm/product">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="categoryId">
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={categoryPopoverOpen}
                  onOpenChange={setCategoryPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.categoryId ? "border-red-500" : "border-input"
                      }`}
                      disabled={categoriesLoading}
                    >
                      <span
                        className={
                          formData.categoryId
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {categoriesLoading
                          ? "Đang tải danh mục..."
                          : formData.categoryId
                          ? findCategoryById(categories, formData.categoryId)
                              ?.name || "Chọn danh mục"
                          : "Chọn danh mục"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    {categoriesLoading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Đang tải danh mục...
                      </div>
                    ) : categories.length > 0 ? (
                      renderCategoryTree()
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Không có danh mục nào
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            <div>
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
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
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
                  step="1000"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
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
                    <SelectValue />
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

              <div>
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.inventory}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OCOP Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Chứng nhận OCOP
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="ocop-enabled">Sản phẩm có chứng nhận OCOP</Label>
              <Switch
                id="ocop-enabled"
                checked={ocopFormData.enabled}
                onCheckedChange={(checked) => handleOcopInputChange("enabled", checked)}
              />
            </div>
          </CardHeader>
          {ocopFormData.enabled && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ocop-star">
                    Số sao OCOP <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={ocopFormData.star}
                    onValueChange={(value) =>
                      handleOcopInputChange("star", value)
                    }
                  >
                    <SelectTrigger
                      className={ocopErrors.star ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Chọn số sao" />
                    </SelectTrigger>
                    <SelectContent>
                      {stars.map((star) => (
                        <SelectItem key={star} value={star}>
                          {star} sao
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {ocopErrors.star && (
                    <p className="text-sm text-red-500 mt-1">
                      {ocopErrors.star}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ocop-cert-number">
                    Số chứng nhận <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ocop-cert-number"
                    value={ocopFormData.certificateNumber}
                    onChange={(e) =>
                      handleOcopInputChange("certificateNumber", e.target.value)
                    }
                    placeholder="Nhập số chứng nhận OCOP"
                    className={ocopErrors.certificateNumber ? "border-red-500" : ""}
                  />
                  {ocopErrors.certificateNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {ocopErrors.certificateNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ocop-issued-year">
                    Năm cấp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ocop-issued-year"
                    type="number"
                    value={ocopFormData.issuedYear}
                    onChange={(e) =>
                      handleOcopInputChange("issuedYear", e.target.value)
                    }
                    placeholder="VD: 2023"
                    min="1900"
                    max={new Date().getFullYear().toString()}
                    className={ocopErrors.issuedYear ? "border-red-500" : ""}
                  />
                  {ocopErrors.issuedYear && (
                    <p className="text-sm text-red-500 mt-1">
                      {ocopErrors.issuedYear}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ocop-issuer">
                    Đơn vị cấp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ocop-issuer"
                    value={ocopFormData.issuer}
                    onChange={(e) =>
                      handleOcopInputChange("issuer", e.target.value)
                    }
                    placeholder="VD: Sở Nông nghiệp và PTNT TP.HCM"
                    className={ocopErrors.issuer ? "border-red-500" : ""}
                  />
                  {ocopErrors.issuer && (
                    <p className="text-sm text-red-500 mt-1">
                      {ocopErrors.issuer}
                    </p>
                  )}
                </div>
              </div>

              {/* OCOP Images */}
              <div>
                <Label>
                  Ảnh chứng nhận OCOP <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  {uploadingOcopImages ? (
                    <div className="w-full h-32 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center bg-blue-50">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm text-blue-600">Đang tải lên ảnh chứng nhận...</p>
                    </div>
                  ) : (
                    <div
                      className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        dragOver === "ocop-additional" ? "border-blue-500 bg-blue-50" : (ocopErrors.imagePaths ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400")
                      }`}
                      onClick={() => ocopImagesInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver("ocop-additional");
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={handleOcopImagesDrop}
                    >
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">
                        Kéo thả nhiều ảnh chứng nhận vào đây hoặc click để chọn
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hỗ trợ nhiều file ảnh cùng lúc
                      </p>
                    </div>
                  )}

                  <input
                    ref={ocopImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleOcopImagesChange}
                    className="hidden"
                    aria-label="Chọn ảnh chứng nhận OCOP"
                  />

                  {ocopErrors.imagePaths && (
                    <p className="text-sm text-red-500 mt-1">
                      {ocopErrors.imagePaths}
                    </p>
                  )}

                  {ocopFormData.imagePaths.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {ocopFormData.imagePaths.map((imagePath, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-24 border rounded-lg overflow-hidden">
                            <Image
                              src={imagePath || "/placeholder.svg"}
                              alt={`Ảnh chứng nhận OCOP ${index + 1}`}
                              fill
                              className="object-cover"
                            />

                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeOcopImagePath(index)}
                                >
                                  <X className="w-3 h-3 text-white" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Hình ảnh */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Hình ảnh sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ảnh đại diện */}
            <div>
              <Label>
                Ảnh đại diện <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2">
                {uploadingThumbnail ? (
                  <div className="w-40 h-40 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center bg-blue-50">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-sm text-blue-600">Đang tải lên...</p>
                  </div>
                ) : formData.thumbnail ? (
                  <div className="relative inline-block">
                    <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={formData.thumbnail || "/placeholder.svg"}
                        alt="Ảnh đại diện"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => thumbnailInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4 text-green-500" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"                            variant="destructive"
                            onClick={removeThumbnail}
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Badge className="absolute -top-2 -right-2">Đại diện</Badge>
                  </div>
                ) : (
                  <div
                    className={`w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      dragOver === "thumbnail"
                        ? "border-blue-500 bg-blue-50"
                        : errors.thumbnail
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => thumbnailInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver("thumbnail");
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={handleThumbnailDrop}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Kéo thả ảnh vào đây
                      <br />
                      hoặc click để chọn
                    </p>
                  </div>
                )}

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  aria-label="Chọn ảnh đại diện sản phẩm"
                />

                {errors.thumbnail && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </div>

            {/* Ảnh bổ sung */}
            <div>
              <Label>
                Ảnh bổ sung <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2">
                {uploadingImages ? (
                  <div className="w-full h-32 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center bg-blue-50">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-sm text-blue-600">Đang tải lên ảnh...</p>
                  </div>
                ) : (
                  <div
                    className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      dragOver === "additional"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => additionalImagesInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver("additional");
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={handleAdditionalImagesDrop}
                  >
                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Kéo thả nhiều ảnh vào đây hoặc click để chọn
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hỗ trợ nhiều file ảnh cùng lúc
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
                  aria-label="Chọn ảnh bổ sung cho sản phẩm"
                />

                {formData.imagePaths.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.imagePaths.map((imagePath, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-24 border rounded-lg overflow-hidden">
                          <Image
                            src={imagePath || "/placeholder.svg"}
                            alt={`Ảnh ${index + 1}`}
                            fill
                            className="object-cover"
                          />

                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setAsThumbnail(imagePath)}
                                className="text-xs text-green-600 dark:text-green-700"
                              >
                                Đại diện
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImagePath(index)}
                              >
                                <X className="w-3 h-3 text-white" />
                              </Button>
                            </div>
                          </div>

                          {formData.thumbnail === imagePath && (
                            <Badge className="absolute top-1 right-1 text-xs">
                              Đại diện
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadSampleData}
              className="flex items-center gap-2 bg-transparent"
            >
              <Upload className="w-4 h-4" />
              Tải dữ liệu mẫu
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Thêm sản phẩm
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
