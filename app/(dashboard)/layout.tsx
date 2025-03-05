"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  // Show nothing while checking authentication
  if (isLoading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <SidebarInset className="flex-1">
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  )
}

