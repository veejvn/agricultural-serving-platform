"use client";

import useInitialApp from "@/hooks/useInitialApp";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitialApp();

  return <>{children}</>;
}
