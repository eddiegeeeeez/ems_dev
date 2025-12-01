"use client"

import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function NotificationsPanel() {
  const { user } = useAuth()
  const { notifications, markNotificationAsRead } = useData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const userNotifications = mounted ? notifications.filter((n) => n.userId === user?.id) : []
  const unreadCount = userNotifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-4 w-4 text-[#4caf50]" />
      case "rejection":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "booking":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-[#c41e3a]">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#c41e3a]" />}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : "No new notifications"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {userNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No notifications yet</p>
            </div>
          ) : (
            userNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
