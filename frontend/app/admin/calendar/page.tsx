"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { useState, useMemo, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg } from "@fullcalendar/core"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react'
import type { Booking } from "@/lib/types"
import { BookingDetailsModal } from "@/components/booking-details-modal"

export default function AdminCalendarPage() {
  const { venues, bookings, users } = useData()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const calendarEvents = useMemo(() => {
    if (!bookings || bookings.length === 0) return []

    return bookings
      .filter((booking) => booking.status === "approved")
      .map((booking) => {
        const venue = venues?.find((v) => v.id === booking.venueId)
        const organizer = users?.find((u) => u.id === booking.organizerId)

        return {
          id: booking.id,
          title: `${booking.eventTitle} - ${venue?.name || "Unknown Venue"}`,
          start: `${booking.startDate}T${booking.startTime}`,
          end: `${booking.endDate}T${booking.endTime}`,
          backgroundColor: "#8B1538", // UM maroon color
          borderColor: "#8B1538",
          extendedProps: {
            booking,
            venue,
            organizer,
          },
        }
      })
  }, [bookings, venues, users])

  const handleEventClick = (clickInfo: EventClickArg) => {
    const booking = clickInfo.event.extendedProps.booking as Booking
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }



  const selectedVenue = selectedBooking ? venues?.find((v) => v.id === selectedBooking.venueId) : null
  const selectedOrganizer = selectedBooking ? users?.find((u) => u.id === selectedBooking.organizerId) : null

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Venue Calendar</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">View all approved bookings in calendar view</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <style jsx global>{`
              .fc {
                font-family: inherit;
              }
              .fc .fc-button {
                background-color: #8B1538;
                border-color: #8B1538;
                text-transform: capitalize;
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
              }
              .fc .fc-button:hover {
                background-color: #6B1028;
                border-color: #6B1028;
              }
              .fc .fc-button:focus {
                box-shadow: 0 0 0 0.2rem rgba(139, 21, 56, 0.25);
              }
              .fc .fc-button-active {
                background-color: #6B1028;
                border-color: #6B1028;
              }
              .fc-theme-standard td,
              .fc-theme-standard th {
                border-color: #e5e7eb;
              }
              .fc-theme-standard .fc-scrollgrid {
                border-color: #e5e7eb;
              }
              .fc .fc-daygrid-day-number {
                color: #374151;
                font-weight: 500;
              }
              .fc .fc-col-header-cell-cushion {
                color: #111827;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.75rem;
              }
              .fc .fc-event {
                cursor: pointer;
              }
              .fc .fc-event:hover {
                opacity: 0.9;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              eventDisplay="block"
              displayEventTime={true}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }}
              dayMaxEvents={3}
            />
          </div>

          {selectedBooking && (
            <BookingDetailsModal
              booking={selectedBooking}
              open={isModalOpen}
              onClose={() => {
                setIsModalOpen(false)
                setSelectedBooking(null)
              }}
              showActions={false}
            />
          )}
        </div>
      </main>
    </AdminGuard>
  )
}

const mockEquipment = [
  { id: "eq-1", name: "Projector" },
  { id: "eq-2", name: "Sound System" },
  { id: "eq-3", name: "Whiteboard" },
  { id: "eq-4", name: "Chairs" },
]
