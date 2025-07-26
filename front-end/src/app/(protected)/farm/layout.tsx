"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import LoadingSpinner from "@/components/common/loading-spinner";

import { FarmerSidebar } from "@/components/farmer/sidebar";

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
      router.replace("/not-found");
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
    <div className="flex overflow-hidden">
      <div className="hidden md:flex md:w-54 md:flex-col">
        <FarmerSidebar />
      </div>
      <div className="flex flex-1 flex-col p-6">{children}</div>
    </div>
  );
}
