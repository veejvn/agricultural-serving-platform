"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import LoadingSpinner from "@/components/common/loading-spinner";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { FarmerSidebar } from "@/components/farmer/sidebar";
import { ROUTES } from "@/contants/router.contant";

function FarmerLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:flex-shrink-0">
        <FarmerSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Check if user has FARMER role
  const hasFarmerRole = user.roles?.includes("FARMER") || false;

  useEffect(() => {
    // Only check role if user data is loaded (not null)
    if (user.id !== null && !hasFarmerRole) {
      router.replace(ROUTES.NOT_FOUND);
    }
  }, [user.id, hasFarmerRole, router]);

  // Show loading while user data is being fetched
  if (user.id === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if no farmer role (this should be handled by useEffect, but just in case)
  if (!hasFarmerRole) {
    return null;
  }

  return (
    <SidebarProvider>
      <FarmerLayoutContent>{children}</FarmerLayoutContent>
    </SidebarProvider>
  );
}
