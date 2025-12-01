"use client"

import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { User as UserIcon } from 'lucide-react'
import { NotificationsPanel } from "@/components/notifications-panel"

export function Header() {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    console.log("[v0] User logout initiated for:", user?.email)
    logout()
  }

  // Prevent hydration mismatch by not rendering user-specific content until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
        <div className="w-full h-full px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/um-logo.png"
              alt="University of Mindanao"
              width={40}
              height={40}
              className="h-8 md:h-10 w-8 md:w-10"
              priority
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs md:text-sm font-bold text-[#8B1538]">UM EVENTS</span>
              <span className="text-xs text-gray-600">Management</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-8 w-8" /> {/* Placeholder for notifications */}
            <div className="h-8 w-8 rounded-full bg-gray-200" /> {/* Placeholder for avatar */}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="w-full h-full px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
          onClick={() => console.log("[v0] Navigating to dashboard")}
        >
          <Image
            src="/um-logo.png"
            alt="University of Mindanao"
            width={40}
            height={40}
            className="h-8 md:h-10 w-8 md:w-10"
            priority
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs md:text-sm font-bold text-[#8B1538]">UM EVENTS</span>
            <span className="text-xs text-gray-600">Management</span>
          </div>
        </Link>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationsPanel />

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center h-8 md:h-9 w-8 md:w-9 rounded-full bg-[#8B1538] text-white hover:bg-[#6B0D28] transition-colors hover:opacity-80">
                <UserIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                  <span className="text-xs text-[#c41e3a] font-semibold mt-1 uppercase">
                    {user?.role === "admin" ? "Facility Manager" : "Event Organizer"}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" onClick={() => console.log("[v0] Navigating to profile")}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
