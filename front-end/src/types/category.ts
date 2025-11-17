export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: number;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  parentId?: string;
}
