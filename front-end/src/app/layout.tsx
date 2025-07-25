import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RootClientLayout from "@/components/layout/root-client-layout";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Nông Nghiệp Thông Minh",
  description: "Nền tảng hỗ trợ nông dân Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <RootClientLayout>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </RootClientLayout>
        </Providers>
      </body>
    </html>
  );
}
