"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Calendar, Users, Download, Clock } from 'lucide-react'
import { useData } from "@/lib/data-context"
import { useBookingTrends } from "@/hooks/use-booking-trends"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function BookingStatisticsPage() {
  const { bookings, venues } = useData()
  const { trendData, timeRange, setTimeRange, filteredBookings } = useBookingTrends(bookings)

  const totalBookings = filteredBookings?.length || 0
  const approvedBookings = filteredBookings?.filter(b => b.status === "approved").length || 0
  const pendingBookings = filteredBookings?.filter(b => b.status === "pending").length || 0
  const completedBookings = filteredBookings?.filter(b => b.status === "completed").length || 0
  const approvalRate = totalBookings > 0 ? ((approvedBookings / totalBookings) * 100).toFixed(1) : "0"

  // Real data for charts


  const venuePopularity = venues?.map(venue => ({
    name: venue.name,
    bookings: filteredBookings?.filter(b => b.venueId === venue.id).length || 0
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 5) || []

  const handleExportPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text("Booking Statistics Report", 14, 22)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Key Metrics
    doc.setFontSize(14)
    doc.text("Key Metrics", 14, 45)

    const metricsData = [
      ["Total Bookings", totalBookings.toString()],
      ["Approval Rate", `${approvalRate}%`],
      ["Pending Requests", pendingBookings.toString()],
      ["Completed Events", completedBookings.toString()]
    ]

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'striped',
      headStyles: { fillColor: [139, 21, 56] }
    })

    // Popular Venues
    doc.text("Most Popular Venues", 14, (doc as any).lastAutoTable.finalY + 15)

    const venueData = venuePopularity.map((v, i) => [
      (i + 1).toString(),
      v.name,
      v.bookings.toString()
    ])

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Rank', 'Venue Name', 'Total Bookings']],
      body: venueData,
      theme: 'grid',
      headStyles: { fillColor: [139, 21, 56] }
    })

    // Trends Data
    doc.addPage()
    doc.text(`Booking Trends (${timeRange === 'year' ? 'Last 12 Months' : timeRange === 'month' ? 'Last 30 Days' : 'Last 7 Days'})`, 14, 22)

    const trendsRows = trendData.map(d => [d.label, d.value.toString()])

    autoTable(doc, {
      startY: 30,
      head: [['Month', 'Bookings']],
      body: trendsRows,
      theme: 'grid',
      headStyles: { fillColor: [139, 21, 56] }
    })

    doc.save("booking_statistics_report.pdf")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Statistics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights on venue bookings</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-end text-3xl font-bold text-gray-900">{totalBookings}</div>
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-end text-3xl font-bold text-gray-900">{approvalRate}%</div>
            <p className="text-sm text-gray-600 mt-1">{approvedBookings} approved bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
            <Clock className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-end text-3xl font-bold text-amber-600">{pendingBookings}</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Events</CardTitle>
            <Users className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-end text-3xl font-bold text-green-600">{completedBookings}</div>
            <p className="text-sm text-gray-600 mt-1">Successfully held</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends Chart */}
      {/* Booking Trends Chart */}
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Venues */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Venues</CardTitle>
            <CardDescription>Top 5 venues by booking count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {venuePopularity.map((venue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B1538] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{venue.name}</span>
                  </div>
                  <span className="text-lg font-bold text-[#8B1538]">{venue.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Breakdown of all booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Approved</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(approvedBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-green-600 w-12 text-right">{approvedBookings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(pendingBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-amber-600 w-12 text-right">{pendingBookings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(completedBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-blue-600 w-12 text-right">{completedBookings}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
