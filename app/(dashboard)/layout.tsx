import type React from "react"
import { MainSidebar } from "@/components/main-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <main className="flex-1 md:ml-64">{children}</main>
    </div>
  )
}

