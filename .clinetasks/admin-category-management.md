# 📝 Task: Admin – Category Management

## 🎯 Goal

Xây dựng tính năng Quản lý Danh mục cho admin:

- Xem danh sách danh mục với cấu trúc phân cấp
- Thêm, sửa, xóa danh mục
- Phân trang, tìm kiếm (ở front-end)

---

## 📁 Scope of Work

Modules được phép chỉnh sửa:

- [x] backend/
- [x] frontend/

Allowed file operations:

- [x] Read files
- [x] Modify files
- [x] Create files
- [ ] Delete files (chỉ khi cần)

---

## 📄 Files likely involved

### Backend (Spring Boot)

- controller/CategoryController.java
- service/CategoryService.java
- repository/CategoryRepository.java
- entities/Category.java
- dto/category/*
- mapper/CategoryMapper.java

### Frontend (Next.js)

- app/admin/category/page.tsx
- services/category.service.ts
- types/category.ts

---

## 📌 Requirements

### Backend

- API REST:
  - GET /api/categories
  - POST /api/categories
  - PUT /api/categories/{id}
  - DELETE /api/categories/{id}
- Bảo vệ API với ROLE_ADMIN
- Không thay đổi security flow tổng thể

### Frontend

- UI bảng danh mục (pagination, search)
- Modal create, update, delete
- API call tách riêng
- Đồng bộ state theo chuẩn dự án

---

## 🧪 Acceptance Criteria

- [ ] Admin xem danh sách danh mục với cấu trúc phân cấp có phân trang 
- [ ] Tìm kiếm theo tên
- [ ] Create, Update, Delete hoạt động (với confirm)
- [ ] Không phá layout
- [ ] API có validate và xử lý lỗi chuẩn (Xem file axios.tool.ts để biết cách call api chuẩn)

---

## ⚠️ Constraints

- Không thay đổi cấu trúc DB nếu không cần
- Nếu cần thêm cột mới → phải đề xuất
- Không refactor module lớn ngoài scope
- Tuân thủ coding style dự án
- Xem file axios.tool.ts để biết cách call api

---

## 📦 Output expected

Cline phải:

- Xuất PLAN chi tiết trước khi sửa
- Liệt kê file sẽ tạo/sửa
- ACT từng bước an toàn và không vượt phạm vi
