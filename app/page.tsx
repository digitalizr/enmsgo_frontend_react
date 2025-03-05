"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, BarChart3, Bell, FileText, BrainCircuit, ArrowRight, CheckCircle, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Redirect to appropriate dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/operations/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EnergyMS Go</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              <Link
                href="/signin"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Smart Energy Management for Modern Businesses
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Monitor, analyze, and optimize your energy consumption with our comprehensive energy management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm mt-6 lg:mt-0">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Dashboard Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Key Features</h2>
          <p className="max-w-[85%] text-muted-foreground text-sm md:text-base lg:text-lg">
            Our platform provides comprehensive tools to monitor and optimize your energy usage
          </p>
        </div>
        <div className="mx-auto grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 items-start pt-8 md:pt-12 md:max-w-[64rem]">
          {/* Feature 1 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Real-time Monitoring</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Track your energy consumption in real-time with detailed dashboards and analytics.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Live data updates</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Multiple time scales</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Customizable views</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Alerts & Anomalies</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Get notified of unusual consumption patterns and potential issues before they become problems.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Customizable thresholds</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Email & SMS notifications</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Anomaly detection</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Comprehensive Reports</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Generate detailed reports on energy usage, costs, and optimization opportunities.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Scheduled reports</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Multiple export formats</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Shareable insights</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <BrainCircuit className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">AI-Powered Insights</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Leverage artificial intelligence to identify optimization opportunities and predict future usage.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Predictive analytics</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Efficiency recommendations</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Pattern recognition</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Multi-Device Support</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Connect and monitor multiple smart meters from different manufacturers in one unified platform.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Elmeasure integration</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Huawei integration</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Expandable device support</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-4 md:p-6 shadow-sm">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Cost Analysis</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Understand your energy costs and identify opportunities for savings with detailed cost breakdowns.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Time-of-use analysis</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Cost forecasting</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm">Savings opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Ready to optimize your energy usage?
          </h2>
          <p className="max-w-[85%] text-muted-foreground text-sm md:text-base lg:text-lg">
            Join thousands of businesses already saving energy and reducing costs with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Today
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold">EnergyMS Go</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EnergyMS Go. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

