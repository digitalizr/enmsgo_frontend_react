"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 data-[expanded=true]:translate-x-0 data-[expanded=false]:-translate-x-full md:data-[expanded=false]:translate-x-0 md:data-[expanded=false]:translate-x-0 md:data-[expanded=false]:w-16",
  {
    variants: {
      variant: {
        default: "w-64",
        sm: "w-48",
        lg: "w-72",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  expanded?: boolean
  onToggle?: () => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, expanded = true, onToggle, children, ...props }, ref) => {
    return (
      <div ref={ref} data-expanded={expanded} className={cn(sidebarVariants({ variant }), className)} {...props}>
        {children}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center border-b px-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarHeaderTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 font-semibold", className)} {...props} />
  ),
)
SidebarHeaderTitle.displayName = "SidebarHeaderTitle"

const SidebarBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 overflow-auto py-2", className)} {...props} />,
)
SidebarBody.displayName = "SidebarBody"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center border-t p-4", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col gap-1 px-2", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props} />
  ),
)
SidebarMenuTitle.displayName = "SidebarMenuTitle"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  icon?: React.ReactNode
  label?: string
  suffix?: React.ReactNode
  expanded?: boolean
}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, active, icon, label, suffix, expanded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          active && "bg-accent text-accent-foreground",
          className,
        )}
        {...props}
      >
        {icon && <div className="flex h-5 w-5 items-center justify-center">{icon}</div>}
        {expanded && <div className="flex-1 truncate">{label}</div>}
        {expanded && suffix && <div className="flex h-5 w-5 items-center justify-center">{suffix}</div>}
      </div>
    )
  },
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded?: boolean
  onToggle?: () => void
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, expanded = true, onToggle, ...props }, ref) => {
    const handleMouseEnter = () => {
      const tooltip = document.createElement("div")
      tooltip.id = "sidebar-tooltip"
      tooltip.className = "absolute left-14 z-50 rounded-md bg-accent px-2 py-1 text-xs"
      tooltip.textContent = expanded ? "Collapse" : "Expand"
      tooltip.style.top = "50%"
      tooltip.style.transform = "translateY(-50%)"

      // Only add the tooltip if the button exists
      if (ref && ref.current) {
        ref.current.appendChild(tooltip)
      }
    }

    const handleMouseLeave = () => {
      const tooltip = document.getElementById("sidebar-tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    }

    React.useEffect(() => {
      // Only add event listeners if the ref is defined
      if (ref && ref.current) {
        const button = ref.current
        button.addEventListener("mouseenter", handleMouseEnter)
        button.addEventListener("mouseleave", handleMouseLeave)

        return () => {
          button.removeEventListener("mouseenter", handleMouseEnter)
          button.removeEventListener("mouseleave", handleMouseLeave)
        }
      }
    }, [expanded, ref])

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground",
          className,
        )}
        onClick={onToggle}
        {...props}
      >
        {expanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarBody,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuTitle,
  SidebarMenuItem,
  SidebarMenuButton,
}

