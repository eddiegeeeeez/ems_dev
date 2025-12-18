"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { formatTo12Hour } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Clock, Trash2, Edit, Eye, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { ProtectedRoute } from "@/components/protected-route"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import type { Booking } from "@/lib/types"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MyBookingsPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { getVenueById, cancelBooking } = useData()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "completed">("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return

      try {
        setIsLoadingBookings(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[MyBookings] API error:", response.status, errorText)
          throw new Error(`Failed to fetch bookings: ${response.status}`)
        }

        const data = await response.json()
        console.log("[MyBookings] Fetched bookings:", data)

        // Handle both array response and object with data property
        const bookingsArray = Array.isArray(data) ? data : (data.data || data.bookings || [])
        setBookings(bookingsArray)
      } catch (error) {
        console.error("[MyBookings] Error fetching bookings:", error)
        setBookings([])
      } finally {
        setIsLoadingBookings(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

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

  if (isLoading || isLoadingBookings) {
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

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => {
        if (filter === "pending") return b.status === "pending"
        if (filter === "approved") return b.status === "approved"
        if (filter === "completed") return b.status === "completed"
        return true
      })

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "eventTitle",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.eventTitle}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{row.original.eventDescription}</div>
        </div>
      ),
    },
    {
      accessorKey: "venueId",
      header: "Venue",
      cell: ({ row }) => {
        const venue = getVenueById(row.original.venueId)
        return <span className="text-sm text-gray-600">{venue?.name}</span>
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(row.original.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            {formatTo12Hour(row.original.startTime)} - {formatTo12Hour(row.original.endTime)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "expectedAttendees",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attendees
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          {row.original.expectedAttendees}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusMap: Record<string, string> = {
          approved: "approved",
          pending: "pending",
          rejected: "rejected",
          completed: "completed"
        }
        const statusVariant = (statusMap[row.original.status] || "pending") as "pending" | "approved" | "rejected" | "completed"
        return (
          <Status status={statusVariant}>
            <StatusIndicator />
            <StatusLabel />
          </Status>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedBooking(row.original)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {row.original.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleCancelBooking(row.original.id, row.original.eventTitle)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <ProtectedRoute requiredRole="organizer">
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">View and manage your event reservations</p>
          </div>

          <Tabs value={filter} onValueChange={handleFilterChange} className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2 sm:grid-cols-4 h-auto gap-1 bg-gray-200 p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
                All ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm py-2">
                Pending ({bookings.filter((b) => b.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm py-2">
                Approved ({bookings.filter((b) => b.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
                Completed ({bookings.filter((b) => b.status === "completed").length})
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
                <DataTable
                  columns={columns}
                  data={filteredBookings}
                  searchKey="eventTitle"
                  searchPlaceholder="Search bookings..."
                />
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
      </div>
    </ProtectedRoute>
  )
}
