"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Eye } from 'lucide-react'

export default function AdminRequestsPage() {
  const router = useRouter()
  const { bookings, updateBooking, addNotification, venues, users, equipment } = useData()
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending")

  const filteredBookings = bookings.filter((b) => b.status === filter)

  const handleApprove = (bookingId: string) => {
    updateBooking(bookingId, { status: "approved", updatedAt: new Date().toISOString() })
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId: booking.organizerId,
        title: "Booking Approved",
        message: `Your event "${booking.eventTitle}" has been approved!`,
        type: "approval",
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
    setSelectedBooking(null)
  }

  const handleReject = (bookingId: string) => {
    updateBooking(bookingId, { status: "rejected", updatedAt: new Date().toISOString() })
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId: booking.organizerId,
        title: "Booking Rejected",
        message: `Your event "${booking.eventTitle}" has been rejected.`,
        type: "rejection",
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
    setSelectedBooking(null)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value as "pending" | "approved" | "rejected")
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Requests</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Review and manage event booking requests</p>
          </div>

          <Tabs value={filter} onValueChange={handleFilterChange}>
            <TabsList className="mb-6 w-full grid grid-cols-3 h-auto gap-1 bg-gray-200 p-1">
              <TabsTrigger value="pending" className="text-xs sm:text-sm py-2">
                Pending ({bookings.filter((b) => b.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm py-2">
                Approved ({bookings.filter((b) => b.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm py-2">
                Rejected ({bookings.filter((b) => b.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-0">
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="text-center py-12 md:py-16">
                    <p className="text-gray-600 text-sm md:text-base">No {filter} requests</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">Request ID</TableHead>
                          <TableHead className="font-semibold text-gray-900">Event Title</TableHead>
                          <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                          <TableHead className="font-semibold text-gray-900">Organizer</TableHead>
                          <TableHead className="font-semibold text-gray-900">Date</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                          <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => {
                          const venue = venues?.find((v) => v.id === booking.venueId)
                          const organizer = users?.find((u) => u.id === booking.organizerId)
                          return (
                            <TableRow key={booking.id} className="hover:bg-gray-50">
                              <TableCell className="font-mono text-xs text-gray-600">
                                {booking.id.toUpperCase()}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-gray-900">{booking.eventTitle}</div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">{venue?.name}</TableCell>
                              <TableCell className="text-sm text-gray-600">{organizer?.name}</TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {new Date(booking.startDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : "rejected"}>
                                  <StatusIndicator />
                                  <StatusLabel />
                                </Status>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() => router.push(`/admin/requests/${booking.id}`)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AdminGuard>
  )
}
