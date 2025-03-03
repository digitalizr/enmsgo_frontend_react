import type React from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  )
}

