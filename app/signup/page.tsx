"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, CheckCircle, ArrowRight, Phone, Mail, Users, Cpu, Shield, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authAPI } from "@/services/api"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { user } = useAuth()
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
      // Split name into first and last name
      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

      // Call the registration API
      await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        role: "customer", // Default role for signup
      })

      setIsSuccess(true)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err?.message || "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 md:p-8">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">EnergyMS Go</span>
      </Link>

      <div className="container max-w-6xl grid gap-8 md:grid-cols-2 items-center">
        {/* Left side - Onboarding Process */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Start Your Energy Management Journey</h1>
            <p className="text-muted-foreground">
              Transform how you monitor, analyze, and optimize your energy consumption with our comprehensive solution.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Our Simple Onboarding Process</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">1. Consultation</h3>
                  <p className="text-sm text-muted-foreground">
                    Our engineering team will contact you to discuss your specific requirements and schedule a hardware
                    installation appointment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">2. Installation</h3>
                  <p className="text-sm text-muted-foreground">
                    Our certified technicians will install smart meters and monitoring devices at your premises with
                    minimal disruption to your operations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">3. Secure Data Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll enable data collection through our highly secure and encrypted transmission pipeline, ensuring
                    your energy data remains protected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Power className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">4. Platform Activation</h3>
                  <p className="text-sm text-muted-foreground">
                    Once everything is set up, we'll email you an activation link to access your personalized dashboard
                    and start optimizing your energy usage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div>
          {isSuccess ? (
            <Card className="w-full">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">Request Received!</CardTitle>
                <CardDescription className="text-center">Thank you for your interest in EnergyMS Go</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center">
                  Our team will contact you within 1-2 business days to discuss your requirements and schedule the next
                  steps.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  If you have any immediate questions, please contact our support team.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/">
                    Return to Home <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="w-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Get Started Today</CardTitle>
                <CardDescription>Fill out this form to begin your energy management journey</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Request Consultation"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Your information is secure and will never be shared
                  </span>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

