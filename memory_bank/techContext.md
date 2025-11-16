# Bối cảnh kỹ thuật

## Công nghệ sử dụng

### Back-end

- **Ngôn ngữ:** Java 21
- **Framework:** Spring Boot 3.3.4
- **Xác thực:** Spring Security, JWT
- **Cơ sở dữ liệu:** MySQL
- **ORM:** Spring Data JPA (Hibernate)
- **Build tool:** Maven
- **Containerization:** Docker (cho ứng dụng, không phải DB)

### Front-end

- **Framework:** Next.js 15.3.5 (App Router)
- **Ngôn ngữ:** TypeScript
- **UI Framework:** Tailwind CSS v4, shadcn/ui
- **Quản lý trạng thái:** Zustand
- **Form:** React Hook Form, Zod
- **Fetching dữ liệu:** Axios
- **Package manager:** npm

## Thiết lập môi trường phát triển

- **Back-end:** Chạy ứng dụng Spring Boot bằng Maven.
- **Front-end:** Chạy server phát triển Next.js bằng lệnh `npm run dev`.
- **Cơ sở dữ liệu:** Kết nối tới instance MySQL được cài đặt cục bộ trên máy.

## Ràng buộc kỹ thuật

- Cần đảm bảo hiệu suất của API để đáp ứng lượng truy cập lớn.
- Giao diện người dùng phải có khả năng đáp ứng (responsive) để hoạt động tốt trên cả máy tính và thiết bị di động.
- Tuân thủ các quy tắc bảo mật để bảo vệ dữ liệu người dùng.
