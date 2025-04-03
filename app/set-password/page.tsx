"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authAPI } from "@/services/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, EyeIcon, EyeOffIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const token = searchParams.get("token")
  const { isOperationStaff } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetFlow, setIsResetFlow] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([])

  useEffect(() => {
    // If we have a token in the URL, this is a password reset flow
    // If we don't have a token but have a userId, this is a first-time login flow
    if (token) {
      setIsResetFlow(true)
    } else if (!userId) {
      // If we don't have a userId or token, redirect to login
      router.push("/signin")
    }
  }, [token, userId, router])

  // Store the token from the URL in localStorage if it exists
  useEffect(() => {
    if (token) {
      localStorage.setItem("temp_token", token)
    }
  }, [token])

  const checkPasswordStrength = (value: string) => {
    // Initialize score
    let score = 0
    const feedback: string[] = []

    // Check length
    if (value.length < 8) {
      feedback.push("Password should be at least 8 characters long")
    } else {
      score += 20
    }

    // Check for lowercase letters
    if (/[a-z]/.test(value)) {
      score += 20
    } else {
      feedback.push("Include lowercase letters")
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(value)) {
      score += 20
    } else {
      feedback.push("Include uppercase letters")
    }

    // Check for numbers
    if (/\d/.test(value)) {
      score += 20
    } else {
      feedback.push("Include numbers")
    }

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(value)) {
      score += 20
    } else {
      feedback.push("Include special characters")
    }

    setPasswordStrength(score)
    setPasswordFeedback(feedback)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    checkPasswordStrength(value)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  // Function to determine the correct dashboard URL based on user role
  const getDashboardUrl = () => {
    // Get user role from localStorage
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)

        // Check if the user is operations staff
        if (
          user.role_id === "615b2efa-ea1b-44b5-8753-04dc5cf29b84" || // Admin role
          user.role_id === "7a6c0dce-7ea0-4ce1-a551-9b7c4f4b6186" || // Operator role
          user.role_id === "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d"
        ) {
          // Technician role
          return "/operations/dashboard"
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }

    // Default to customer dashboard
    return "/customer/dashboard"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 60) {
      setError("Password is too weak. Please choose a stronger password.")
      return
    }

    setIsLoading(true)

    try {
      if (isResetFlow) {
        // Password reset flow with token
        await authAPI.resetPassword({
          token: token || "",
          newPassword: password,
        })

        setSuccess("Password has been reset successfully. You will be redirected to the login page.")

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
      } else {
        // First-time login flow
        // Get the token from localStorage or from the URL
        const authToken = localStorage.getItem("token")

        if (!authToken) {
          setError("Your session has expired. Please sign in again.")
          setTimeout(() => {
            router.push("/signin")
          }, 2000)
          return
        }

        console.log("Using token for password change:", authToken.substring(0, 10) + "...")

        // Use the existing changePasswordFirstTime function
        await authAPI.changePasswordFirstTime({
          userId: userId || "",
          currentPassword,
          newPassword: password,
          token: authToken,
        })

        // Remove the requires password change flag
        localStorage.removeItem("requiresPasswordChange")

        // Determine the correct dashboard URL
        const dashboardUrl = getDashboardUrl()

        setSuccess(`Password has been changed successfully. You will be redirected to the dashboard.`)

        // Redirect to the appropriate dashboard after 2 seconds
        setTimeout(() => {
          router.push(dashboardUrl)
        }, 2000)
      }
    } catch (err: any) {
      console.error("Password change error:", err)
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isResetFlow ? "Reset Your Password" : "Set New Password"}</CardTitle>
          <CardDescription>
            {isResetFlow
              ? "Please enter a new password for your account."
              : "Your account requires a password change. Please set a new password to continue."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {!isResetFlow && (
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter your new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>

              {/* Password strength indicator */}
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs">
                  <span>Password strength</span>
                  <span>
                    {passwordStrength < 40 && "Weak"}
                    {passwordStrength >= 40 && passwordStrength < 60 && "Fair"}
                    {passwordStrength >= 60 && passwordStrength < 80 && "Good"}
                    {passwordStrength >= 80 && "Strong"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                </div>

                {passwordFeedback.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    {passwordFeedback.map((feedback, index) => (
                      <li key={index} className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                        {feedback}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
              />

              {password && confirmPassword && (
                <p
                  className={`text-xs mt-1 flex items-center ${
                    password === confirmPassword ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Passwords don't match
                    </>
                  )}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || password !== confirmPassword || passwordStrength < 60 || (!isResetFlow && !currentPassword)
              }
            >
              {isLoading ? "Processing..." : "Set New Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

