import ProtectedLayoutClientLayout from "@/components/layout/protected-client-layout";
import type React from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutClientLayout>{children}</ProtectedLayoutClientLayout>;
}
