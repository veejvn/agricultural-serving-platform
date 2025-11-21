import PublicClientLayout from "@/components/layout/PublicClientLayout";
import type React from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicClientLayout>{children}</PublicClientLayout>;
}