"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Clock, Trash2, Edit, Eye } from 'lucide-react'
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import type { Booking } from "@/lib/types"

export default function MyBookingsPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { bookings, getBookingsByOrganizer, getVenueById, cancelBooking } = useData()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "completed">("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  const handleFilterChange = (value: string) => {
    setFilter(value as typeof filter)
  }

  const handleCancelBooking = (bookingId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to cancel "${eventTitle}"?`)) {
      cancelBooking(bookingId)
    }
  }

  const handleEditBooking = (venueId: string, eventTitle: string) => {
    router.push(`/venues/${venueId}`)
  }

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

  const userBookings = getBookingsByOrganizer(user!.id)

  const filteredBookings =
    filter === "all"
      ? userBookings
      : userBookings.filter((b) => {
          if (filter === "pending") return b.status === "pending"
          if (filter === "approved") return b.status === "approved"
          if (filter === "completed") return b.status === "completed"
          return true
        })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">View and manage your event reservations</p>
        </div>

        <Tabs value={filter} onValueChange={handleFilterChange} className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 sm:grid-cols-4 h-auto gap-1 bg-gray-200 p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
              All ({userBookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm py-2">
              Pending ({userBookings.filter((b) => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm py-2">
              Approved ({userBookings.filter((b) => b.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
              Completed ({userBookings.filter((b) => b.status === "completed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4 text-sm md:text-base">No bookings found</p>
                  <Link href="/venues">
                    <Button className="w-full sm:w-auto bg-[#c41e3a] hover:bg-[#a01830] text-white">
                      Browse Venues
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Event Title</TableHead>
                        <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                        <TableHead className="font-semibold text-gray-900">Date & Time</TableHead>
                        <TableHead className="font-semibold text-gray-900">Attendees</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => {
                        const venue = getVenueById(booking.venueId)
                        return (
                          <TableRow key={booking.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium text-gray-900">{booking.eventTitle}</div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {booking.eventDescription}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{venue?.name}</TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.startTime} - {booking.endTime}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                {booking.expectedAttendees}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  booking.status === "approved"
                                    ? "bg-[#4caf50] text-white"
                                    : booking.status === "pending"
                                      ? "bg-yellow-500 text-white"
                                      : booking.status === "rejected"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-400 text-white"
                                }`}
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                {(booking.status === "approved" || booking.status === "completed") && (
                                  <Button
                                    onClick={() => setSelectedBooking(booking)}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View QR
                                  </Button>
                                )}
                                {booking.status === "pending" && (
                                  <>
                                    <Button
                                      onClick={() => handleEditBooking(booking.venueId, booking.eventTitle)}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() => handleCancelBooking(booking.id, booking.eventTitle)}
                                      variant="destructive"
                                      size="sm"
                                      className="text-xs"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Cancel
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showActions={false}
        />
      )}
    </main>
  )
}
