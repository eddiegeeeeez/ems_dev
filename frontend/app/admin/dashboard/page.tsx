"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, AlertTriangle, Building2, FileText, BarChart3, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard-header"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { bookings, venues } = useData()
  const router = useRouter()

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const rejectedBookings = bookings.filter((b) => b.status === "rejected")
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const maintenanceVenues = venues.filter((v) => v.status === "maintenance")

  const approvalRate = bookings.length > 0 ? ((approvedBookings.length / bookings.length) * 100).toFixed(1) : "0"

  const handleCardClick = (route: string, label: string) => {
    console.log(`[v0] Dashboard card clicked: ${label}, navigating to: ${route}`)
    router.push(route)
  }

  const getVenueUtilization = () => {
    const last30Days = bookings.filter((b) => {
      const bookingDate = new Date(b.startDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return bookingDate >= thirtyDaysAgo
    })
    
    // Calculate utilization percentage (mock calculation)
    const totalSlots = venues.length * 30 * 3 // venues * days * slots per day
    const bookedSlots = last30Days.length
    return Math.round((bookedSlots / totalSlots) * 100)
  }

  const utilizationPercent = getVenueUtilization()

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <DashboardHeader
          user={user}
        />

        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {(pendingBookings.length > 5 || maintenanceVenues.length > 0) && (
            <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-base text-yellow-900">Critical System Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {maintenanceVenues.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-800">{maintenanceVenues.length} Venues Under Maintenance</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/admin/maintenance")}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                )}
                {pendingBookings.length > 5 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-800">{pendingBookings.length} Pending Requests Require Attention</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/admin/requests")}
                      className="text-xs"
                    >
                      Review Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 md:mb-8">
            <Card 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick("/admin/reports/booking-statistics", "Total Bookings")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <Calendar className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick("/admin/reports/booking-statistics", "Approval Rate")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
                <BarChart3 className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{approvalRate}%</div>
                <p className="text-sm text-gray-600 mt-1">{approvedBookings.length} approved bookings</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick("/admin/requests", "Pending Requests")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                <Clock className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{pendingBookings.length}</div>
                <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick("/admin/calendar", "Completed Events")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed Events</CardTitle>
                <Users className="w-4 h-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedBookings.length}</div>
                <p className="text-sm text-gray-600 mt-1">Successfully held</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl">Venue Utilization</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Last 30 days performance</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[#4caf50]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Utilization</span>
                      <span className="text-2xl font-bold text-[#c41e3a]">{utilizationPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#c41e3a] h-3 rounded-full transition-all"
                        style={{ width: `${utilizationPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Mini bar chart representation */}
                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {[65, 80, 45, 90, 70, 55, 85].map((height, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-full bg-gray-200 rounded-t" style={{ height: '100px', position: 'relative' }}>
                          <div
                            className="absolute bottom-0 w-full bg-[#c41e3a] rounded-t transition-all"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => router.push("/admin/reports/venue-utilization")}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-xs md:text-sm">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push("/admin/requests")}
                  className="w-full bg-[#c41e3a] hover:bg-[#a01830] text-white justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review {pendingBookings.length} Pending Requests
                </Button>
                <Button
                  onClick={() => router.push("/admin/calendar")}
                  className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Venue Calendar
                </Button>
                <Button
                  onClick={() => router.push("/admin/venues")}
                  className="w-full bg-[#1a1a2e] hover:bg-[#0f0f1a] text-white justify-start"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Venues
                </Button>
                <Button
                  onClick={() => router.push("/admin/maintenance")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Maintenance Schedule
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Recent Bookings</CardTitle>
              <CardDescription className="text-xs md:text-sm">Latest booking requests and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 border-b pb-3 sm:pb-4 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{booking.eventTitle}</h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                      </p>
                    </div>
                    <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
                      <StatusIndicator />
                      <StatusLabel />
                    </Status>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminGuard>
  )
}
