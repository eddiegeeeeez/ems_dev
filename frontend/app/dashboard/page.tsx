"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { bookings, getBookingsByOrganizer } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    } else if (!isLoading && isAuthenticated && user?.role === "admin") {
      // Redirect admins to admin dashboard
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, isLoading, user?.role, router])

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
      <DashboardHeader
        user={user}
      />
      
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
              <p className="text-sm text-gray-600 mt-1">All your bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
              <Clock className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Events</CardTitle>
              <CheckCircle className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-sm text-gray-600 mt-1">Successfully approved</p>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Event Title</TableHead>
                      <TableHead className="font-semibold text-gray-900">Date & Time</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">{booking.eventTitle}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                        </TableCell>
                        <TableCell>
                          <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
                            <StatusIndicator />
                            <StatusLabel />
                          </Status>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
