"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Bell,
  FileText,
  BrainCircuit,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Gauge,
  LineChart,
  Lightbulb,
  Cpu,
  Building,
  BadgePercent,
  ShieldCheck,
  Sparkles,
  Play,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")

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
            <Zap className="h-12 w-12 text-yellow-500" />
            <span className="font-bold text-xl">EnergyMS Go</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <nav className="flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium hover:text-primary">
                Benefits
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium hover:text-primary">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
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
              <a
                href="#features"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Play className="h-4 w-4" />
                  Demo
                </Link>
                <Link
                  href="/signin"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
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
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        <div className="container relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="font-medium">6 Months Free Trial</span>
              </div>
              <h1 className="text-4xl font-bold">Energy Management System</h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Reduce energy costs by up to 30% with our AI-powered platform and smart metering technology. No upfront
                costs, free installation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Play className="h-4 w-4" />
                    Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free Installation</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No Upfront Costs</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-primary/50 opacity-30 blur"></div>
              <div className="relative rounded-xl border bg-card p-2 shadow-lg">
                <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                  <img
                    src="/placeholder.svg?height=720&width=1280&text=EnergyMS+Dashboard"
                    alt="EnergyMS Dashboard Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y bg-muted/30 py-10">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-muted-foreground">Trusted by industry leaders</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {/* Placeholder logos - replace with actual client logos */}
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Energy Management Platform
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              Our platform combines advanced smart metering hardware with AI-powered software to give you complete
              control over your energy usage
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Real-time Monitoring</h3>
                <p className="mb-4 text-muted-foreground">
                  Track energy consumption in real-time with detailed metrics including kWh, kW, voltage, and amperage.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Facility-wide and machine-level monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Customizable dashboards and views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Historical data comparison</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">AI-Powered Analytics</h3>
                <p className="mb-4 text-muted-foreground">
                  Leverage artificial intelligence to identify optimization opportunities and predict future usage
                  patterns.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Consumption pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Predictive maintenance alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Energy-saving recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BadgePercent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Dynamic Tariff Optimization</h3>
                <p className="mb-4 text-muted-foreground">
                  Optimize energy usage based on time-of-use pricing to minimize costs during peak periods.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Time-of-use analysis and alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Load shifting recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Cost forecasting and budgeting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Alerts & Notifications</h3>
                <p className="mb-4 text-muted-foreground">
                  Get notified of unusual consumption patterns, equipment issues, and optimization opportunities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Customizable alert thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Email, SMS, and in-app notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Anomaly detection and reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Comprehensive Reporting</h3>
                <p className="mb-4 text-muted-foreground">
                  Generate detailed reports on energy usage, costs, and optimization opportunities for stakeholders.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Scheduled automated reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Multiple export formats (PDF, CSV, Excel)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Regulatory compliance documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Advanced Hardware Integration</h3>
                <p className="mb-4 text-muted-foreground">
                  Seamlessly connect with our smart meters and machine-level monitoring devices for comprehensive
                  insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Main switchboard smart meters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Machine-level monitoring devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span>Automatic data collection and analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Your Business Needs EnergyMS Go
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              Our platform delivers tangible benefits that directly impact your bottom line
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Benefit 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BadgePercent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Reduce Energy Costs</h3>
                <p className="text-muted-foreground mt-2">
                  Our customers typically see 15-30% reduction in energy costs through optimization and efficiency
                  improvements.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Optimize Peak Usage</h3>
                <p className="text-muted-foreground mt-2">
                  Identify and shift energy-intensive operations away from peak tariff periods to minimize costs.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                <p className="text-muted-foreground mt-2">
                  Make informed decisions about equipment upgrades, operational changes, and energy investments.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sustainability Goals</h3>
                <p className="text-muted-foreground mt-2">
                  Meet corporate sustainability targets and reduce your carbon footprint with measurable improvements.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Regulatory Compliance</h3>
                <p className="text-muted-foreground mt-2">
                  Stay compliant with energy efficiency regulations and reporting requirements with automated
                  documentation.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Competitive Advantage</h3>
                <p className="text-muted-foreground mt-2">
                  Gain a competitive edge through improved operational efficiency and reduced overhead costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How EnergyMS Go Works</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              Our end-to-end solution makes energy management simple and effective
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-border hidden md:block"></div>

            <div className="space-y-16 md:space-y-24">
              {/* Step 1 */}
              <div className="relative grid gap-8 md:grid-cols-2 md:gap-16">
                <div className="order-2 md:order-1">
                  <div className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-lg font-bold shadow-sm hidden md:flex">
                    1
                  </div>
                  <div className="md:text-right space-y-4">
                    <h3 className="text-2xl font-bold">Free Installation</h3>
                    <p className="text-muted-foreground">
                      We install smart meters at your main switchboard and machine-level monitoring devices at no cost
                      to you. Our team handles all the technical setup and integration.
                    </p>
                  </div>
                </div>
                <div className="relative order-1 md:order-2 rounded-xl border bg-card p-2 shadow-md">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Smart+Meter+Installation"
                      alt="Smart Meter Installation"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid gap-8 md:grid-cols-2 md:gap-16">
                <div className="relative rounded-xl border bg-card p-2 shadow-md">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Data+Collection+and+Analysis"
                      alt="Data Collection and Analysis"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-lg font-bold shadow-sm hidden md:flex">
                    2
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Data Collection & Analysis</h3>
                    <p className="text-muted-foreground">
                      Our system begins collecting detailed energy usage data immediately. The AI analyzes consumption
                      patterns, identifies inefficiencies, and generates optimization recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid gap-8 md:grid-cols-2 md:gap-16">
                <div className="order-2 md:order-1">
                  <div className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-lg font-bold shadow-sm hidden md:flex">
                    3
                  </div>
                  <div className="md:text-right space-y-4">
                    <h3 className="text-2xl font-bold">6-Month Free Trial</h3>
                    <p className="text-muted-foreground">
                      Experience the full benefits of our platform with a 6-month free trial. See the real-world savings
                      and optimization opportunities before committing to a subscription.
                    </p>
                  </div>
                </div>
                <div className="relative order-1 md:order-2 rounded-xl border bg-card p-2 shadow-md">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Free+Trial+Period"
                      alt="Free Trial Period"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative grid gap-8 md:grid-cols-2 md:gap-16">
                <div className="relative rounded-xl border bg-card p-2 shadow-md">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Ongoing+Optimization"
                      alt="Ongoing Optimization"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-lg font-bold shadow-sm hidden md:flex">
                    4
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Ongoing Optimization</h3>
                    <p className="text-muted-foreground">
                      As a subscriber, you'll receive ongoing support, hardware maintenance, and software updates. Our
                      team continuously works with you to identify new optimization opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              No upfront costs, just a simple subscription that includes hardware, software, and support
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex justify-center">
              <Tabs defaultValue="monthly" className="w-full max-w-md" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (Save 15%)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
              <div className="bg-primary/10 p-6 text-center">
                <h3 className="text-2xl font-bold">Enterprise Subscription</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Tailored to your facility size and requirements</p>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Free hardware installation</span>
                      <p className="text-sm text-muted-foreground">Smart meters and monitoring devices included</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">6-month free trial</span>
                      <p className="text-sm text-muted-foreground">No commitment, cancel anytime</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Full platform access</span>
                      <p className="text-sm text-muted-foreground">All features and capabilities included</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Dedicated support</span>
                      <p className="text-sm text-muted-foreground">Technical support and customer success manager</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Hardware maintenance & upgrades</span>
                      <p className="text-sm text-muted-foreground">We maintain and upgrade all equipment as needed</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 text-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contact us for a custom quote based on your facility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              Businesses across industries are seeing real results with EnergyMS Go
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Operations Director, Manufacturing Co.</p>
                </div>
              </div>
              <p className="italic">
                "We've reduced our energy costs by 27% in just the first year of using EnergyMS Go. The machine-level
                monitoring helped us identify inefficient equipment that needed replacement."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Facility Manager, Tech Industries</p>
                </div>
              </div>
              <p className="italic">
                "The AI recommendations helped us shift our energy-intensive operations to off-peak hours, saving us
                thousands each month on our electricity bills."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div>
                  <h4 className="font-bold">Emma Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Sustainability Lead, Retail Chain</p>
                </div>
              </div>
              <p className="italic">
                "The detailed reporting has been invaluable for our sustainability initiatives. We can now show concrete
                progress toward our carbon reduction goals."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[85%]">
              Everything you need to know about our energy management solution
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the free installation work?</AccordionTrigger>
                <AccordionContent>
                  We provide and install all necessary hardware at no upfront cost to you. This includes smart meters
                  for your main switchboard and monitoring devices for individual machines or equipment. Our technicians
                  handle the entire installation process, ensuring minimal disruption to your operations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What happens after the 6-month free trial?</AccordionTrigger>
                <AccordionContent>
                  After the 6-month trial, you can choose to continue with a subscription or end the service. If you
                  continue, you'll be billed according to the agreed subscription plan. If you decide to end the
                  service, we'll remove our equipment at no cost to you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How much can I expect to save on energy costs?</AccordionTrigger>
                <AccordionContent>
                  Most of our customers see savings of 15-30% on their energy costs. The exact amount depends on your
                  current energy usage patterns, equipment efficiency, and how effectively you implement our
                  optimization recommendations. During the free trial, you'll get a clear picture of your potential
                  savings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security very seriously. All data is encrypted both in transit and at rest. We
                  comply with industry-standard security protocols and regulations. Your data is only used to provide
                  the service and generate insights for your business.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>What kind of support is included?</AccordionTrigger>
                <AccordionContent>
                  Your subscription includes comprehensive technical support and customer service. We provide hardware
                  maintenance, software updates, and dedicated account management. Our team is available to help you
                  interpret data, implement recommendations, and resolve any issues that arise.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I integrate with my existing systems?</AccordionTrigger>
                <AccordionContent>
                  Yes, our platform is designed to integrate with many existing building management systems, ERP
                  software, and other business tools. During the onboarding process, we'll assess your current systems
                  and develop an integration plan if needed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="relative overflow-hidden rounded-xl border bg-card p-8 shadow-lg md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Start Optimizing Your Energy Usage Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 md:text-xl">
                Join hundreds of businesses already saving with EnergyMS Go. No upfront costs, free installation, and a
                6-month trial.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Play className="h-4 w-4" />
                    Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-12 w-12 text-yellow-500" />
                <span className="font-bold text-xl">EnergyMS Go</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Smart energy management for modern businesses. Reduce costs, optimize usage, and meet sustainability
                goals.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-muted-foreground hover:text-foreground">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/signin" className="text-muted-foreground hover:text-foreground">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EnergyMS Go. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

