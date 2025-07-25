"use client";

import LoadingSpinner from "@/components/common/loading-spinner";
import { ROUTES } from "@/contants/router.contant";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayoutClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasHydrated = useAuthStore.persist.hasHydrated; // ✅ Đợi Zustand khởi tạo xong
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return; // ❌ Chưa hydrate thì không kiểm tra login

    if (!isLoggedIn) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoggedIn, hasHydrated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Đã hydrate nhưng không login, đang redirect
  }

  return <>{children}</>;
}
