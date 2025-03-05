"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Zap, Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

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
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 md:hidden">
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold">EnergyMS Go</span>
            </Link>
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  )
}

