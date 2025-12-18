"use client"

import React, { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { QrScanner } from "@/components/qr-scanner"
import { Eye, ChevronDown, QrCode } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TableSkeleton } from "@/components/skeletons"

type ColumnVisibility = {
  id: boolean
  eventTitle: boolean
  venue: boolean
  organizer: boolean
  date: boolean
  status: boolean
  actions: boolean
}

export default function AdminRequestsPage() {
  const { updateBooking, addNotification, venues, users, equipment } = useData()
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending")
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [processedDetails, setProcessedDetails] = useState<{ title: string; action: 'approved' | 'rejected' } | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    next_page_url: null as string | null,
    prev_page_url: null as string | null
  })
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    eventTitle: true,
    venue: true,
    organizer: true,
    date: true,
    status: true,
    actions: true,
  })

  // Fetch bookings from admin endpoint with user information
  const fetchAdminBookings = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/requests?page=${page}&status=${filter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 401 || response.status === 403) {
        console.error("[AdminRequests] Authentication failed - please log in again")
        alert("Session expired. Please log in again.")
        window.location.href = '/'
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[AdminRequests] API error:", response.status, errorText)
        throw new Error(`Failed to fetch admin requests: ${response.status}`)
      }

      const data = await response.json()
      console.log("[AdminRequests] Fetched bookings:", data)

      // Handle paginated response
      if (data.bookings && data.bookings.data) {
        setBookings(data.bookings.data)
        setPagination({
          current_page: data.bookings.current_page,
          last_page: data.bookings.last_page,
          total: data.bookings.total,
          next_page_url: data.bookings.next_page_url,
          prev_page_url: data.bookings.prev_page_url
        })
      } else {
        // Fallback for non-paginated or error structure
        const bookingsData = data.bookings || data.data || data || []
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      }
    } catch (error) {
      console.error("[AdminRequests] Error fetching bookings:", error)
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and when filter changes
  useEffect(() => {
    fetchAdminBookings(1)
  }, [filter])

  // No longer needed as backend filters
  const filteredBookings = bookings

  const handleApprove = async (bookingId: string) => {
    try {
      const { apiClient } = await import("@/lib/api")
      await apiClient.approveBooking(bookingId)

      // Refresh bookings from backend to get updated data
      await fetchAdminBookings()

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
      setIsModalOpen(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error("Failed to approve booking:", error)
      alert("Failed to approve booking. Please try again.")
    }
  }

  const handleReject = async (bookingId: string) => {
    try {
      const { apiClient } = await import("@/lib/api")
      await apiClient.rejectBooking(bookingId, "Rejected from admin panel")

      // Refresh bookings from backend to get updated data
      await fetchAdminBookings()

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
      setIsModalOpen(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error("Failed to reject booking:", error)
      alert("Failed to reject booking. Please try again.")
    }
  }

  const handleFilterChange = (value: string) => {
    setFilter(value as "pending" | "approved" | "rejected")
  }

  const handleOpenDetails = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  const handleQrScanResult = (qrData: string) => {
    // Extract booking ID from QR code data (format: UM-EVENT-ID)
    if (qrData.startsWith("UM-EVENT-")) {
      const bookingId = qrData.replace("UM-EVENT-", "")
      // Compare with string conversion since backend IDs are numbers
      const booking = bookings.find((b) => String(b.id).toUpperCase() === bookingId.toUpperCase())

      if (booking) {
        handleOpenDetails(booking)
      } else {
        alert("Booking not found")
      }
    } else {
      alert("Invalid QR Code format")
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Requests</h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">Review and manage event booking requests</p>
            </div>
            <Button
              onClick={() => setIsScannerOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Code
            </Button>
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
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Booking Requests</h3>
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
                          Request ID
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={columnVisibility.eventTitle}
                          onCheckedChange={(checked) =>
                            setColumnVisibility((prev) => ({ ...prev, eventTitle: checked }))
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          {columnVisibility.id && <TableHead className="font-semibold text-sm text-gray-900">Request ID</TableHead>}
                          {columnVisibility.eventTitle && <TableHead className="font-semibold text-sm text-gray-900">Event Title</TableHead>}
                          {columnVisibility.venue && <TableHead className="font-semibold text-sm text-gray-900">Venue</TableHead>}
                          {columnVisibility.organizer && <TableHead className="font-semibold text-sm text-gray-900">Organizer</TableHead>}
                          {columnVisibility.date && <TableHead className="font-semibold text-sm text-gray-900">Date</TableHead>}
                          {columnVisibility.status && <TableHead className="font-semibold text-sm text-gray-900">Status</TableHead>}
                          {columnVisibility.actions && <TableHead className="font-semibold text-sm text-gray-900 text-center">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => {
                          return (
                            <TableRow key={booking.id} className="hover:bg-gray-50">
                              {columnVisibility.id && (
                                <TableCell className="font-mono text-xs text-gray-600">
                                  {String(booking.id).toUpperCase()}
                                </TableCell>
                              )}
                              {columnVisibility.eventTitle && (
                                <TableCell>
                                  <div className="font-medium text-sm text-gray-900">{booking.eventTitle}</div>
                                </TableCell>
                              )}
                              {columnVisibility.venue && (
                                <TableCell className="text-sm text-gray-600">{booking.venue?.name}</TableCell>
                              )}
                              {columnVisibility.organizer && (
                                <TableCell className="text-sm text-gray-600">{booking.user?.name}</TableCell>
                              )}
                              {columnVisibility.date && (
                                <TableCell className="text-sm text-gray-600">
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </TableCell>
                              )}
                              {columnVisibility.status && (
                                <TableCell>
                                  <Status
                                    status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : "rejected"}
                                    className={booking.status === "approved" ? "bg-transparent" :
                                      booking.status === "pending" ? "bg-transparent" :
                                        booking.status === "rejected" ? "bg-transparent" : undefined}
                                  >
                                    <StatusIndicator />
                                    <StatusLabel />
                                  </Status>
                                </TableCell>
                              )}
                              {columnVisibility.actions && (
                                <TableCell>
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      onClick={() => handleOpenDetails(booking)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          )
                        })}
                        {filteredBookings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="h-24 text-center text-gray-500">
                              No Data Found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Page {pagination.current_page} of {pagination.last_page} ({pagination.total} requests total)
                    </p>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAdminBookings(pagination.current_page - 1)}
                        disabled={!pagination.prev_page_url}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAdminBookings(pagination.current_page + 1)}
                        disabled={!pagination.next_page_url}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {selectedBooking && (
            <BookingDetailsModal
              booking={selectedBooking}
              open={isModalOpen}
              onClose={handleCloseModal}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={selectedBooking.status === "pending"}
            />
          )}

          <QrScanner
            open={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanResult={handleQrScanResult}
          />

          <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className={processedDetails?.action === 'approved' ? "text-green-600" : "text-red-600"}>
                  Request Processed Successfully
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The booking for <strong>"{processedDetails?.title}"</strong> has been {processedDetails?.action}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setSuccessDialogOpen(false)} className="bg-[#8B1538] hover:bg-[#6B0D28]">
                  Dismiss
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </AdminGuard>
  )
}
