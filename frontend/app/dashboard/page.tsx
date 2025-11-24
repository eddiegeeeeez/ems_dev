"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { bookings, getBookingsByOrganizer } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const userBookings = user?.role === "organizer" ? getBookingsByOrganizer(user.id) : []
  const pendingCount = userBookings.filter((b) => b.status === "pending").length
  const approvedCount = userBookings.filter((b) => b.status === "approved").length
  const totalCount = userBookings.length

  const handleViewAllBookings = () => {
    console.log("[v0] View all bookings clicked for user:", user?.id)
    router.push("/my-bookings")
  }

  const handleBrowseVenues = () => {
    console.log("[v0] Browse venues clicked")
    router.push("/venues")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.name.split(" ")[0]}</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Manage your event bookings and venue reservations</p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-[#c41e3a]">{totalCount}</div>
                <Calendar className="h-6 md:h-8 w-6 md:w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingCount}</div>
                <Clock className="h-6 md:h-8 w-6 md:w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Approved Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-[#4caf50]">{approvedCount}</div>
                <CheckCircle className="h-6 md:h-8 w-6 md:w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg md:text-xl">Recent Bookings</CardTitle>
                <CardDescription>Your latest event reservations</CardDescription>
              </div>
              <Button
                onClick={handleViewAllBookings}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userBookings.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Button
                  onClick={handleBrowseVenues}
                  className="w-full sm:w-auto bg-[#c41e3a] hover:bg-[#a01830] text-white"
                >
                  Browse Venues
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">{booking.eventTitle}</h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                      </p>
                    </div>
                    <Badge
                      className={`whitespace-nowrap text-xs md:text-sm ${
                        booking.status === "approved"
                          ? "bg-[#4caf50] text-white"
                          : booking.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : booking.status === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-gray-400 text-white"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
