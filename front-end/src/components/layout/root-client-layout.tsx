"use client";

import { useRef, useEffect } from "react";
import useInitialApp from "@/hooks/useInitialApp";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitialApp();

  return <>{children}</>;
}
