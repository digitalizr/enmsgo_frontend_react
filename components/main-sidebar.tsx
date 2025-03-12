"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  Cog,
  Contact,
  FileText,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarBody,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuTitle,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  subItems?: { title: string; href: string; icon?: React.ReactNode }[]
}

export function MainSidebar() {
  const [expanded, setExpanded] = useState(true)
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const isCustomerPath = pathname?.includes("/customer")
  const isOperationsPath = pathname?.includes("/operations")

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isSubMenuOpen = (title: string) => {
    return openSubMenus.includes(title)
  }

  const customerLinks: NavItem[] = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Energy Usage",
      href: "/customer/energy-usage",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: "AI Insights",
      href: "/customer/ai-insights",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      title: "Alerts",
      href: "/customer/alerts",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/customer/reports",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Contact Points",
      href: "/customer/contact-points",
      icon: <Contact className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/customer/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/customer/settings",
      icon: <Cog className="h-4 w-4" />,
    },
  ]

  const operationsLinks: NavItem[] = [
    {
      title: "Dashboard",
      href: "/operations/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Inventory",
      icon: <Boxes className="h-4 w-4" />,
      subItems: [
        {
          title: "Smart Meters",
          href: "/operations/inventory/smart-meters",
          icon: <Zap className="h-4 w-4" />,
        },
        {
          title: "Edge Gateways",
          href: "/operations/inventory/edge-gateways",
          icon: <Boxes className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Companies",
      href: "/operations/companies",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: "Users",
      href: "/operations/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Assignments",
      href: "/operations/assignments",
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/operations/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/operations/settings",
      icon: <Cog className="h-4 w-4" />,
    },
  ]

  const links = isCustomerPath ? customerLinks : operationsLinks

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/signin")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <Sidebar expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <SidebarHeader>
        <SidebarHeaderTitle>
          <Zap className="h-6 w-6 text-yellow-500" />
          {expanded && <span>Energy Management</span>}
        </SidebarHeaderTitle>
        <SidebarMenuButton expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      </SidebarHeader>
      <SidebarBody>
        <SidebarMenu>
          <SidebarMenuTitle>{expanded && (isCustomerPath ? "Customer" : "Operations")}</SidebarMenuTitle>
          {links.map((link, index) => {
            if (link.subItems) {
              const isOpen = isSubMenuOpen(link.title)
              const isActive = link.subItems.some((item) => pathname === item.href)

              return (
                <div key={index} className="space-y-1">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm",
                      isActive && "bg-accent text-accent-foreground",
                      !isActive && "hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                    onClick={() => toggleSubMenu(link.title)}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      {expanded && <span>{link.title}</span>}
                    </div>
                    {expanded && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </div>

                  {expanded && isOpen && (
                    <div className="ml-4 space-y-1">
                      {link.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                            pathname === subItem.href && "bg-accent text-accent-foreground",
                          )}
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link key={index} href={link.href || "#"}>
                <SidebarMenuItem
                  active={pathname === link.href}
                  icon={link.icon}
                  label={link.title}
                  expanded={expanded}
                />
              </Link>
            )
          })}
        </SidebarMenu>
        {isOperationsPath && (
          <SidebarMenu className="mt-4">
            <SidebarMenuTitle>{expanded && "Switch to"}</SidebarMenuTitle>
            <Link href="/customer/dashboard">
              <SidebarMenuItem icon={<Home className="h-4 w-4" />} label="Customer View" expanded={expanded} />
            </Link>
          </SidebarMenu>
        )}
        {isCustomerPath && (
          <SidebarMenu className="mt-4">
            <SidebarMenuTitle>{expanded && "Switch to"}</SidebarMenuTitle>
            <Link href="/operations/dashboard">
              <SidebarMenuItem
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Operations View"
                expanded={expanded}
              />
            </Link>
          </SidebarMenu>
        )}
      </SidebarBody>
      <SidebarFooter className="flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <ModeToggle />
          {expanded ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

