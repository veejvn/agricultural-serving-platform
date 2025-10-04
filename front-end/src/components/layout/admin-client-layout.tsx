"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { ROLES } from "@/contants/role";
import { ROUTES } from "@/contants/router";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkAuth = useCallback(() => {
    const isAuthenticated =
      isLoggedIn && user && user.roles?.includes(ROLES.ADMIN);

    if (!isAuthenticated) {
      router.replace(ROUTES.ADMIN_LOGIN);
    }
    setIsChecking(false);
  }, [isLoggedIn, user, router]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [hasHydrated, checkAuth]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-full bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
