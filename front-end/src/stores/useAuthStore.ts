import { getLS, setLS } from "@/tools/localStorage.tool";
import { create } from 'zustand'

interface AuthState {
    isLoggedIn: boolean
    accessToken: string | null,
    refreshToken: string | null,
    redirect: string
    setTokens: (accessToken: string, refreshToken: string) => void
    clearTokens: () => void
}

export const useAuthStore = create<AuthState>((set) => {
    const storedAccessToken: string | null = typeof window !== 'undefined' ? (getLS("accessToken") ?? null) : null
    const storedRefreshToken: string | null = typeof window !== 'undefined' ? (getLS("refreshToken") ?? null) : null

    return {
        isLoggedIn: !!storedAccessToken,
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        redirect: "/",

        setTokens: (accessToken, refreshToken) => {
            set({ isLoggedIn: true, accessToken: accessToken, refreshToken: refreshToken})
            setLS("isLoggedIn", true)
            setLS("accessToken", accessToken)
            setLS("refreshToken", refreshToken)
        },

        clearTokens: () => {
            set({ isLoggedIn: false, accessToken: null, refreshToken: null})
            setLS("isLoggedIn", false)
            setLS("accessToken", null)
            setLS("refreshToken", null)
        },
    }
})
