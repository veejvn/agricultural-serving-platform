# Các mẫu hệ thống

## Kiến trúc tổng quan

Hệ thống được xây dựng theo kiến trúc client-server.

- **Client (Front-end):** Là một ứng dụng Single Page Application (SPA) được xây dựng bằng Next.js, chịu trách nhiệm hiển thị giao diện người dùng và tương tác với người dùng.
- **Server (Back-end):** Là một ứng dụng RESTful API được xây dựng bằng Spring Boot, chịu trách nhiệm xử lý logic nghiệp vụ, truy cập cơ sở dữ liệu và cung cấp dữ liệu cho client.

## Các quyết định kỹ thuật quan trọng

- **Sử dụng RESTful API:** Giúp cho việc giao tiếp giữa front-end và back-end trở nên rõ ràng, dễ dàng mở rộng và bảo trì.
- **Xác thực bằng JWT:** Cung cấp một cơ chế xác thực an toàn và không trạng thái (stateless), phù hợp với kiến trúc RESTful.
- **Sử dụng Next.js App Router:** Tận dụng các tính năng mới nhất của Next.js như Server Components và Layouts để tối ưu hóa hiệu suất và trải nghiệm người dùng.

## Luồng dữ liệu chính

1.  Người dùng tương tác với giao diện trên trình duyệt.
2.  Front-end gửi yêu cầu HTTP (sử dụng Axios) đến Back-end API.
3.  Back-end xử lý yêu cầu, tương tác với cơ sở dữ liệu MySQL nếu cần.
4.  Back-end trả về dữ liệu dưới dạng JSON cho Front-end.
5.  Front-end cập nhật giao diện người dùng dựa trên dữ liệu nhận được.
