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
import QRCode from 'qrcode'

export default function AdminCalendarPage() {
  const { venues, bookings, users } = useData()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

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

  useEffect(() => {
    if (selectedBooking) {
      const bookingReference = `UM-EVENT-${selectedBooking.id}`
      QRCode.toDataURL(bookingReference, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl)
    }
  }, [selectedBooking])

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
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">Event Details</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  View complete information about this booking
                </DialogDescription>
              </DialogHeader>

              {selectedBooking && (
                <div className="space-y-6 mt-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-6">
                      {qrCodeUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={qrCodeUrl || "/placeholder.svg"}
                            alt="Event QR Code"
                            className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Digital Pass</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Use this QR code to check in and out of events. Event organizers can scan it to verify your attendance.
                        </p>
                        <div className="mt-3 text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded">
                          Reference: UM-EVENT-{selectedBooking.id}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        This QR code updates periodically for security reasons. Always use the latest version shown in your account.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedBooking.eventTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedBooking.eventDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#8B1538] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Venue</p>
                        <p className="text-sm text-gray-600">{selectedVenue?.name}</p>
                        <p className="text-xs text-gray-500">{selectedVenue?.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-5 w-5 text-[#8B1538] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedBooking.startDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#8B1538] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Time</p>
                        <p className="text-sm text-gray-600">
                          {selectedBooking.startTime} - {selectedBooking.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-[#8B1538] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Expected Attendees</p>
                        <p className="text-sm text-gray-600">{selectedBooking.expectedAttendees} people</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Organizer</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{selectedOrganizer?.name}</p>
                      <p className="text-xs text-gray-600">{selectedOrganizer?.email}</p>
                      {selectedOrganizer?.college && (
                        <p className="text-xs text-gray-500 mt-1">{selectedOrganizer.college}</p>
                      )}
                    </div>
                  </div>

                  {selectedBooking.equipment && selectedBooking.equipment.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Required Equipment</p>
                      <div className="space-y-1">
                        {selectedBooking.equipment.map((eq) => {
                          const equipment = mockEquipment?.find((e) => e.id === eq.equipmentId)
                          return (
                            <div key={eq.equipmentId} className="text-sm text-gray-600">
                              • {equipment?.name} (Quantity: {eq.quantity})
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
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
