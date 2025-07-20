"use client"

import type React from "react"

import { AccountSidebar } from "@/components/account/sidebar"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
