"use client"

import { useAuth } from "@/lib/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Calendar } from 'lucide-react'

export default function ProfileHeader() {
  const { user } = useAuth()

  // Format date if available
  const formatJoinDate = () => {
    // Mock join date - in real implementation, this would come from user data
    return "Joined November 2025"
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
      <div className="flex items-start gap-6">
        <div className="flex items-start gap-4 md:gap-6 flex-1">
          <UserAvatar
            name={user?.name}
            avatar={user?.avatar}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <Badge className="bg-[#8B1538] text-white">
                {user?.role === "ADMIN" ? "Pro Member" : "Member"}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              {user?.role === "ADMIN" ? "Facility Manager" : "Event Organizer"}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              {user?.department && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{user.department}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatJoinDate()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
