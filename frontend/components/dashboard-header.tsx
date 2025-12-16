"use client"

import { User } from "@/lib/types"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  user: User | null
  title?: string
  subtitle?: string
}

export function DashboardHeader({
  user,
  title,
  subtitle,
}: DashboardHeaderProps) {
  // Using a consistent avatar generator with the user's email as seed
  const getAvatarUrl = (email: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
  }

  const avatarUrl = user ? getAvatarUrl(user.email) : ""

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
      <div className="space-y-6">
        {/* Header Card */}
        <div className="border border-border rounded-lg bg-card p-6 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {user && (
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border shadow-md">
                  <Image
                    src={avatarUrl}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="flex-1 min-w-0 border-l border-border pl-6">
              {user && (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {user.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.college || user.department || "User"}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="default">
                      {user.role === "ADMIN" ? "Administrator" : "Student"}
                    </Badge>
                  </div>
                </>
              )}
              {title && (
                <h2 className="text-lg font-semibold text-foreground mt-4">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
