# Nền tảng phục vụ nông nghiệp - Giao diện người dùng (Front-end)

Dự án này là giao diện người dùng (front-end) của "Nền tảng phục vụ nông nghiệp", được xây dựng để kết nối nông dân và người tiêu dùng, cung cấp thông tin hữu ích và hỗ trợ quản lý hiệu quả.

## Công nghệ sử dụng

Dự án front-end được phát triển bằng các công nghệ sau:

*   **Framework:** [Next.js](https://nextjs.org) 15.3.5 (sử dụng [App Router](https://nextjs.org/docs/app))
*   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Framework:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
*   **Quản lý trạng thái:** [Zustand](https://zustand-demo.pmnd.rs/)
*   **Quản lý biểu mẫu:** [React Hook Form](https://react-hook-form.com/) kết hợp với [Zod](https://zod.dev/) để xác thực
*   **Fetching dữ liệu:** [Axios](https://axios-http.com/)
*   **Package Manager:** npm

## Bắt đầu

Để thiết lập và chạy dự án trên môi trường phát triển cục bộ, hãy làm theo các bước sau:

1.  **Cài đặt Dependencies:**
    Mở terminal trong thư mục `front-end` và chạy lệnh sau để cài đặt tất cả các gói cần thiết:

    ```bash
    npm install
    ```

2.  **Khởi chạy Server phát triển:**
    Sau khi cài đặt xong, bạn có thể khởi chạy server phát triển:

    ```bash
    npm run dev
    ```

    Ứng dụng sẽ chạy trên [http://localhost:4000](http://localhost:4000). Mở trình duyệt của bạn và truy cập địa chỉ này để xem kết quả. Trang sẽ tự động cập nhật khi bạn chỉnh sửa các tệp mã nguồn.

## Các tập lệnh có sẵn

Trong thư mục dự án, bạn có thể chạy các tập lệnh sau:

*   **`npm run dev`**: Khởi chạy ứng dụng ở chế độ phát triển.
    Mở [http://localhost:4000](http://localhost:4000) để xem trên trình duyệt.

*   **`npm run build`**: Xây dựng ứng dụng cho môi trường production.
    Tạo ra thư mục `.next` chứa các tệp đã được tối ưu hóa.

*   **`npm run start`**: Khởi chạy server production.
    Sử dụng lệnh này sau khi đã chạy `npm run build`.

*   **`npm run lint`**: Chạy ESLint để kiểm tra và báo cáo các vấn đề về mã nguồn.

## Tìm hiểu thêm

Để tìm hiểu thêm về Next.js, bạn có thể tham khảo các tài nguyên sau:

*   [Next.js Documentation](https://nextjs.org/docs) - Tìm hiểu về các tính năng và API của Next.js.
*   [Learn Next.js](https://nextjs.org/learn) - Hướng dẫn tương tác về Next.js.

Bạn có thể xem [kho lưu trữ GitHub của Next.js](https://github.com/vercel/next.js) để đóng góp hoặc gửi phản hồi.

## Triển khai trên Vercel

Cách dễ nhất để triển khai ứng dụng Next.js của bạn là sử dụng [Nền tảng Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) từ những người tạo ra Next.js.

Kiểm tra [tài liệu triển khai Next.js](https://nextjs.org/docs/app/building-your-application/deploying) của chúng tôi để biết thêm chi tiết.
