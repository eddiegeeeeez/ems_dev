"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, TrendingUp, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnVisibility = {
  name: boolean
  location: boolean
  events: boolean
  attendees: boolean
  utilization: boolean
  status: boolean
}

export default function VenueUtilizationPage() {
  const { venues, bookings } = useData()
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    location: true,
    events: true,
    attendees: true,
    utilization: true,
    status: true,
  })

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

  const totalUtilization = venueStats.reduce((sum, v) => sum + v.stats.utilization, 0) / venues.length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Venue Utilization</h1>
        <p className="text-gray-600 mt-1">Track venue usage and efficiency</p>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Venue Statistics</CardTitle>
            <CardDescription>Detailed breakdown of each venue's usage</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={columnVisibility.name}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, name: checked }))
                }
              >
                Venue Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.location}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, location: checked }))
                }
              >
                Location
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.events}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, events: checked }))
                }
              >
                Total Events
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.attendees}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, attendees: checked }))
                }
              >
                Total Attendees
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.utilization}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, utilization: checked }))
                }
              >
                Utilization
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead>Venue Name</TableHead>}
                  {columnVisibility.location && <TableHead>Location</TableHead>}
                  {columnVisibility.events && <TableHead>Total Events</TableHead>}
                  {columnVisibility.attendees && <TableHead>Total Attendees</TableHead>}
                  {columnVisibility.utilization && <TableHead>Utilization</TableHead>}
                  {columnVisibility.status && <TableHead>Status</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {venueStats.map((venue) => (
                  <TableRow key={venue.id}>
                    {columnVisibility.name && (
                      <TableCell className="font-medium">{venue.name}</TableCell>
                    )}
                    {columnVisibility.location && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {venue.location}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.events && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {venue.stats.totalEvents}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.attendees && (
                      <TableCell className="text-center">{venue.stats.totalAttendees}</TableCell>
                    )}
                    {columnVisibility.utilization && (
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="font-medium">{venue.stats.utilization.toFixed(1)}%</span>
                          </div>
                          <Progress value={venue.stats.utilization} className="w-32" />
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge
                          className={
                            venue.status === "available"
                              ? "bg-transparent text-green-800"
                              : venue.status === "maintenance"
                              ? "bg-transparent text-yellow-800"
                              : "bg-transparent text-gray-800"
                          }
                        >
                          {venue.status}
                        </Badge>
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
