"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnVisibility = {
  id: boolean
  title: boolean
  venue: boolean
  organizer: boolean
  date: boolean
  attendees: boolean
  status: boolean
}

export default function EventReportsPage() {
  const { bookings, venues, users } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    title: true,
    venue: true,
    organizer: true,
    date: true,
    attendees: true,
    status: true,
  })

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventDescription.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Event ID", "Title", "Venue", "Organizer", "Date", "Attendees", "Status"],
      ...filteredBookings.map((booking) => [
        booking.id,
        booking.eventTitle,
        venues.find((v) => v.id === booking.venueId)?.name || "Unknown",
        users.find((u) => u.id === booking.organizerId)?.name || "Unknown",
        booking.startDate,
        booking.expectedAttendees,
        booking.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `event-reports-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of all events</p>
        </div>
        <Button onClick={exportToCSV} className="bg-[#8B1538] hover:bg-[#6B1028]">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.reduce((sum, b) => sum + b.expectedAttendees, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Event List</CardTitle>
              <CardDescription>Filter and search through all events</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.id}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, id: checked }))
                  }
                >
                  Event ID
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.title}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, title: checked }))
                  }
                >
                  Event Title
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.venue}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, venue: checked }))
                  }
                >
                  Venue
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.organizer}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, organizer: checked }))
                  }
                >
                  Organizer
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.date}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, date: checked }))
                  }
                >
                  Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.attendees}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, attendees: checked }))
                  }
                >
                  Attendees
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.status}
                  onCheckedChange={(checked) =>
                    setColumnVisibility((prev) => ({ ...prev, status: checked }))
                  }
                >
                  Status
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.id && <TableHead>Event ID</TableHead>}
                  {columnVisibility.title && <TableHead>Event Title</TableHead>}
                  {columnVisibility.venue && <TableHead>Venue</TableHead>}
                  {columnVisibility.organizer && <TableHead>Organizer</TableHead>}
                  {columnVisibility.date && <TableHead>Date</TableHead>}
                  {columnVisibility.attendees && <TableHead>Attendees</TableHead>}
                  {columnVisibility.status && <TableHead>Status</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    {columnVisibility.id && (
                      <TableCell className="font-mono text-xs text-gray-600">
                        {booking.id.toUpperCase()}
                      </TableCell>
                    )}
                    {columnVisibility.title && (
                      <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                    )}
                    {columnVisibility.venue && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {venues.find((v) => v.id === booking.venueId)?.name || "Unknown"}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.organizer && (
                      <TableCell>{users.find((u) => u.id === booking.organizerId)?.name || "Unknown"}</TableCell>
                    )}
                    {columnVisibility.date && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(booking.startDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.attendees && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          {booking.expectedAttendees}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
