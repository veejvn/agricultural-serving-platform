"use client";

import LoadingSpinner from "@/components/common/loading-spinner";
import { ROUTES } from "@/contants/router.contant";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function ProtectedLayoutClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use individual selectors to avoid object recreation
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const [hasHydrated, setHasHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  // Memoized auth check function
  const checkAuth = useCallback(() => {
    const isAuthenticated =
      isLoggedIn && refreshToken && refreshToken.trim() !== "";

    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    } else {
      setIsChecking(false);
    }
  }, [isLoggedIn, refreshToken, router]);

  // Effect for hydration - only runs once
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Effect for auth checking - only when hydrated and auth state changes
  useEffect(() => {
    if (!hasHydrated) return;

    // Small delay to ensure Zustand store is restored from localStorage
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [hasHydrated, checkAuth]);

  // Hiển thị loading khi chưa hydrate hoặc đang kiểm tra auth
  if (!hasHydrated || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Kiểm tra lại một lần nữa trước khi render children
  const isAuthenticated =
    isLoggedIn && refreshToken && refreshToken.trim() !== "";
  if (!isAuthenticated) {
    return null; // Đang redirect hoặc chưa authenticated
  }

  return <>{children}</>;
}
