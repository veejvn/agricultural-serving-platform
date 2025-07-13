"use client"

import type React from "react"

import { FarmerSidebar } from "@/components/farmer/sidebar"

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <FarmerSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-6">{children}</div>
    </div>
  )
}
