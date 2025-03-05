"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Skip auth check for public routes
    if (pathname === "/" || pathname === "/signin" || pathname === "/signup" || isLoading) {
      setAuthorized(true)
      return
    }

    // Check if user is authenticated and has the right role for the route
    if (!user) {
      setAuthorized(false)
      router.push("/signin")
      return
    }

    // Check role-based access
    if (pathname.startsWith("/operations") && user.role !== "admin") {
      setAuthorized(false)
      router.push("/customer/dashboard")
      return
    }

    if (pathname.startsWith("/customer") && user.role !== "customer" && user.role !== "admin") {
      setAuthorized(false)
      router.push("/operations/dashboard")
      return
    }

    setAuthorized(true)
  }, [pathname, user, isLoading, router])

  return authorized ? <>{children}</> : null
}

