"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, BarChart3, Bell, FileText, BrainCircuit, ArrowRight, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

  // Rest of the landing page code remains the same
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EnergyMS</span>
          </div>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Smart Energy Management for Modern Businesses
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
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
          <div className="rounded-lg border bg-card p-8 shadow-sm">
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="max-w-[85%] text-muted-foreground text-lg">
            Our platform provides comprehensive tools to monitor and optimize your energy usage
          </p>
        </div>
        <div className="mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start pt-12 md:max-w-[64rem]">
          {/* Feature 1 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Track your energy consumption in real-time with detailed dashboards and analytics.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Live data updates</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Multiple time scales</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Customizable views</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Alerts & Anomalies</h3>
              <p className="text-muted-foreground">
                Get notified of unusual consumption patterns and potential issues before they become problems.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Customizable thresholds</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Email & SMS notifications</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Anomaly detection</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Comprehensive Reports</h3>
              <p className="text-muted-foreground">
                Generate detailed reports on energy usage, costs, and optimization opportunities.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Scheduled reports</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Multiple export formats</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Shareable insights</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Leverage artificial intelligence to identify optimization opportunities and predict future usage.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Predictive analytics</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Efficiency recommendations</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Pattern recognition</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Multi-Device Support</h3>
              <p className="text-muted-foreground">
                Connect and monitor multiple smart meters from different manufacturers in one unified platform.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Elmeasure integration</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Huawei integration</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Expandable device support</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Cost Analysis</h3>
              <p className="text-muted-foreground">
                Understand your energy costs and identify opportunities for savings with detailed cost breakdowns.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Time-of-use analysis</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Cost forecasting</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Savings opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to optimize your energy usage?
          </h2>
          <p className="max-w-[85%] text-muted-foreground text-lg">
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
            <span className="font-semibold">EnergyMS</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EnergyMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

