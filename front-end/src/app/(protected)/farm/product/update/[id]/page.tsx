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
  Star,
  Plus,
  Check,
  Maximize2,
} from "lucide-react";
import ProductService from "@/services/product.service";
import categoryService from "@/services/category.service";
import UploadService from "@/services/upload.service";
import LoadingSpinner from "@/components/common/loading-spinner";
import { ICategory, ImageResponse } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface OcopForm {
  enabled: boolean;
  star: string;
  certificateNumber: string;
  issuedYear: string;
  issuer: string;
  imagePaths: string[];
  status?: string;
  reason?: string;
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

const getOcopStatusLabel = (status?: string) => {
  switch (status) {
    case "PENDING_VERIFY":
      return "Đang chờ xác thực";
    case "VERIFIED":
      return "Đã xác thực";
    case "REJECTED":
      return "Bị từ chối";
    default:
      return status || "Chưa có trạng thái";
  }
};

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
  const [uploadingOcopImages, setUploadingOcopImages] = useState(false);
  const [deletingImages, setDeletingImages] = useState<Set<number>>(new Set());
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

  const [initialData, setInitialData] = useState<{
    product: ProductForm;
    ocop: OcopForm;
  } | null>(null);

  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [ocopErrors, setOcopErrors] = useState<Partial<OcopForm>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductForm> = {};
    const newOcopErrors: Partial<OcopForm> = {};

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
        newOcopErrors.imagePaths = [
          "Cần ít nhất một ảnh chứng nhận OCOP",
        ] as any;
      }
    }

    setErrors(newErrors);
    setOcopErrors(newOcopErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(newOcopErrors).length === 0
    );
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
          console.log("Product data from API:", result);

          let categoryId = result.category || "";

          if (categories.length > 0) {
            const foundCategory =
              findCategoryById(categories, result.category) ||
              findCategoryByName(categories, result.category);
            if (foundCategory) {
              categoryId = foundCategory.id;
            }
          }

          const productFormData: ProductForm = {
            name: result.name || "",
            description: result.description || "",
            price: result.price?.toString() || "",
            inventory: result.inventory?.toString() || "",
            thumbnail: result.thumbnail || "",
            unitPrice: result.unitPrice || "kg",
            categoryId: categoryId,
            imagePaths:
              result.images?.map((img: ImageResponse) => img.path) || [],
          };

          const ocopData: OcopForm = result.ocop
            ? {
                enabled: true,
                star: result.ocop.star?.toString() || "",
                certificateNumber: result.ocop.certificateNumber || "",
                issuedYear: result.ocop.issuedYear?.toString() || "",
                issuer: result.ocop.issuer || "",
                imagePaths:
                  result.ocop.images?.map((img: any) => img.url) || [],
                status: result.ocop.status,
                reason: result.ocop.reason,
              }
            : {
                enabled: false,
                star: "",
                certificateNumber: "",
                issuedYear: "",
                issuer: "",
                imagePaths: [],
              };

          setFormData(productFormData);
          setOcopFormData(ocopData);
          setInitialData({
            product: { ...productFormData },
            ocop: { ...ocopData },
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
  }, [productId, categories, toast, router]);

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

  const renderCategoryItem = (category: ICategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = formData.categoryId === category.id;

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
          {isSelected && <Check className="h-4 w-4 ml-auto text-blue-600" />}
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

  const handleOcopInputChange = (
    field: keyof OcopForm,
    value: string | boolean
  ) => {
    setOcopFormData((prev) => ({ ...prev, [field]: value }));
    if (ocopErrors[field as keyof OcopForm]) {
      setOcopErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
        if (error) throw new Error(error.message || "Upload failed");

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
      if (error) throw new Error(error.message || "Upload failed");

      if (imageUrls) {
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
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }

    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = "";
    }
  };

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
      if (error) throw new Error(error.message || "Upload failed");

      if (imageUrls) {
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
      toast({
        title: "Lỗi upload",
        description:
          error.message || "Không thể tải ảnh chứng nhận OCOP lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingOcopImages(false);
    }

    if (ocopImagesInputRef.current) {
      ocopImagesInputRef.current.value = "";
    }
  };

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
      if (error) throw new Error(error.message || "Upload failed");

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
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleAdditionalImagesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      UploadService.isImageFile(file)
    );

    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(files);
      if (error) throw new Error(error.message || "Upload failed");

      if (imageUrls) {
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
      toast({
        title: "Lỗi upload",
        description: error.message || "Không thể tải ảnh lên server",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleOcopImagesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      UploadService.isImageFile(file)
    );

    if (files.length === 0) return;

    setUploadingOcopImages(true);
    try {
      const [imageUrls, error] = await UploadService.uploadImages(files);
      if (error) throw new Error(error.message || "Upload failed");

      if (imageUrls) {
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
      toast({
        title: "Lỗi upload",
        description:
          error.message || "Không thể tải ảnh chứng nhận OCOP lên server",
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
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";

    if (thumbnailToDelete) {
      try {
        await UploadService.deleteFile(thumbnailToDelete);
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
    setDeletingImages((prev) => new Set(prev).add(index));

    try {
      setFormData((prev) => ({
        ...prev,
        imagePaths: prev.imagePaths.filter((_, i) => i !== index),
      }));

      await UploadService.deleteFile(imageToDelete);
      toast({
        title: "Đã xóa",
        description: "Ảnh đã được xóa",
      });
    } catch (error) {
      console.warn("Error deleting image:", error);
    } finally {
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const resetForm = async () => {
    setIsLoadingProduct(true);
    try {
      const [result, error] = await ProductService.getById(productId);
      if (error) throw new Error("Không thể tải lại thông tin sản phẩm");

      if (result) {
        let categoryId = result.category || "";
        if (categories.length > 0) {
          const foundCategory =
            findCategoryById(categories, result.category) ||
            findCategoryByName(categories, result.category);
          if (foundCategory) categoryId = foundCategory.id;
        }

        const productFormData: ProductForm = {
          name: result.name || "",
          description: result.description || "",
          price: result.price?.toString() || "",
          inventory: result.inventory?.toString() || "",
          thumbnail: result.thumbnail || "",
          unitPrice: result.unitPrice || "kg",
          categoryId: categoryId,
          imagePaths:
            result.images?.map((img: ImageResponse) => img.path) || [],
        };

        const ocopData: OcopForm = result.ocop
          ? {
              enabled: true,
              star: result.ocop.star?.toString() || "",
              certificateNumber: result.ocop.certificateNumber || "",
              issuedYear: result.ocop.issuedYear?.toString() || "",
              issuer: result.ocop.issuer || "",
              imagePaths: result.ocop.images?.map((img: any) => img.url) || [],
              status: result.ocop.status,
              reason: result.ocop.reason,
            }
          : {
              enabled: false,
              star: "",
              certificateNumber: "",
              issuedYear: "",
              issuer: "",
              imagePaths: [],
            };

        setFormData(productFormData);
        setOcopFormData(ocopData);
        setInitialData({
          product: { ...productFormData },
          ocop: { ...ocopData },
        });

        setErrors({});
        setOcopErrors({});
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        if (additionalImagesInputRef.current)
          additionalImagesInputRef.current.value = "";
        if (ocopImagesInputRef.current) ocopImagesInputRef.current.value = "";

        toast({
          title: "Đã khôi phục",
          description: "Dữ liệu đã được khôi phục về trạng thái ban đầu",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
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
      const isProductChanged =
        JSON.stringify(formData) !== JSON.stringify(initialData?.product);
      const isOcopChanged =
        JSON.stringify(ocopFormData) !== JSON.stringify(initialData?.ocop);

      let productUpdated = false;
      let ocopUpdated = false;

      if (isProductChanged) {
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

        const [result, error] = await ProductService.updateProduct(
          productId,
          productData
        );
        if (error) throw new Error(error.message);
        productUpdated = true;
      }

      const canUpdateOcop =
        ocopFormData.enabled &&
        (!initialData?.ocop.enabled || initialData?.ocop.status === "REJECTED");

      if (isOcopChanged && canUpdateOcop) {
        const ocopData = {
          star: parseInt(ocopFormData.star),
          certificateNumber: ocopFormData.certificateNumber,
          issuedYear: parseInt(ocopFormData.issuedYear),
          issuer: ocopFormData.issuer,
          imagePaths: ocopFormData.imagePaths,
        };

        const [result, error] = await ProductService.updateOcop(
          productId,
          ocopData
        );
        if (error) throw new Error(error.message);
        ocopUpdated = true;
      }

      if (productUpdated || ocopUpdated) {
        toast({
          title: "Cập nhật thành công!",
          description: "Thông tin sản phẩm đã được cập nhật",
        });
        router.push("/farm/product");
      } else {
        toast({
          title: "Thông báo",
          description: "Không có thay đổi nào để cập nhật",
        });
      }
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật sản phẩm.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const isOcopEditable =
    !ocopFormData.status || ocopFormData.status === "REJECTED";

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
                placeholder="Nhập mô tả"
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá bán (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={errors.price ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Đơn vị tính *</Label>
                <Select
                  value={formData.unitPrice}
                  onValueChange={(v) => handleInputChange("unitPrice", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory">Số lượng tồn kho *</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={(e) =>
                    handleInputChange("inventory", e.target.value)
                  }
                  className={errors.inventory ? "border-red-500" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OCOP Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Chứng nhận OCOP
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="ocop-enabled">Sản phẩm có chứng nhận OCOP</Label>
              <Switch
                id="ocop-enabled"
                checked={ocopFormData.enabled}
                disabled={!isOcopEditable && initialData?.ocop.enabled}
                onCheckedChange={(checked) =>
                  handleOcopInputChange("enabled", checked)
                }
              />
            </div>
          </CardHeader>
          {ocopFormData.enabled && (
            <CardContent className="space-y-4">
              {ocopFormData.status && (
                <div className="mb-4 space-y-2">
                  <Badge
                    variant={
                      ocopFormData.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    Trạng thái: {getOcopStatusLabel(ocopFormData.status)}
                    {!isOcopEditable && " - Không thể chỉnh sửa"}
                  </Badge>
                  {ocopFormData.status === "REJECTED" &&
                    ocopFormData.reason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        <p className="font-semibold mb-1">Lý do từ chối:</p>
                        <p>{ocopFormData.reason}</p>
                      </div>
                    )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số sao OCOP *</Label>
                  <Select
                    disabled={!isOcopEditable}
                    value={ocopFormData.star}
                    onValueChange={(v) => handleOcopInputChange("star", v)}
                  >
                    <SelectTrigger
                      className={ocopErrors.star ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Chọn số sao" />
                    </SelectTrigger>
                    <SelectContent>
                      {stars.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s} sao
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số chứng nhận *</Label>
                  <Input
                    disabled={!isOcopEditable}
                    value={ocopFormData.certificateNumber}
                    onChange={(e) =>
                      handleOcopInputChange("certificateNumber", e.target.value)
                    }
                    className={
                      ocopErrors.certificateNumber ? "border-red-500" : ""
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Năm cấp *</Label>
                  <Input
                    disabled={!isOcopEditable}
                    type="number"
                    value={ocopFormData.issuedYear}
                    onChange={(e) =>
                      handleOcopInputChange("issuedYear", e.target.value)
                    }
                    className={ocopErrors.issuedYear ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị cấp *</Label>
                  <Input
                    disabled={!isOcopEditable}
                    value={ocopFormData.issuer}
                    onChange={(e) =>
                      handleOcopInputChange("issuer", e.target.value)
                    }
                    className={ocopErrors.issuer ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ảnh chứng nhận OCOP *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver === "ocop"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  } ${
                    !isOcopEditable
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    isOcopEditable && ocopImagesInputRef.current?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    isOcopEditable && setDragOver("ocop");
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => isOcopEditable && handleOcopImagesDrop(e)}
                >
                  {uploadingOcopImages ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  ) : (
                    <>
                      <Plus className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Kéo thả hoặc click để tải ảnh
                      </p>
                    </>
                  )}
                  <input
                    ref={ocopImagesInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleOcopImagesChange}
                  />
                </div>
                {ocopFormData.imagePaths.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {ocopFormData.imagePaths.map((path, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video rounded-lg overflow-hidden border cursor-zoom-in"
                        onClick={() => setZoomedImage(path)}
                      >
                        <Image
                          src={path}
                          alt="OCOP"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                        </div>
                        {isOcopEditable && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOcopImagePath(idx);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 z-10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Hình ảnh sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hình ảnh sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Ảnh đại diện *</Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                  onClick={() => thumbnailInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver("thumb");
                  }}
                  onDrop={handleThumbnailDrop}
                >
                  {uploadingThumbnail ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  ) : (
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                  )}
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </div>
                {formData.thumbnail && (
                  <div
                    className="group relative aspect-square rounded-lg overflow-hidden border cursor-zoom-in"
                    onClick={() => setZoomedImage(formData.thumbnail)}
                  >
                    <Image
                      src={formData.thumbnail}
                      alt="thumb"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeThumbnail();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Ảnh mô tả thêm</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onClick={() => additionalImagesInputRef.current?.click()}
                onDrop={handleAdditionalImagesDrop}
              >
                {uploadingImages ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                )}
                <input
                  ref={additionalImagesInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAdditionalImagesChange}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {formData.imagePaths.map((path, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-lg overflow-hidden border cursor-zoom-in"
                    onClick={() => setZoomedImage(path)}
                  >
                    <Image
                      src={path}
                      alt="extra"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsThumbnail(path);
                        }}
                        className="bg-green-500 text-white rounded-full p-1"
                        title="Đặt làm ảnh đại diện"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImagePathWithAPI(idx);
                        }}
                        className="bg-red-500 text-white rounded-full p-1"
                        title="Xóa ảnh"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isLoading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Khôi phục
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Cập nhật sản phẩm
          </Button>
        </div>
      </form>

      {/* Full-screen Zoom Modal */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-none bg-transparent shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">Phóng to ảnh OCOP</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {zoomedImage && (
              <div className="relative w-full h-full min-h-[80vh] min-w-[80vw]">
                <Image
                  src={zoomedImage}
                  alt="Zoomed Certificate"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            )}
            <Button
              className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white border-none h-10 w-10 p-0"
              onClick={() => setZoomedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
