import AuthClientLayout from "@/components/layout/auth-client-layout";
import type React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthClientLayout>{children}</AuthClientLayout>;
}
