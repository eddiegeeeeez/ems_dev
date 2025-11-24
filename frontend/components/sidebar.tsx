"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2, Calendar, FileText, Settings, X, Menu, User, BarChart3, Users, ChevronDown, Wrench, GitBranch, FileSearch, Mail, Sliders } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

const organizerSections = [
  {
    title: "Dashboard",
    isDirectLink: true,
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    links: [
      { href: "/venues", label: "Browse Venues", icon: Building2 },
      { href: "/my-bookings", label: "My Bookings", icon: Calendar },
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My Profile", icon: User },
    ]
  }
]

const adminSections = [
  {
    title: "Dashboard",
    isDirectLink: true,
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings Management",
    links: [
      { href: "/admin/requests", label: "Pending Requests", icon: FileText },
      { href: "/admin/calendar", label: "Venue Calendar", icon: Calendar },
    ]
  },
  {
    title: "Facilities Management",
    links: [
      { href: "/admin/venues", label: "Manage Venues", icon: Building2 },
      { href: "/admin/equipment", label: "Equipment", icon: Settings },
      { href: "/admin/maintenance", label: "Maintenance Management", icon: Wrench },
    ]
  },
  {
    title: "Reports & Analytics",
    links: [
      { href: "/admin/reports/venue-utilization", label: "Venue Utilization", icon: BarChart3 },
      { href: "/admin/reports/booking-statistics", label: "Booking Statistics", icon: BarChart3 },
      { href: "/admin/reports/export", label: "Export Data", icon: FileSearch },
    ]
  },
  {
    title: "User Management",
    links: [
      { href: "/admin/users", label: "Manage Users", icon: Users },
      { href: "/admin/departments", label: "Departments", icon: GitBranch },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileSearch },
    ]
  },
  {
    title: "System Settings",
    links: [
      { href: "/admin/settings/booking-rules", label: "Booking Rules", icon: Sliders },
      { href: "/admin/settings/email-templates", label: "Email Templates", icon: Mail },
      { href: "/admin/settings/general", label: "General Settings", icon: Settings },
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My Profile", icon: User },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Bookings Management": true,
    "Facilities Management": true,
    "Reports & Analytics": true,
    "User Management": true,
    "System Settings": true,
    Bookings: true,
  })

  const sections = user?.role === "admin" ? adminSections : organizerSections

  const toggleSection = (title: string) => {
    console.log("[v0] Toggling section:", title)
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleNavigation = (href: string) => {
    console.log("[v0] Navigating to:", href)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {user?.role === "admin" ? "Admin" : "Organizer"} Menu
            </h3>

            <nav className="space-y-2">
              {sections.map((section) => {
                if (section.isDirectLink) {
                  const Icon = section.icon!
                  const isActive = pathname === section.href || pathname.startsWith(section.href + "/")
                  
                  return (
                    <Link
                      key={section.href}
                      href={section.href!}
                      onClick={() => handleNavigation(section.href!)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-[#c41e3a] text-white" : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </Link>
                  )
                }

                const isExpanded = expandedSections[section.title]
                
                return (
                  <div key={section.title}>
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold text-gray-700 hover:text-[#c41e3a] transition-colors"
                    >
                      <span>{section.title}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "transform rotate-180"
                      )} />
                    </button>

                    {/* Section Links */}
                    {isExpanded && section.links && (
                      <div className="mt-1 space-y-1 pl-2">
                        {section.links.map((link) => {
                          const Icon = link.icon
                          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => handleNavigation(link.href)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive ? "bg-[#c41e3a] text-white" : "text-gray-700 hover:bg-gray-100",
                              )}
                            >
                              <Icon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{link.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>

        {/* User Info Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-sm flex-shrink-0">
              {user?.avatar || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block text-xs font-semibold text-white bg-[#c41e3a] px-2 py-0.5 rounded mt-1">
                {user?.role === "admin" ? "ADMIN" : "ORGANIZER"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Menu</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                {user?.role === "admin" ? "Admin" : "Organizer"} Menu
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  if (section.isDirectLink) {
                    const Icon = section.icon!
                    const isActive = pathname === section.href || pathname.startsWith(section.href + "/")
                    
                    return (
                      <Link
                        key={section.href}
                        href={section.href!}
                        onClick={() => handleNavigation(section.href!)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive ? "bg-[#c41e3a] text-white" : "text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{section.title}</span>
                      </Link>
                    )
                  }

                  const isExpanded = expandedSections[section.title]
                  
                  return (
                    <div key={section.title}>
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold text-gray-700 hover:text-[#c41e3a] transition-colors"
                      >
                        <span>{section.title}</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "transform rotate-180"
                        )} />
                      </button>

                      {isExpanded && section.links && (
                        <div className="mt-1 space-y-1 pl-2">
                          {section.links.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")

                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => handleNavigation(link.href)}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                  isActive ? "bg-[#c41e3a] text-white" : "text-gray-700 hover:bg-gray-100",
                                )}
                              >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{link.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            {/* User Info Footer - Mobile */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-sm flex-shrink-0">
                  {user?.avatar || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className="inline-block text-xs font-semibold text-white bg-[#c41e3a] px-2 py-0.5 rounded mt-1">
                    {user?.role === "admin" ? "ADMIN" : "ORGANIZER"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
