"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, TrendingUp, ArrowUpDown } from 'lucide-react'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useBookingTrends } from "@/hooks/use-booking-trends"
import { VenueUtilizationChart } from "@/components/venue-utilization-chart"
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
  utilization: {
    label: "Hours Booked",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


export default function VenueUtilizationPage() {
  const { venues, bookings } = useData()
  const { trendData, timeRange, setTimeRange } = useBookingTrends(bookings, 'hours')


  const getVenueStats = (venueId: string) => {
    const venueBookings = bookings.filter((b) => b.venueId === venueId && b.status === "approved")
    const totalEvents = venueBookings.length
    const totalAttendees = venueBookings.reduce((sum, b) => sum + b.expectedAttendees, 0)

    // Calculate utilization percentage (assuming 30 days in a month, 10 hours per day)
    const totalHours = venueBookings.reduce((sum, b) => {
      const start = new Date(`${b.startDate}T${b.startTime}`)
      const end = new Date(`${b.endDate}T${b.endTime}`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)
    const utilization = Math.min((totalHours / (30 * 10)) * 100, 100)

    return { totalEvents, totalAttendees, utilization }
  }

  const venueStats = venues.map((venue) => ({
    ...venue,
    stats: getVenueStats(venue.id),
  }))

  const totalUtilization = venues.length > 0
    ? venueStats.reduce((sum, v) => sum + v.stats.utilization, 0) / venues.length
    : 0

  const handleExportPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text("Venue Utilization Report", 14, 22)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Summary Statistics
    doc.setFontSize(14)
    doc.text("Summary", 14, 45)

    const summaryData = [
      ["Total Venues", venues.length.toString()],
      ["Overall Utilization", `${totalUtilization.toFixed(1)}%`],
      ["Active Bookings", bookings.filter(b => b.status === "approved").length.toString()]
    ]

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [139, 21, 56] }
    })

    // Venue Details Table
    const tableRows = venueStats.map(venue => [
      venue.name,
      venue.location,
      venue.stats.totalEvents,
      venue.stats.totalAttendees,
      `${venue.stats.utilization.toFixed(1)}%`,
      venue.status
    ])

    doc.addPage()
    doc.text("Detailed Venue Statistics", 14, 22)

    autoTable(doc, {
      startY: 30,
      head: [['Venue Name', 'Location', 'Total Events', 'Attendees', 'Utilization', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [139, 21, 56] }
    })

    doc.save("venue_utilization_report.pdf")
  }

  /* Define columns for DataTable */
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Venue Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: any) => <div className="font-medium">{row.original.name}</div>
    },
    {
      accessorKey: "location",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          {row.original.location}
        </div>
      )
    },
    {
      accessorKey: "stats.totalEvents",
      header: ({ column }: any) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold text-gray-900"
            >
              Total Events
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          {row.original.stats.totalEvents}
        </div>
      )
    },
    {
      accessorKey: "stats.totalAttendees",
      header: ({ column }: any) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold text-gray-900"
            >
              Total Attendees
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }: any) => (
        <div className="text-center">{row.original.stats.totalAttendees}</div>
      )
    },
    {
      accessorKey: "stats.utilization",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Utilization
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: any) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="font-medium">{row.original.stats.utilization.toFixed(1)}%</span>
          </div>
          <Progress value={row.original.stats.utilization} className="w-32" />
        </div>
      )
    },
    {
      accessorKey: "status",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: any) => (
        <Badge
          className={
            row.original.status === "available"
              ? "bg-transparent text-green-800"
              : row.original.status === "maintenance"
                ? "bg-transparent text-yellow-800"
                : "bg-transparent text-gray-800"
          }
        >
          {row.original.status}
        </Badge>
      )
    }
  ]

  // Import DataTable locally if top-level import fails or assume top-level import
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venue Utilization</h1>
          <p className="text-gray-600 mt-1">Track venue usage and efficiency</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-[#8B1538] hover:bg-[#a01830] text-white">
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-end text-2xl font-bold text-gray-900">{totalUtilization.toFixed(1)}%</div>
            <Progress value={totalUtilization} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Venues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-end text-2xl font-bold text-gray-900">{venues.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-end text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Trends Chart */}
      <div className="mb-6">
        <VenueUtilizationChart bookings={bookings} venues={venues} />
      </div>



      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Venue Statistics</h2>
          <p className="text-sm text-gray-500">Detailed breakdown of each venue&apos;s usage</p>
        </div>
        <div>
          <DataTable columns={columns} data={venueStats} searchKey="name" />
        </div>
      </div>
    </div>
  )
}
