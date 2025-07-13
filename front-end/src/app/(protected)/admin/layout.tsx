"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-6">{children}</div>
    </div>
  )
}
