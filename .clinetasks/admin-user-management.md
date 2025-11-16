# 📝 Task: Admin – User Management

## 🎯 Goal

Xây dựng tính năng Quản lý Người Dùng cho admin:

- Xem danh sách người dùng (search)
- Xem chi tiết
- Xóa người dùng

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

- controller/admin/AccountController.java
- service/AccountService.java
- repositorie/AccountRepository.java
- entitie/Account.java
- dto/AccountRequest.java
- dto/AccountResponse.java

### Frontend (Next.js)

- app/admin/user/page.tsx
- app/admin/users/[id]/page.tsx (nếu chưa có, hãy tạo file)
- services/account.service.ts
- types/account.ts

---

## 📌 Requirements

### Backend

- API REST:
  - GET /api/accounts/all
  - GET /api/accounts/{id}
  - DELETE /api/accounts/{id}
- Bảo vệ API với ROLE_ADMIN
- Không thay đổi security flow tổng thể

### Frontend

- UI bảng người dùng (search, sort, pagination)
- Trang chi tiết người dùng
- Modal delete
- API call tách riêng
- Đồng bộ state theo chuẩn dự án

---

## 🧪 Acceptance Criteria

- [ ] Admin xem danh sách user có phân trang
- [ ] Tìm kiếm theo tên/email/ID
- [ ] Xem đúng chi tiết user
- [ ] Delete hoạt động (với confirm)
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
