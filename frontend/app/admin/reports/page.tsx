"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartLineDots } from "@/components/ui/shadcn-io/line-chart-06"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, Calendar } from 'lucide-react'
import { useState } from "react"

export default function AdminReportsPage() {
  const { bookings, venues, maintenanceRequests } = useData()
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month")

  // Calculate booking statistics
  const bookingStats = {
    total: bookings.length,
    approved: bookings.filter((b) => b.status === "approved").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }

  // Calculate maintenance statistics
  const maintenanceStats = {
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter((r) => r.status === "pending").length,
    inProgress: maintenanceRequests.filter((r) => r.status === "in-progress").length,
    completed: maintenanceRequests.filter((r) => r.status === "completed").length,
    cancelled: maintenanceRequests.filter((r) => r.status === "cancelled").length,
    critical: maintenanceRequests.filter((r) => r.priority === "critical").length,
    high: maintenanceRequests.filter((r) => r.priority === "high").length,
    medium: maintenanceRequests.filter((r) => r.priority === "medium").length,
    low: maintenanceRequests.filter((r) => r.priority === "low").length,
  }

  // Venue utilization
  const venueUtilization = venues.map((venue) => {
    const venueBookings = bookings.filter((b) => b.venueId === venue.id && b.status === "approved")
    return {
      name: venue.name,
      bookings: venueBookings.length,
      capacity: venue.capacity,
      utilization: ((venueBookings.length / 12) * 100).toFixed(1), // Assuming 12 months
    }
  })

  // Booking trends by month
  const bookingTrends = [
    { month: "Jan", bookings: 12, approved: 8 },
    { month: "Feb", bookings: 15, approved: 11 },
    { month: "Mar", bookings: 18, approved: 14 },
    { month: "Apr", bookings: 22, approved: 18 },
    { month: "May", bookings: 25, approved: 20 },
    { month: "Jun", bookings: 28, approved: 23 },
  ]

  // Booking status distribution
  const statusDistribution = [
    { name: "Approved", value: bookingStats.approved, color: "#4caf50" },
    { name: "Pending", value: bookingStats.pending, color: "#fbbf24" },
    { name: "Rejected", value: bookingStats.rejected, color: "#ef4444" },
    { name: "Completed", value: bookingStats.completed, color: "#3b82f6" },
  ]

  const handleExportReport = () => {
    console.log("[v0] Export report clicked with timeRange:", timeRange)
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      bookingStats,
      maintenanceStats,
      venueUtilization,
      bookingTrends,
      statusDistribution,
      maintenanceRequests: maintenanceRequests.map((req) => ({
        id: req.id,
        venueId: req.venueId,
        venueName: venues.find((v) => v.id === req.venueId)?.name,
        title: req.title,
        description: req.description,
        priority: req.priority,
        status: req.status,
        reportedBy: req.reportedBy,
        createdAt: req.createdAt,
        completedAt: req.completedAt,
      })),
    }

    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2)),
    )
    element.setAttribute("download", `events-report-${new Date().toISOString().split("T")[0]}.json`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <AdminGuard>
      <div className="p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">View system usage and performance metrics</p>
          </div>
          <Button
            onClick={handleExportReport}
            className="bg-[#c41e3a] hover:bg-[#a01830] text-white w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(["month", "quarter", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => {
                console.log("[v0] Time range changed to:", range)
                setTimeRange(range)
              }}
              className={timeRange === range ? "bg-[#c41e3a] text-white" : "bg-transparent"}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#c41e3a]">{bookingStats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#4caf50]">{bookingStats.approved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{bookingStats.rejected}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{bookingStats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{maintenanceStats.total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceStats.pending}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{maintenanceStats.inProgress}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{maintenanceStats.completed}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{maintenanceStats.critical}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{maintenanceStats.high}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Medium Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceStats.medium}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Low Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{maintenanceStats.low}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Monthly booking activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartLineDots 
                data={bookingTrends}
                dataKey1="bookings"
                dataKey2="approved"
                label1="Total Bookings"
                label2="Approved"
              />
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Current booking statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={90}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Venue Utilization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Venue Utilization</CardTitle>
            <CardDescription>Booking activity by venue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={venueUtilization} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="bookings" 
                    fill="#c41e3a" 
                    name="Approved Bookings"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Venue Stats Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Venue Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Venue</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Bookings</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Capacity</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {venueUtilization.map((venue) => (
                    <tr key={venue.name} className="border-b last:border-b-0">
                      <td className="py-3 px-4 text-gray-900">{venue.name}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{venue.bookings}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{venue.capacity}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-[#4caf50] text-white">{venue.utilization}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      
      </div>
    </AdminGuard>
  )
}
