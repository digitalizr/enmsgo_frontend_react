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
    // Function to check authorization
    const checkAuth = () => {
      // Skip auth check for public routes
      if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
        setAuthorized(true)
        return
      }

      // Check if user is authenticated
      if (!user) {
        setAuthorized(false)
        router.push("/signin")
        return
      }

      // Check role-based access
      const isOperationsPath = pathname.includes("/operations")
      const isCustomerPath = pathname.includes("/customer")

      if (isOperationsPath && user.role !== "admin") {
        setAuthorized(false)
        router.push("/customer/dashboard")
        return
      }

      if (isCustomerPath && user.role !== "customer" && user.role !== "admin") {
        setAuthorized(false)
        router.push("/operations/dashboard")
        return
      }

      setAuthorized(true)
    }

    // Only check auth when loading is complete
    if (!isLoading) {
      checkAuth()
    } else {
      setAuthorized(true) // Allow rendering while loading
    }
  }, [pathname, user, isLoading, router])

  return authorized ? <>{children}</> : null
}

