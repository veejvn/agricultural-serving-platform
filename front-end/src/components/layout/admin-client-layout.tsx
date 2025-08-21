"use client";

import type React from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { ROLES } from "@/contants/role";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/contants/router";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const hasAdminRole = user.roles?.includes(ROLES.ADMIN) || false;
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !hasAdminRole) {
      router.replace(ROUTES.ADMIN_LOGIN);
    }
    setTimeout(() => {
      setIsChecking(false);
    }, 1000);
  }, [isLoggedIn, hasAdminRole, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto p-6">{children}</div>
    </div>
  );
}
