"use client"

import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { NotificationsPanel } from "@/components/notifications-panel"

export function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    console.log("[v0] User logout initiated for:", user?.email)
    logout()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="w-full h-full px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          onClick={() => console.log("[v0] Navigating to dashboard")}
        >
          <div className="flex h-8 md:h-10 w-8 md:w-10 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-xs md:text-sm">
            UM
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs md:text-sm font-bold text-[#c41e3a]">UM EVENTS</span>
            <span className="text-xs text-gray-600">Management</span>
          </div>
        </Link>

        {/* Right Section - Notifications and User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationsPanel />

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 md:h-9 w-8 md:w-9 bg-[#4caf50]">
                  <AvatarFallback className="bg-[#4caf50] text-white font-bold text-xs md:text-sm">
                    {user?.avatar || "U"}
                  </AvatarFallback>
                </Avatar>
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
