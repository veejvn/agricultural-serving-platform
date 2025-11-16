# 📝 Task: Admin – Product Management

## 🎯 Goal

Xây dựng tính năng Quản lý Sản phẩm cho admin:

- Xem danh sách tất cả sản phẩm dành cho admin (search)
- Xem chi tiết sản phẩm
- Thực hiện các thao tác ACTIVE, REJECT, BLOCK, DELETE (soft delete) sản phẩm (đổi trạng thái sản phẩm)
- Khi fammer tạo sản phẩm, nó sẽ luôn ở trang thái ACTIVE, mặc dù theo đúng luồng thì phải là PENDING -> ACTIVE hoặc REJECT, 
nhưng cứ tạo tính năng duyệt sản phẩm, sau này sẽ sửa đổi sau

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

- controller/ProductController.java
- service/ProductService.java
- repository/ProductRepository.java
- entities/Product.java
- dto/product/*
- mapper/ProductMapper.java

### Frontend (Next.js)

- app/admin/product/page.tsx
- app/admin/product/[id]/page.tsx (nếu chưa có thì tạo)
- services/product.service.ts
- types/product.ts

---

## 📌 Requirements

### Backend

- API REST:
  - GET /api/products/admin
  - GET /api/products/{id}
  - POST /api/products/change-status
  - DELETE /api/products/{id}
- Bảo vệ API với ROLE_ADMIN
- Không thay đổi security flow tổng thể

### Frontend

- UI bảng sản phẩm (search, sort, pagination)
- Trang chi tiết sản phẩm
- Modal delete
- Model đổi trạng thái sản phẩm
- API call tách riêng
- Đồng bộ state theo chuẩn dự án

---

## 🧪 Acceptance Criteria

- [ ] Admin xem danh sách sản phẩm có phân trang
- [ ] Tìm kiếm theo tên/danh mục/nông dân/trạng thái
- [ ] Xem đúng chi tiết product
- [ ] Delete hoạt động (với confirm)
- [ ] Đổi trạng thái hoạt động
- [ ] Không phá layout
- [ ] API có validate và xử lý lỗi chuẩn

---

## ⚠️ Constraints

- Không thay đổi cấu trúc DB nếu không cần
- Nếu cần thêm cột mới → phải đề xuất
- Không refactor module lớn ngoài scope
- Tuân thủ coding style dự án

---

## 📦 Output expected

Cline phải:

- Xuất PLAN chi tiết trước khi sửa
- Liệt kê file sẽ tạo/sửa
- ACT từng bước an toàn và không vượt phạm vi
