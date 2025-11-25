"use client"

import { useParams, useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Calendar, Clock, Users, MapPin, Package, User, Mail, ArrowLeft } from "lucide-react"
import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export default function BookingRequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { bookings, venues, users, equipment, updateBooking, addNotification } = useData()
  const qrCodeRef = useRef<HTMLCanvasElement>(null)

  const booking = bookings.find((b) => b.id === params.id)
  const venue = venues?.find((v) => v.id === booking?.venueId)
  const organizer = users?.find((u) => u.id === booking?.organizerId)

  useEffect(() => {
    if (qrCodeRef.current && booking?.id) {
      const qrData = `UM-EVENT-${booking.id.toUpperCase()}`
      QRCode.toCanvas(qrCodeRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    }
  }, [booking?.id])

  if (!booking) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
            <p className="text-gray-600 mb-4">The booking request you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/admin/requests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </div>
        </div>
      </AdminGuard>
    )
  }

  const requestedEquipment = booking.equipment
    .map((eq) => {
      const equipmentItem = equipment?.find((e) => e.id === eq.equipmentId)
      return equipmentItem ? `${equipmentItem.name} (${eq.quantity})` : null
    })
    .filter(Boolean)

  const handleApprove = () => {
    updateBooking(booking.id, { status: "approved" })
    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.organizerId,
      message: `Your booking for "${booking.eventTitle}" has been approved.`,
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
    })
    router.push("/admin/requests")
  }

  const handleReject = () => {
    updateBooking(booking.id, { status: "rejected" })
    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.organizerId,
      message: `Your booking for "${booking.eventTitle}" has been rejected.`,
      type: "error",
      read: false,
      timestamp: new Date().toISOString(),
    })
    router.push("/admin/requests")
  }

  return (
    <AdminGuard>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/requests")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Request Details</h1>
                <p className="text-gray-600">Review the complete booking information</p>
              </div>
            </div>
            <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>

          {/* Single Card for All Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
            {/* QR Code Section */}
            <div className="pb-6 border-b">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <canvas ref={qrCodeRef} className="rounded-lg border-2 border-gray-100" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Digital Pass</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Use this QR code to check in and out of events. Event organizers can scan it to verify attendance.
                  </p>
                  <div className="mt-3 text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded">
                    Reference: UM-EVENT-{booking.id.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Event Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Event Title</Label>
                    <p className="text-base text-gray-900">{booking.eventTitle}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-base text-gray-900 leading-relaxed">{booking.eventDescription}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Expected Attendees</Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-base text-gray-900">{booking.expectedAttendees} people</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue & Schedule */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Venue & Schedule</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Venue</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-base text-gray-900">{venue?.name}</p>
                        <p className="text-sm text-gray-600">{venue?.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-base text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Time</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-base text-gray-900">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Organizer Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-base text-gray-900">{organizer?.name}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-base text-gray-900">{organizer?.email}</span>
                    </div>
                  </div>
                  {organizer?.college && (
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-700">College</Label>
                      <p className="text-base text-gray-900">{organizer.college}</p>
                    </div>
                  )}
                  {organizer?.department && (
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-700">Department</Label>
                      <p className="text-base text-gray-900">{organizer.department}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment Required */}
              {requestedEquipment.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Equipment Required
                  </h3>
                  <div className="grid gap-2">
                    {requestedEquipment.map((eq, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                        <span className="text-base text-gray-700">{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {booking.status === "pending" && (
              <div className="pt-6 border-t">
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-[#4caf50] hover:bg-[#45a049] text-white"
                  >
                    Approve Request
                  </Button>
                  <Button onClick={handleReject} variant="destructive" className="flex-1">
                    Reject Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}
