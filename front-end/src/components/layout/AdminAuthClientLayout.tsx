"use client";

import LoadingSpinner from "@/components/common/loading-spinner";
import { ROUTES } from "@/contants/router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminAuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn && isReady) {
      router.replace(ROUTES.ADMIN);
    }
  }, [isLoggedIn, isReady, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
