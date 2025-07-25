"use client";

// hooks/useInitialApp.ts
import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthService from "@/services/auth.service";
import env from "@/contants/env.contant";
import { useUserStore } from "@/stores/useUserStore";

const useInitialApp = () => {
  const hasRunRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Store selectors
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshTokenString = useAuthStore((state) => state.refreshToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const fetchUser = useUserStore((state) => state.fetchUser);

  // Cleanup interval
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Memoized refresh token function
  const refreshToken = useCallback(async () => {
    if (!refreshTokenString) return false;

    //console.log("Refresh token: " + refreshTokenString);

    try {
      const [result, error] = await AuthService.refreshToken(
        refreshTokenString
      );

      if (error) {
        console.error("Refresh token failed:", error);
        setIsLoggedIn(false);
        setTokens("", "");
        return false;
      }

      const { accessToken } = result;
      setAccessToken(accessToken);
      return true;
    } catch (error) {
      console.error("Refresh token error:", error);
      setIsLoggedIn(false);
      setTokens("", "");
      return false;
    }
  }, [refreshTokenString, setIsLoggedIn, setTokens, setAccessToken]);

  // Initialize app data - chỉ chạy khi thực sự cần thiết
  const initializeApp = useCallback(async () => {
    console.log("🚀 Initializing app...", {
      isLoggedIn,
      hasRefreshToken: !!refreshTokenString,
      hasRun: hasRunRef.current,
    });

    // Chỉ skip nếu đã chạy thành công trước đó VÀ vẫn đang login
    if (hasRunRef.current && isLoggedIn && refreshTokenString) {
      console.log("⏭️ Skip initialization - already initialized");
      return;
    }

    if (!isLoggedIn || !refreshTokenString) {
      console.log("❌ Skip initialization - not logged in or no refresh token");
      hasRunRef.current = false; // Reset để có thể chạy lại khi login
      return;
    }

    try {
      hasRunRef.current = true; // Đánh dấu đang chạy

      // Refresh token first
      const success = await refreshToken();

      // Only fetch user if token refresh was successful
      if (success) {
        console.log("✅ Token refreshed, fetching user...");
        await fetchUser();
        console.log("🎉 App initialization completed!");
      } else {
        hasRunRef.current = false; // Reset nếu thất bại
      }
    } catch (error) {
      console.error("Initialize app failed:", error);
      hasRunRef.current = false; // Reset nếu có lỗi
    }
  }, [isLoggedIn, refreshTokenString, refreshToken, fetchUser]);

  // Setup token refresh interval
  const setupInterval = useCallback(() => {
    cleanup(); // Clear existing interval

    console.log("⏰ Setting up refresh token interval", {
      isLoggedIn,
      hasRefreshToken: !!refreshTokenString,
    });

    if (isLoggedIn && refreshTokenString) {
      intervalRef.current = setInterval(() => {
        console.log("🔄 Auto refreshing token...");
        refreshToken();
      }, env.interval_refresh_token);
      console.log("✅ Interval set successfully");
    } else {
      console.log("❌ No interval set - missing auth state");
    }
  }, [isLoggedIn, refreshTokenString, refreshToken, cleanup]);

  // Effect for initialization - chỉ chạy 1 lần khi mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Effect for setting up interval when auth state changes
  useEffect(() => {
    setupInterval();

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [setupInterval, cleanup]);
};

export default useInitialApp;
