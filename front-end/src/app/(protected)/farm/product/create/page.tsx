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
} from "lucide-react";
import ProductService from "@/services/product.service";
import categoryService from "@/services/category.service";
import { ICategory } from "@/types/product";
import Image from "next/image";

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

const units = ["kg", "gram", "lạng", "tấn", "quả", "bó", "túi", "hộp"];

export default function AddProductPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
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

  // Hàm render categories theo dạng cây
  const renderCategoryTree = (
    categories: ICategory[],
    level = 0
  ): React.ReactNode[] => {
    return categories
      .map((category) => {
        const indent = "    ".repeat(level); // Tạo khoảng trắng để thể hiện level
        let prefix = "";

        if (level > 0) {
          prefix = level === 1 ? "├─ " : "└─ ";
        }

        return [
          <SelectItem key={category.id} value={category.id}>
            <span className="font-mono">
              {indent}
              {prefix}
              {category.name}
            </span>
          </SelectItem>,
          // Render children nếu có
          ...(category.children && category.children.length > 0
            ? renderCategoryTree(category.children, level + 1)
            : []),
        ];
      })
      .flat();
  };

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Convert file to base64 URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        try {
          const dataURL = await fileToDataURL(file);
          setFormData((prev) => ({ ...prev, thumbnail: dataURL }));
          if (errors.thumbnail) {
            setErrors((prev) => ({ ...prev, thumbnail: undefined }));
          }
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Không thể đọc file ảnh",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "File không hợp lệ",
          description: "Vui lòng chọn file ảnh (jpg, png, gif, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  // Handle additional images file selection
  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        try {
          const dataURL = await fileToDataURL(file);
          if (!formData.imagePaths.includes(dataURL)) {
            setFormData((prev) => ({
              ...prev,
              imagePaths: [...prev.imagePaths, dataURL],
            }));
          }
        } catch (error) {
          toast({
            title: "Lỗi",
            description: `Không thể đọc file ${file.name}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "File không hợp lệ",
          description: `File ${file.name} không phải là ảnh`,
          variant: "destructive",
        });
      }
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
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      try {
        const dataURL = await fileToDataURL(imageFile);
        setFormData((prev) => ({ ...prev, thumbnail: dataURL }));
        if (errors.thumbnail) {
          setErrors((prev) => ({ ...prev, thumbnail: undefined }));
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể đọc file ảnh",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "File không hợp lệ",
        description: "Vui lòng kéo thả file ảnh",
        variant: "destructive",
      });
    }
  };

  // Handle drag and drop for additional images
  const handleAdditionalImagesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    for (const file of files) {
      try {
        const dataURL = await fileToDataURL(file);
        if (!formData.imagePaths.includes(dataURL)) {
          setFormData((prev) => ({
            ...prev,
            imagePaths: [...prev.imagePaths, dataURL],
          }));
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: `Không thể đọc file ${file.name}`,
          variant: "destructive",
        });
      }
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
      inventory: "50",
      thumbnail:
        "https://bizweb.dktcdn.net/100/482/702/products/2.jpg?v=1750734146287",
      unitPrice: "kg",
      categoryId: sampleCategoryId,
      imagePaths: [
        "https://bizweb.dktcdn.net/100/482/702/products/2.jpg?v=1750734146287",
      ],
    });
    setErrors({});
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
    setErrors({});
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (additionalImagesInputRef.current)
      additionalImagesInputRef.current.value = "";
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

      console.log("Sending product data:", productData);

      // Gọi API tạo sản phẩm
      // const [result, error] = await ProductService.createProduct(productData);

      // if (error) {
      //   throw new Error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
      // }

      // if (result) {
      //   toast({
      //     title: "Thêm sản phẩm thành công!",
      //     description: `Sản phẩm "${formData.name}" đã được thêm vào hệ thống`,
      //   });
      //   resetForm();
      // }
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thêm sản phẩm mới
        </h1>
        <p className="text-gray-600">
          Điền thông tin chi tiết để thêm sản phẩm vào cửa hàng
        </p>
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
                <Label htmlFor="name">Tên sản phẩm *</Label>
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
                <Label htmlFor="categoryId">Danh mục *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleInputChange("categoryId", value)
                  }
                  disabled={categoriesLoading}
                >
                  <SelectTrigger
                    className={errors.categoryId ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Đang tải danh mục..."
                          : "Chọn danh mục"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="" disabled>
                        Đang tải danh mục...
                      </SelectItem>
                    ) : categories.length > 0 ? (
                      renderCategoryTree(categories)
                    ) : (
                      <SelectItem value="" disabled>
                        Không có danh mục nào
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Mô tả sản phẩm *</Label>
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
                <Label htmlFor="price">Giá bán (VNĐ) *</Label>
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
                <Label htmlFor="unitPrice">Đơn vị tính</Label>
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
                <Label htmlFor="inventory">Số lượng tồn kho *</Label>
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
              <Label>Ảnh đại diện *</Label>
              <div className="mt-2">
                {formData.thumbnail ? (
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
                            size="sm"
                            variant="destructive"
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
              <Label>Ảnh bổ sung</Label>
              <div className="mt-2">
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
