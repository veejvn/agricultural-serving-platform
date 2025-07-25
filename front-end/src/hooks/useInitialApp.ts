"use client";

// hooks/useInitialApp.ts
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthService from "@/services/auth.service";
import env from "@/contants/env.contant";
import { useUserStore } from "@/stores/useUserStore";

const useInitialApp = () => {
  const hasRunRef = useRef(false);
  const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
  const setTokens = useAuthStore.getState().setTokens;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshTokenString = useAuthStore((state) => state.refreshToken);
  console.log("refreshTokenString: ", refreshTokenString);

  const fetchUser = useUserStore((state) => state.fetchUser);

  const refreshToken = async () => {
    const [result, error] = await AuthService.refreshToken(
      refreshTokenString || ""
    );
    if (error) {
      console.log(error);
      //setIsLoggedIn(false);
      //setTokens("", "");
      return;
    }
    const { accessToken } = result;
    setAccessToken(accessToken);
  };

  const fetchData = async () => {
    await refreshToken();
    //if (!isLoggedIn) return;
    await fetchUser();
  };

  useEffect(() => {
    // if (hasRunRef.current) return;
    // hasRunRef.current = true;
    fetchData();
    if (!isLoggedIn) return;

    const intervalId = setInterval(refreshToken, env.interval_refresh_token);
    return () => clearInterval(intervalId);
  }, [refreshTokenString]);
};

export default useInitialApp;
