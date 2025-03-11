"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Boxes, Building2, Cog, Home, LayoutDashboard, Link2, LogOut, Users } from "lucide-react"

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

export function MainSidebar() {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const isCustomerPath = pathname?.includes("/customer")
  const isOperationsPath = pathname?.includes("/operations")

  const customerLinks = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Energy Usage",
      href: "/customer/energy-usage",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "AI Insights",
      href: "/customer/ai-insights",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      title: "Alerts",
      href: "/customer/alerts",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/customer/reports",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      title: "Contact Points",
      href: "/customer/contact-points",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/customer/analytics",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/customer/settings",
      icon: <Cog className="h-4 w-4" />,
    },
  ]

  const operationsLinks = [
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
        },
        {
          title: "Edge Gateways",
          href: "/operations/inventory/edge-gateways",
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
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/operations/settings",
      icon: <Cog className="h-4 w-4" />,
    },
  ]

  const links = isCustomerPath ? customerLinks : operationsLinks

  return (
    <Sidebar expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <SidebarHeader>
        <SidebarHeaderTitle>
          <Boxes className="h-6 w-6" />
          {expanded && <span>Energy Management</span>}
        </SidebarHeaderTitle>
        <SidebarMenuButton expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      </SidebarHeader>
      <SidebarBody>
        <SidebarMenu>
          <SidebarMenuTitle>{expanded && (isCustomerPath ? "Customer" : "Operations")}</SidebarMenuTitle>
          {links.map((link, index) => {
            if (link.subItems) {
              return (
                <div key={index} className="space-y-1">
                  <SidebarMenuItem icon={link.icon} label={link.title} expanded={expanded} />
                  {expanded && (
                    <div className="ml-4 space-y-1">
                      {link.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "block rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                            pathname === subItem.href && "bg-accent text-accent-foreground",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link key={index} href={link.href}>
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
          {expanded && (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

