import AdminAuthClientLayout from "@/components/layout/AdminAuthClientLayout";
import type React from "react";

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAuthClientLayout>{children}</AdminAuthClientLayout>;
}