"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ICategoryRequest, ICategoryResponse } from "@/types/category";


// Mock data
const mockCategories: ICategoryResponse[] = [
  {
    id: "1",
    name: "Rau củ quả",
    parentId: null,
    level: 0,
    children: [
      {
        id: "2",
        name: "Rau lá xanh",
        parentId: "1",
        level: 1,
        children: [
          { id: "3", name: "Rau muống", parentId: "2", level: 2 },
          { id: "4", name: "Rau cải", parentId: "2", level: 2 },
        ],
      },
      {
        id: "5",
        name: "Củ quả",
        parentId: "1",
        level: 1,
        children: [
          { id: "6", name: "Khoai tây", parentId: "5", level: 2 },
          { id: "7", name: "Cà rót", parentId: "5", level: 2 },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Trái cây",
    parentId: null,
    level: 0,
    children: [
      {
        id: "9",
        name: "Trái cây nhiệt đới",
        parentId: "8",
        level: 1,
        children: [
          { id: "10", name: "Xoài", parentId: "9", level: 2 },
          { id: "11", name: "Dứa", parentId: "9", level: 2 },
        ],
      },
    ],
  },
  {
    id: "12",
    name: "Ngũ cốc",
    parentId: null,
    level: 0,
    children: [
      { id: "13", name: "Gạo", parentId: "12", level: 1 },
      { id: "14", name: "Lúa mì", parentId: "12", level: 1 },
    ],
  },
];

export default function AdminCategoryPage() {
  const [categories, setCategories] =
    useState<ICategoryResponse[]>(mockCategories);
  const [flatCategories, setFlatCategories] = useState<ICategoryResponse[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ICategoryResponse | null>(null);
  const [formData, setFormData] = useState<ICategoryRequest>({
    name: "",
    parentId: undefined,
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["1", "8", "12"])
  );

  // Flatten categories for easier manipulation
  useEffect(() => {
    const flatten = (cats: ICategoryResponse[]): ICategoryResponse[] => {
      const result: ICategoryResponse[] = [];
      const traverse = (items: ICategoryResponse[]) => {
        items.forEach((item) => {
          result.push(item);
          if (item.children) {
            traverse(item.children);
          }
        });
      };
      traverse(cats);
      return result;
    };
    setFlatCategories(flatten(categories));
  }, [categories]);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }

    const newCategory: ICategoryResponse = {
      id: Date.now().toString(),
      name: formData.name,
      parentId: formData.parentId || null,
      level: formData.parentId
        ? (flatCategories.find((c) => c.id === formData.parentId)?.level || 0) +
          1
        : 0,
      children: [],
    };

    // Add to categories tree
    if (formData.parentId) {
      const updateCategories = (
        cats: ICategoryResponse[]
      ): ICategoryResponse[] => {
        return cats.map((cat) => {
          if (cat.id === formData.parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCategory],
            };
          }
          if (cat.children) {
            return {
              ...cat,
              children: updateCategories(cat.children),
            };
          }
          return cat;
        });
      };
      setCategories(updateCategories(categories));
    } else {
      setCategories([...categories, newCategory]);
    }

    setFormData({ name: "", parentId: undefined });
    setIsCreateDialogOpen(false);
    toast({
      title: "Thành công",
      description: "Đã tạo danh mục mới",
    });
  };

  const handleEdit = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }

    const updateCategories = (
      cats: ICategoryResponse[]
    ): ICategoryResponse[] => {
      return cats.map((cat) => {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            name: formData.name,
            parentId: formData.parentId || null,
            level: formData.parentId
              ? (flatCategories.find((c) => c.id === formData.parentId)
                  ?.level || 0) + 1
              : 0,
          };
        }
        if (cat.children) {
          return {
            ...cat,
            children: updateCategories(cat.children),
          };
        }
        return cat;
      });
    };

    setCategories(updateCategories(categories));
    setEditingCategory(null);
    setFormData({ name: "", parentId: undefined });
    setIsEditDialogOpen(false);
    toast({
      title: "Thành công",
      description: "Đã cập nhật danh mục",
    });
  };

  const handleDelete = async (categoryId: string) => {
    const deleteFromCategories = (
      cats: ICategoryResponse[]
    ): ICategoryResponse[] => {
      return cats.filter((cat) => {
        if (cat.id === categoryId) {
          return false;
        }
        if (cat.children) {
          cat.children = deleteFromCategories(cat.children);
        }
        return true;
      });
    };

    setCategories(deleteFromCategories(categories));
    toast({
      title: "Thành công",
      description: "Đã xóa danh mục",
    });
  };

  const openEditDialog = (category: ICategoryResponse) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || undefined,
    });
    setIsEditDialogOpen(true);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (cats: ICategoryResponse[], level = 0): React.ReactNode[] => {
    return cats.map((category) => (
      <>
        <TableRow key={category.id} className="hover:bg-muted/50">
          <TableCell>
            <div
              className="flex items-center"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {category.children && category.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-2"
                  onClick={() => toggleExpanded(category.id)}
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCategories.has(category.id) ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              )}
              {category.children && category.children.length > 0 ? (
                expandedCategories.has(category.id) ? (
                  <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 mr-2 text-blue-500" />
                )
              ) : (
                <div className="w-4 h-4 mr-2" />
              )}
              <span className="font-medium">{category.name}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant={
                category.level === 0
                  ? "default"
                  : category.level === 1
                  ? "secondary"
                  : "outline"
              }
            >
              Cấp {category.level + 1}
            </Badge>
          </TableCell>
          <TableCell>
            {category.parentId ? (
              <span className="text-sm text-muted-foreground">
                {flatCategories.find((c) => c.id === category.parentId)?.name ||
                  "N/A"}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Danh mục gốc
              </span>
            )}
          </TableCell>
          <TableCell>
            <span className="text-sm text-muted-foreground">
              {category.children?.length || 0} danh mục con
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa danh mục "{category.name}"? Hành
                      động này sẽ xóa cả các danh mục con và không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(category.id)}
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TableCell>
        </TableRow>
        {category.children && expandedCategories.has(category.id) && (
          <>{renderCategoryTree(category.children, level + 1)}</>
        )}
      </>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý danh mục
          </h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục sản phẩm với cấu trúc phân cấp
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo danh mục mới</DialogTitle>
              <DialogDescription>
                Tạo một danh mục mới cho sản phẩm
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent">Danh mục cha (tùy chọn)</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      parentId: value === "none" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có danh mục cha</SelectItem>
                    {flatCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {"  ".repeat(category.level)}
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreate}>Tạo danh mục</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Tổng cộng {flatCategories.length} danh mục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Danh mục cha</TableHead>
                <TableHead>Danh mục con</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderCategoryTree(categories)}</TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Tên danh mục</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent">Danh mục cha (tùy chọn)</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    parentId: value === "none" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có danh mục cha</SelectItem>
                  {flatCategories
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {"  ".repeat(category.level)}
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEdit}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
