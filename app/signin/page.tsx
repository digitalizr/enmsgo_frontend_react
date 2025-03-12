"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/operations/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate login with hardcoded credentials
      if (email === "admin@admin.com" && password === "admin") {
        await login({
          id: "1",
          name: "Admin User",
          email: "admin@admin.com",
          role: "admin",
        })
        router.push("/operations/dashboard")
      } else if (email === "user@user.com" && password === "user") {
        await login({
          id: "2",
          name: "Customer User",
          email: "user@user.com",
          role: "customer",
        })
        router.push("/customer/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Zap className="h-10 w-10 text-yellow-500" />
        <span className="font-bold text-xl">Energy Management System</span>
      </Link>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 p-3 border border-blue-200 bg-blue-50 rounded-md flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Demo Account Access</p>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-blue-700">Admin:</span>
                  <code className="bg-white px-2 py-1 rounded border border-blue-100 text-blue-800">
                    admin@admin.com
                  </code>
                  <code className="bg-white px-2 py-1 rounded border border-blue-100 text-blue-800 mt-1">admin</code>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-blue-700">Customer:</span>
                  <code className="bg-white px-2 py-1 rounded border border-blue-100 text-blue-800">user@user.com</code>
                  <code className="bg-white px-2 py-1 rounded border border-blue-100 text-blue-800 mt-1">user</code>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

