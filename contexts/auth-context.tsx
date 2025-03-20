"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "@/lib/api" // Import the authApi service

// Define role ID constants
const ROLE_IDS = {
  ADMIN: "615b2efa-ea1b-44b5-8753-04dc5cf29b84",
  CUSTOMER: "526663e2-22a7-4c5a-8e47-299ca2382ac7",
  // Add other role IDs as needed
}

export interface User {
  id: string
  name?: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  role_id?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isOperationStaff: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to determine if a user is operations staff
const isOperationsStaff = (user?: User | null): boolean => {
  if (!user) return false

  // If we have a role_id, check if it's an operations role ID
  if (user.role_id) {
    // Any role_id that is not the customer role_id is considered operations staff
    return user.role_id !== ROLE_IDS.CUSTOMER
  }

  // If we have a role name, check if it's an operations role
  if (user.role) {
    const roleLower = user.role.toLowerCase()
    return ["admin", "operator", "technician"].includes(roleLower)
  }

  // Fallback to email check (temporary solution)
  if (user.email) {
    return ["admin@admin.com", "operator@operator.com", "technician@technician.com"].includes(user.email)
  }

  return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOperationStaff, setIsOperationStaff] = useState(false)

  // Check for saved user and token on initial load
  useEffect(() => {
    try {
      // First check if we have a token - no token means no authenticated session
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      // If we have a token, try to get the user data
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)

        // Set operations staff flag based on user role_id
        const isOpStaff = isOperationsStaff(parsedUser)
        setIsOperationStaff(isOpStaff)

        console.log("User loaded from localStorage:", parsedUser)
        console.log("Is operations staff:", isOpStaff)
        console.log("User role_id:", parsedUser.role_id)
      }
    } catch (error) {
      console.error("Failed to parse saved user:", error)
      // If there's an error, clear the stored data to prevent future errors
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (userData: User) => {
    try {
      console.log("Login with user data:", userData)

      // Set user data in a single update to prevent multiple re-renders
      setUser(userData)

      // Set operations staff flag based on user role_id
      const isOpStaff = isOperationsStaff(userData)
      setIsOperationStaff(isOpStaff)

      console.log("Setting isOperationStaff to:", isOpStaff)
      console.log("User role_id:", userData.role_id)

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Log the stored user data for debugging
      const storedUser = localStorage.getItem("user")
      console.log("Stored user data:", storedUser)

      return Promise.resolve()
    } catch (error) {
      console.error("Login error:", error)
      return Promise.reject(error)
    }
  }

  const logout = async () => {
    try {
      // Call the API logout method
      await authApi.logout()

      // Clear user state
      setUser(null)
      setIsOperationStaff(false)

      // The API service handles removing items from localStorage
      return Promise.resolve()
    } catch (error) {
      console.error("Logout error:", error)
      return Promise.reject(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isOperationStaff }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  // Ensure signOut is properly exposed
  const signOut = () => {
    return context.logout()
  }

  return {
    ...context,
    signOut,
  }
}

