"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Define role ID constants
const ROLE_IDS = {
  ADMIN: "615b2efa-ea1b-44b5-8753-04dc5cf29b84",
  CUSTOMER: "526663e2-22a7-4c5a-8e47-299ca2382ac7",
  // Add other role IDs as needed
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isOperationStaff } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Function to check authorization
    const checkAuth = () => {
      // Skip auth check for public routes
      if (pathname === "/" || pathname === "/signin" || pathname === "/signup" || pathname === "/set-password") {
        setAuthorized(true)
        return
      }

      // Check if user is authenticated
      if (!user) {
        setAuthorized(false)
        router.replace("/signin")
        return
      }

      console.log("RouteGuard checking auth for path:", pathname)
      console.log("User:", user)
      console.log("Is operations staff from context:", isOperationStaff)
      console.log("User role_id:", user.role_id)

      // Double-check operations staff status based on role_id
      const isOpStaff = user.role_id ? user.role_id !== ROLE_IDS.CUSTOMER : false

      console.log("Is operations staff (based on role_id):", isOpStaff)

      // Check role-based access
      const isOperationsPath = pathname.includes("/operations")
      const isCustomerPath = pathname.includes("/customer")

      // Use the context value for isOperationStaff
      if (isOperationStaff) {
        console.log("User is operations staff")

        if (isCustomerPath) {
          console.log("Redirecting to operations dashboard")
          setAuthorized(false)
          router.replace("/operations/dashboard")
          return
        }

        if (isOperationsPath) {
          console.log("Authorizing for operations path")
          setAuthorized(true)
          return
        }

        // If at root dashboard, redirect to operations dashboard
        if (pathname === "/dashboard") {
          console.log("Redirecting to operations dashboard from root")
          router.replace("/operations/dashboard")
          return
        }
      }
      // Customers can only access customer paths
      else {
        console.log("User is customer")

        if (isOperationsPath) {
          console.log("Redirecting to customer dashboard")
          setAuthorized(false)
          router.replace("/customer/dashboard")
          return
        }

        if (isCustomerPath) {
          console.log("Authorizing for customer path")
          setAuthorized(true)
          return
        }

        // If at root dashboard, redirect to customer dashboard
        if (pathname === "/dashboard") {
          console.log("Redirecting to customer dashboard from root")
          router.replace("/customer/dashboard")
          return
        }
      }

      // Default case - authorize the user
      console.log("Default authorization")
      setAuthorized(true)
    }

    // Only check auth when loading is complete
    if (!isLoading) {
      checkAuth()
    } else {
      setAuthorized(true) // Allow rendering while loading
    }
  }, [pathname, user, isLoading, router, isOperationStaff])

  return authorized ? <>{children}</> : null
}

