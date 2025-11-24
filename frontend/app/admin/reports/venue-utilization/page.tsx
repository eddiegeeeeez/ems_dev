"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

export default function VenueUtilizationPage() {
  const { venues, bookings } = useData()

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
            <div className="text-2xl font-bold text-gray-900">{totalUtilization.toFixed(1)}%</div>
            <Progress value={totalUtilization} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Venues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{venues.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Venue Statistics</CardTitle>
          <CardDescription>Detailed breakdown of each venue's usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Events</TableHead>
                  <TableHead>Total Attendees</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venueStats.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {venue.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {venue.stats.totalEvents}
                      </div>
                    </TableCell>
                    <TableCell>{venue.stats.totalAttendees}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{venue.stats.utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={venue.stats.utilization} className="w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          venue.status === "available"
                            ? "bg-green-100 text-green-800"
                            : venue.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {venue.status}
                      </Badge>
                    </TableCell>
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
