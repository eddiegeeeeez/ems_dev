"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProtectedRoute } from "@/components/protected-route"

function DashboardContent() {
  const { user, isLoading: authLoading } = useAuth()
  const { bookings, getBookingsByOrganizer } = useData()

  const isLoading = authLoading || !user
  const userBookings = user?.role === "ORGANIZER" ? getBookingsByOrganizer(user.id) : []
  const pendingCount = userBookings.filter((b) => b.status === "pending").length
  const approvedCount = userBookings.filter((b) => b.status === "approved").length
  const totalCount = userBookings.length

  const handleViewAllBookings = () => {
    console.log("[v0] View all bookings clicked for user:", user?.id)
    window.location.href = "/my-bookings"
  }

  const handleBrowseVenues = () => {
    console.log("[v0] Browse venues clicked")
    window.location.href = "/venues"
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardHeader
        user={user}
      />
      
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-8">
          {isLoading ? (
            // Skeleton loading state for stats cards
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            </>
          ) : (
            // Actual content
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                  <Calendar className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-end text-3xl font-bold text-gray-900">{totalCount}</div>
                  <p className="text-sm text-gray-600 mt-1">All your bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
                  <Clock className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-end text-3xl font-bold text-amber-600">{pendingCount}</div>
                  <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved Events</CardTitle>
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-end text-3xl font-bold text-green-600">{approvedCount}</div>
                  <p className="text-sm text-gray-600 mt-1">Successfully approved</p>
                </CardContent>
              </Card>
            </>
          )}
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
            {isLoading ? (
              // Skeleton loading state for table
              <div className="space-y-3">
                <div className="flex items-center gap-4 py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-4 py-3 border-t">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-4 py-3 border-t">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ) : userBookings.length === 0 ? (
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
                      <TableHead className="font-medium text-sm text-gray-700">Event Title</TableHead>
                      <TableHead className="font-medium text-sm text-gray-700">Date & Time</TableHead>
                      <TableHead className="font-medium text-sm text-gray-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-sm text-gray-900">{booking.eventTitle}</div>
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

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="organizer" redirectTo="/login">
      <DashboardContent />
    </ProtectedRoute>
  )
}
