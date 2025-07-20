"use client"

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ReceiveTokens() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useAuthStore.getState().redirect;
  const setTokens = useAuthStore.getState().setTokens;

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      router.push(redirect);
    } else {
      router.push("/login");
    }
  }, [searchParams]);
  return null;
}
