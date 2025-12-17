"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, AlertTriangle, Building2, FileText, BarChart3, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard-header"
import { PendingBookingRow } from "@/components/pending-booking-row"

import { useBookingTrends } from "@/hooks/use-booking-trends"
import { VenueUtilizationChart } from "@/components/venue-utilization-chart"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
  utilization: {
    label: "Hours",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function AdminDashboardContent() {
  const { user } = useAuth()
  const { bookings, venues } = useData()
  const router = useRouter()
  const { trendData, timeRange, setTimeRange } = useBookingTrends(bookings)

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const rejectedBookings = bookings.filter((b) => b.status === "rejected")
  const completedBookings = bookings.filter((b) => b.status === "completed")

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
    <main className="min-h-screen bg-gray-50">
      <DashboardHeader
        user={user}
      />

      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 md:mb-8">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleCardClick("/admin/reports/booking-statistics", "Total Bookings")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent className="text-right">
              <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
              <p className="text-left text-sm text-green-600 mt-1">
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
            <CardContent className="text-right">
              <div className="text-3xl font-bold text-gray-900">{approvalRate}%</div>
              <p className="text-left text-sm text-gray-600 mt-1">{approvedBookings.length} approved bookings</p>
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
            <CardContent className="text-right">
              <div className="text-3xl font-bold text-amber-600">{pendingBookings.length}</div>
              <p className="text-left text-sm text-gray-600 mt-1">Awaiting review</p>
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
            <CardContent className="text-right">
              <div className="text-3xl font-bold text-green-600">{completedBookings.length}</div>
              <p className="text-left text-sm text-gray-600 mt-1">Successfully held</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          {/* Booking Trends Chart - NEW */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-lg md:text-xl">Booking Trends</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Showing total bookings for the selected period
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={(val: any) => setTimeRange(val)}>
                <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="week" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                  <SelectItem value="month" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="year" className="rounded-lg">
                    Last 12 months
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart
                  data={trendData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <defs>
                    <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-bookings)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-bookings)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={30}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="value"
                    type="monotone"
                    fill="url(#fillBookings)"
                    stroke="var(--color-bookings)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="col-span-1">
            <VenueUtilizationChart bookings={bookings} venues={venues} />
          </div>

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
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests - Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Pending Requests</CardTitle>
            <CardDescription className="text-xs md:text-sm">Recent requests awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-600">All caught up! No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pendingBookings.slice(0, 5).map((booking) => (
                  <PendingBookingRow key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login">
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
