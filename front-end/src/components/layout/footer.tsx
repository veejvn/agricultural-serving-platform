"use client";

import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon } from "@/icons/FacebookIcon";
import { XIcon } from "@/icons/XIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { YoutubeIcon } from "@/icons/YoutubeIcon";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null; // Không hiển thị footer trên các trang đăng nhập hoặc đăng ký
  }

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600 dark:text-green-500" />
              <span className="text-lg font-bold">Nông Nghiệp Thông Minh</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng hỗ trợ toàn diện cho nông dân Việt Nam với thông tin thời
              tiết, giá cả thị trường, diễn đàn trao đổi và các sản phẩm nông
              nghiệp chất lượng cao.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                <FacebookIcon className="size-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                <XIcon className="size-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                <InstagramIcon className="size-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                <YoutubeIcon className="size-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Tính năng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/weather"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Dự báo thời tiết
                </Link>
              </li>
              <li>
                <Link
                  href="/price"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Giá cả thị trường
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Diễn đàn trao đổi
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Sản phẩm nông nghiệp
                </Link>
              </li>
              <li>
                <Link
                  href="/lich-canh-tac"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Lịch canh tác
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/huong-dan"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/cau-hoi-thuong-gap"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Liên hệ hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  href="/bao-loi"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Báo lỗi
                </Link>
              </li>
              <li>
                <Link
                  href="/gop-y"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Góp ý cải thiện
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Pháp lý</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dieu-khoan"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/ban-quyen"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Bản quyền
                </Link>
              </li>
              <li>
                <Link
                  href="/giay-phep"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  Giấy phép hoạt động
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-500" />
                <span className="text-muted-foreground">
                  123 Đường Nông Nghiệp, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600 dark:text-green-500" />
                <Link
                  href="tel:+84912345678"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  0912 345 678
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-500" />
                <Link
                  href="mailto:info@nongnghiepthongminh.vn"
                  className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
                >
                  info@nongnghiepthongminh.vn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nông Nghiệp Thông Minh. Tất cả
              quyền được bảo lưu.
            </p>
            <div className="flex gap-4 text-sm">
              <Link
                href="/dieu-khoan"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                Điều khoản
              </Link>
              <Link
                href="/chinh-sach-bao-mat"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                Bảo mật
              </Link>
              <Link
                href="/cookie"
                className="text-muted-foreground hover:text-green-600 dark:hover:text-green-500"
              >
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
