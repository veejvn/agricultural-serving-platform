# HƯỚNG DẪN CẤU HÌNH VÀ TRIỂN KHAI DỰ ÁN

Tài liệu này cung cấp hướng dẫn chi tiết về cách cấu hình và triển khai dự án của bạn, bao gồm việc thiết lập các biến môi trường và các bước cần thiết khác.

## 1. Tạo File `.env` Trong Thư Mục Gốc Dự Án

Trước tiên, tạo một file có tên `.env` trong thư mục gốc của dự án. File này sẽ chứa tất cả các biến môi trường cần thiết cho ứng dụng của bạn.

## 2. Thêm Các Biến Môi Trường Vào File `.env`

Sao chép và dán đoạn mã sau vào file `.env` của bạn:

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