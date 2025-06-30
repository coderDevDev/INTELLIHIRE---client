"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Briefcase, FileText, Home, LogOut, MessageSquare, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard/admin",
      active: pathname === "/dashboard/admin",
    },
    {
      label: "Job Postings",
      icon: Briefcase,
      href: "/dashboard/admin/jobs",
      active: pathname === "/dashboard/admin/jobs",
    },
    {
      label: "Applicants",
      icon: Users,
      href: "/dashboard/admin/applicants",
      active: pathname === "/dashboard/admin/applicants",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/admin/documents",
      active: pathname === "/dashboard/admin/documents",
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: "/dashboard/admin/analytics",
      active: pathname === "/dashboard/admin/analytics",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/admin/messages",
      active: pathname === "/dashboard/admin/messages",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
      active: pathname === "/dashboard/admin/settings",
    },
  ]

  return (
    <div className="flex flex-col h-screen w-64 bg-muted/40 border-r">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          <span className="font-bold">InteliHire Admin</span>
        </Link>
      </div>
      <div className="flex-1 py-4 overflow-auto">
        <nav className="space-y-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                route.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  )
}
