"use client"

import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import type { Venue, Booking } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VenueCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venue: Venue | null
  bookings: Booking[]
}

export function VenueCalendarModal({ open, onOpenChange, venue, bookings }: VenueCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!venue) return null

  // Group bookings by date
  const bookingsByDate = bookings.reduce(
    (acc, booking) => {
      const date = booking.startDate
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(booking)
      return acc
    },
    {} as Record<string, Booking[]>,
  )

  const handlePrevMonth = () => {
    console.log("[v0] Calendar previous month clicked")
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    console.log("[v0] Calendar next month clicked")
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{venue.name} - Schedule</DialogTitle>
          <DialogDescription>View all bookings for this venue</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <Button variant="outline" size="sm" onClick={handleNextMonth} className="bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
            {days.map((day, idx) => {
              const dateStr = day
                ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : ""
              const dayBookings = dateStr ? bookingsByDate[dateStr] || [] : []

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-center text-sm min-h-16 flex flex-col ${
                    day ? "bg-white border-gray-200" : "bg-gray-50 border-transparent"
                  }`}
                >
                  {day && <span className="font-semibold text-gray-900">{day}</span>}
                  {dayBookings.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div key={booking.id} className="text-xs bg-[#c41e3a] text-white px-1 py-0.5 rounded truncate">
                          {booking.eventTitle}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-600">+{dayBookings.length - 2} more</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bookings List */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Upcoming Bookings</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(bookingsByDate)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .slice(0, 10)
                .map(([date, dateBookings]) => (
                  <div key={date} className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {dateBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{booking.eventTitle}</p>
                          <p className="text-xs text-gray-600">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                        <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
                          <StatusIndicator />
                          <StatusLabel />
                        </Status>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
