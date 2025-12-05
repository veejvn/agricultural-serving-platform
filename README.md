# Nền Tảng Phục Vụ Nông Nghiệp (Agricultural Serving Platform)

Dự án này là một nền tảng web toàn diện được thiết kế để hỗ trợ ngành nông nghiệp bằng cách kết nối nông dân, người tiêu dùng và cung cấp các công cụ và thông tin cần thiết.

## Cấu trúc dự án

Dự án được chia thành hai phần chính:

-   `back-end/`: Một ứng dụng Spring Boot xử lý logic nghiệp vụ, API và quản lý cơ sở dữ liệu.
-   `front-end/`: Một ứng dụng Next.js cung cấp giao diện người dùng (UI) cho nền tảng.

## Hướng dẫn cài đặt

Để thiết lập và chạy dự án này trên máy cục bộ của bạn, hãy làm theo các hướng dẫn bên dưới cho từng phần.

### 1. Back-end (Spring Boot)

**Yêu cầu:**

*   Java Development Kit (JDK) 17 trở lên.
*   Apache Maven.
*   Một hệ quản trị cơ sở dữ liệu (ví dụ: PostgreSQL, MySQL).

**Các bước cài đặt:**

1.  **Cấu hình biến môi trường:**
    Tạo một tệp `.env` trong thư mục gốc `back-end/` và điền các thông tin cần thiết dựa trên tệp `back-end/HELP.md`. Các biến này bao gồm cấu hình cơ sở dữ liệu, dịch vụ mail, OAuth2, Cloudinary và các cài đặt ứng dụng khác.

    ```env
    # Data source
    DATASOURCE_URL=
    DATASOURCE_USERNAME=
    DATASOURCE_PASSWORD=


    # Mail
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_SECURE=false
    MAIL_USER=
    MAIL_PASSWORD=



    # OAuth2
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    FACEBOOK_CLIENT_ID=
    FACEBOOK_CLIENT_SECRET=



    # App
    PORT=8080
    JWT_ACCESS_SECRET=
    JWT_ACCESS_EXPIRATION=3600000
    JWT_REFRESH_SECRET=
    JWT_REFRESH_EXPIRATION=1314000000
    ADMIN_EMAIL=admin@gmail.com
    ADMIN_PASSWORD=admin@password
    CLIENT_RECEIVE_TOKENS_PATH=http://localhost:3000/auth/receive-tokens

    #Cloudinary
    CLOUDINARY_NAME=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_API_KEY=
    CLOUDINARY_FOLDER=
    ```

2.  **Chạy ứng dụng:**
    Mở terminal trong thư mục `back-end/` và chạy lệnh sau:

    ```bash
    ./mvnw spring-boot:run
    ```

    Máy chủ back-end sẽ khởi động trên cổng được định nghĩa trong tệp `.env` của bạn (mặc định là `8080`).

### 2. Front-end (Next.js)

**Yêu cầu:**

*   Node.js (phiên bản 18.x hoặc mới hơn).
*   npm (thường được cài đặt cùng với Node.js).

**Các bước cài đặt:**

1.  **Cài đặt các gói phụ thuộc:**
    Mở terminal trong thư mục `front-end/` và chạy lệnh sau:

    ```bash
    npm install
    ```

2.  **Khởi chạy máy chủ phát triển:**
    Sau khi cài đặt xong, chạy lệnh sau để khởi động máy chủ:

    ```bash
    npm run dev
    ```

    Ứng dụng front-end sẽ chạy tại `http://localhost:4000`.

## Công nghệ sử dụng

### Back-end
*   **Framework:** Spring Boot
*   **Ngôn ngữ:** Java
*   **Cơ sở dữ liệu:** Hỗ trợ nhiều loại (ví dụ: PostgreSQL, MySQL)
*   **Xác thực:** JWT (JSON Web Tokens), OAuth2

### Front-end
*   **Framework:** Next.js
*   **Ngôn ngữ:** TypeScript
*   **UI Framework:** Tailwind CSS, shadcn/ui
*   **Quản lý trạng thái:** Zustand
*   **Quản lý biểu mẫu:** React Hook Form với Zod
