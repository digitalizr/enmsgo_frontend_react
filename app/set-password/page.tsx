"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRound, EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { userAPI } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenChecked, setTokenChecked] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([])

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      validateToken(tokenParam)
    }
  }, [searchParams])

  const validateToken = async (tokenValue: string) => {
    try {
      setLoading(true)
      const response = await userAPI.validatePasswordToken(tokenValue)
      setTokenValid(response.valid)
      setTokenChecked(true)
    } catch (error) {
      console.error("Error validating token:", error)
      setTokenValid(false)
      setTokenChecked(true)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    if (passwordStrength < 60) {
      toast({
        variant: "destructive",
        title: "Password too weak",
        description: "Please choose a stronger password.",
      })
      return
    }

    try {
      setLoading(true)
      await userAPI.setPassword(token, password)

      toast({
        title: "Password set successfully",
        description: "You can now sign in with your new password.",
      })

      // Redirect to sign in page
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (error) {
      console.error("Error setting password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set password. Please try again or request a new reset link.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!tokenChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Validating your request...</p>
        </div>
      </div>
    )
  }

  if (tokenChecked && !tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <p className="mt-4 text-center text-muted-foreground">
              Please request a new password reset link or contact your administrator for assistance.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/signin")}>Return to Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Set Your Password</CardTitle>
          <CardDescription className="text-center">Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="pr-10"
                  required
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
                <Progress value={passwordStrength} className={getStrengthColor()} />

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
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Passwords don't match
                </p>
              )}

              {password && confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || password !== confirmPassword || passwordStrength < 60}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting Password...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Set Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

