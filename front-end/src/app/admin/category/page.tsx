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
import {
  Category,
  CategoryTreeNode,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";
import categoryService from "@/services/category.service";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    parentId: undefined,
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCategories = async () => {
    try {
      const [result, error] = await categoryService.getAllCategories();
      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh mục",
          variant: "destructive",
        });
        return;
      }
      if (result) {
        setCategories(result);
        const flatten = (cats: CategoryTreeNode[]): Category[] => {
          const flatResult: Category[] = [];
          const traverse = (items: CategoryTreeNode[]) => {
            items.forEach((item) => {
              flatResult.push({
                id: item.id,
                name: item.name,
                parentId: item.parentId,
                level: item.level,
              });
              if (item.children) {
                traverse(item.children);
              }
            });
          };
          traverse(cats);
          return flatResult;
        };
        setFlatCategories(flatten(result));
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tải danh mục",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      const [result, error] = await categoryService.createCategory(formData);
      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tạo danh mục",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Thành công",
        description: "Đã tạo danh mục mới",
        variant: "success",
      });
      setFormData({ name: "", parentId: undefined });
      setIsCreateDialogOpen(false);
      fetchCategories(); // Refresh categories
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tạo danh mục",
        variant: "destructive",
      });
    }
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

    try {
      const updateRequest: UpdateCategoryRequest = {
        name: formData.name,
        parentId: formData.parentId,
      };
      const [result, error] = await categoryService.updateCategory(
        editingCategory.id,
        updateRequest
      );
      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể cập nhật danh mục",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Thành công",
        description: "Đã cập nhật danh mục",
        variant: "success",
      });
      setEditingCategory(null);
      setFormData({ name: "", parentId: undefined });
      setIsEditDialogOpen(false);
      fetchCategories(); // Refresh categories
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi cập nhật danh mục",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const [result, error] = await categoryService.deleteCategory(categoryId);
      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể xóa danh mục",
          variant: "destructive",
        });
        throw error; // Ném lỗi để .catch có thể bắt
      }
      // Nếu không có lỗi, hiển thị toast thành công
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục",
        variant: "success",
      });
      return result; // Trả về kết quả để .then có thể xử lý
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi xóa danh mục",
        variant: "destructive",
      });
      throw error; // Ném lỗi để .catch có thể bắt
    }
  };

  const openEditDialog = (category: Category) => {
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

  const filterCategories = (
    cats: CategoryTreeNode[],
    term: string
  ): CategoryTreeNode[] => {
    if (!term) return cats;

    const lowerCaseTerm = term.toLowerCase();
    const filtered: CategoryTreeNode[] = [];

    cats.forEach((category) => {
      const matches = category.name.toLowerCase().includes(lowerCaseTerm);
      const childrenFiltered = category.children
        ? filterCategories(category.children, term)
        : [];

      if (matches || childrenFiltered.length > 0) {
        filtered.push({
          ...category,
          children: childrenFiltered,
        });
      }
    });
    return filtered;
  };

  const renderCategoryTree = (
    cats: CategoryTreeNode[],
    level = 0
  ): React.ReactNode[] => {
    return cats.flatMap((category) => [
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
            <span className="text-sm text-muted-foreground">Danh mục gốc</span>
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
                    onClick={async () => {
                      await handleDelete(category.id);
                      await fetchCategories();
                    }}
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>,
      ...(category.children && expandedCategories.has(category.id)
        ? renderCategoryTree(category.children, level + 1)
        : []),
    ]);
  };

  const filteredCategories = filterCategories(categories, searchTerm);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
                  <SelectContent className="h-45 overflow-y-auto">
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

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Tổng cộng {filteredCategories.length} danh mục
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
            <TableBody>{renderCategoryTree(currentItems)}</TableBody>
          </Table>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
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
                <SelectContent className="h-45 overflow-y-auto">
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
