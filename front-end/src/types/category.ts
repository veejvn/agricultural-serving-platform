export interface ICategoryRequest {
    name: string;
    parentId?: string;
}

export interface ICategoryResponse {
    id: string;
    name: string;
    parentId: string | null;
    level: number;
    children?: ICategoryResponse[];
}