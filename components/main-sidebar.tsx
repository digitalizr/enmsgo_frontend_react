"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Building2,
  CircuitBoard,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Users,
  Zap,
  Bell,
  FileText,
  Phone,
  BrainCircuit,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface SidebarNavItem {
  title: string
  href: string
  icon: LucideIcon
  section: "operations" | "customer"
}

const operationsNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/operations/dashboard",
    icon: LayoutDashboard,
    section: "operations",
  },
  {
    title: "Smart Meters",
    href: "/operations/smart-meters",
    icon: CircuitBoard,
    section: "operations",
  },
  {
    title: "Companies",
    href: "/operations/companies",
    icon: Building2,
    section: "operations",
  },
  {
    title: "Assignments",
    href: "/operations/assignments",
    icon: Zap,
    section: "operations",
  },
  {
    title: "Settings",
    href: "/operations/settings",
    icon: Settings,
    section: "operations",
  },
]

const customerNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
    section: "customer",
  },
  {
    title: "Energy Usage",
    href: "/customer/energy-usage",
    icon: Gauge,
    section: "customer",
  },
  {
    title: "Analytics",
    href: "/customer/analytics",
    icon: BarChart3,
    section: "customer",
  },
  {
    title: "Reports",
    href: "/customer/reports",
    icon: FileText,
    section: "customer",
  },
  {
    title: "Alerts",
    href: "/customer/alerts",
    icon: Bell,
    section: "customer",
  },
  {
    title: "Contact Points",
    href: "/customer/contact-points",
    icon: Phone,
    section: "customer",
  },
  {
    title: "AI Insights",
    href: "/customer/ai-insights",
    icon: BrainCircuit,
    section: "customer",
  },
]

export function MainSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isOperationsSection = pathname.startsWith("/operations")
  const isCustomerSection = pathname.startsWith("/customer")

  const navItems = isOperationsSection
    ? operationsNavItems
    : isCustomerSection
      ? customerNavItems
      : [...operationsNavItems, ...customerNavItems]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">EnergyMS Go</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isOperationsSection ? "Operations" : isCustomerSection ? "Customer" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isOperationsSection && !isCustomerSection && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Switch Section</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/operations/dashboard">
                        <Users className="h-4 w-4" />
                        <span>Operations Team</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/customer/dashboard">
                        <Building2 className="h-4 w-4" />
                        <span>Customer Portal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role === "admin" ? "Operations Team" : "Customer"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={user?.role === "admin" ? "/operations/settings" : "/customer/settings"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

