"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip during initial load
    if (isLoading) return

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/signin", "/signup"]

    // Check if route is public
    if (publicRoutes.includes(pathname)) {
      return
    }

    // If not authenticated, redirect to signin
    if (!user) {
      router.push("/signin")
      return
    }

    // Role-based access control
    if (user.role === "admin" && pathname.startsWith("/customer")) {
      router.push("/operations/dashboard")
      return
    }

    if (user.role === "customer" && pathname.startsWith("/operations")) {
      router.push("/customer/dashboard")
      return
    }
  }, [user, isLoading, pathname, router])

  // Show loading or render children
  return <>{children}</>
}

