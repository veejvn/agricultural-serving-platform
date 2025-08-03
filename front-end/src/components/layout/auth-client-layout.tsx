"use client";

import LoadingSpinner from "@/components/common/loading-spinner";
import { ROUTES } from "@/contants/router.contant";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const redirect = useAuthStore((state) => state.redirect);
  const setRedirect = useAuthStore.getState().setRedirect;
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    // console.log(
    //   "AuthClientLayout - isLoggedIn:",
    //   isLoggedIn,
    //   "redirect:",
    //   redirect
    // );
    if (isLoggedIn && isReady) {
      const redirectPath = redirect || ROUTES.HOME;
      console.log("AuthClientLayout - Navigating to:", redirectPath);
      setRedirect("/"); // Reset redirect
      router.replace(redirectPath);
    }
  }, [isLoggedIn]); // Chỉ listen vào isLoggedIn

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
