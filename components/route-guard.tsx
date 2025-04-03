"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Define public routes that don't require authentication
const publicRoutes = ["/signin", "/signup", "/forgot-password", "/set-password"]

export function RouteGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Check if the route is public
    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))

    // Check if the user needs to change their password
    const requiresPasswordChange = localStorage.getItem("requiresPasswordChange") === "true"
    const tempToken = localStorage.getItem("temp_token")

    // Function to check authorization
    const checkAuth = () => {
      console.log("Checking auth:", { user, pathname, isPublicRoute, requiresPasswordChange })

      // If the route is public, allow access
      if (isPublicRoute) {
        setAuthorized(true)
        return
      }

      // If the user needs to change their password, redirect to set-password
      if (requiresPasswordChange && tempToken && pathname !== "/set-password") {
        console.log("User needs to change password, redirecting to /set-password")
        const userId = user?.id || localStorage.getItem("userId")
        router.push(`/set-password?userId=${userId}`)
        setAuthorized(false)
        return
      }

      // If the user is authenticated, allow access to protected routes
      if (user) {
        console.log("User is authenticated, allowing access")
        setAuthorized(true)
        return
      }

      // If not authenticated and not on a public route, redirect to signin
      console.log("User is not authenticated, redirecting to /signin")
      router.push("/signin")
      setAuthorized(false)
    }

    // Only run the check if loading is complete
    if (!isLoading) {
      checkAuth()
    } else {
      setAuthorized(true) // Allow rendering while loading
    }
  }, [pathname, user, isLoading, router])

  // Check for token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        // Parse the JWT token to get the expiration time
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )

        const { exp } = JSON.parse(jsonPayload)
        const currentTime = Math.floor(Date.now() / 1000)

        // If token is expired, log out and redirect
        if (exp < currentTime) {
          console.log("Token expired, redirecting to login")
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          router.push("/signin")
        }
      } catch (error) {
        console.error("Error checking token expiration:", error)
      }
    }

    // Check token expiration immediately and then every minute
    checkTokenExpiration()
    const interval = setInterval(checkTokenExpiration, 60000)

    return () => clearInterval(interval)
  }, [router])

  return authorized ? children : null
}

