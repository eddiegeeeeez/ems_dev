"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { Calendar, Clock, Users, MapPin, Package } from 'lucide-react'
import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface BookingDetailsModalProps {
  booking: Booking
  open: boolean
  onClose: () => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export function BookingDetailsModal({
  booking,
  open,
  onClose,
  onApprove,
  onReject,
  showActions = false,
}: BookingDetailsModalProps) {
  const { venues, users, equipment } = useData()
  const qrCodeRef = useRef<HTMLCanvasElement>(null)

  const venue = venues?.find((v) => v.id === booking.venueId)
  const organizer = users?.find((u) => u.id === booking.organizerId)

  useEffect(() => {
    if (qrCodeRef.current && booking.id) {
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
  }, [booking.id])

  const requestedEquipment = booking.equipment
    .map((eq) => {
      const equipmentItem = equipment?.find((e) => e.id === eq.equipmentId)
      return equipmentItem ? `${equipmentItem.name} (${eq.quantity})` : null
    })
    .filter(Boolean)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Event Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <canvas ref={qrCodeRef} className="rounded-lg border-2 border-gray-100" />
              </div>
              
              {/* Digital Pass Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Digital Pass</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Use this QR code to check in and out of events. Event organizers can scan it to verify your attendance.
                </p>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                This QR code updates periodically for security reasons. Always use the latest version shown in your account.
              </p>
            </div>
          </div>

          {/* Event Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Event Title</p>
                <p className="text-base text-gray-900">{booking.eventTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-base text-gray-600">{booking.eventDescription}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <Badge
                  className={`${
                    booking.status === "approved"
                      ? "bg-[#4caf50] text-white"
                      : booking.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Venue & Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue & Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Venue</p>
                  <p className="text-base text-gray-900">{venue?.name}</p>
                  <p className="text-sm text-gray-500">{venue?.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-base text-gray-900">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-base text-gray-900">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Expected Attendees</p>
                  <p className="text-base text-gray-900">{booking.expectedAttendees} people</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizer Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-base text-gray-900">{organizer?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-base text-gray-900">{organizer?.email}</p>
              </div>
              {organizer?.college && (
                <div>
                  <p className="text-sm font-medium text-gray-700">College</p>
                  <p className="text-base text-gray-900">{organizer.college}</p>
                </div>
              )}
              {organizer?.department && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Department</p>
                  <p className="text-base text-gray-900">{organizer.department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Equipment Required */}
          {requestedEquipment.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Equipment Required
              </h3>
              <ul className="space-y-2">
                {requestedEquipment.map((eq, index) => (
                  <li key={index} className="text-base text-gray-700 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    {eq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && onApprove && onReject && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => onApprove(booking.id)}
                className="flex-1 bg-[#4caf50] hover:bg-[#45a049] text-white"
              >
                Approve Request
              </Button>
              <Button onClick={() => onReject(booking.id)} variant="destructive" className="flex-1">
                Reject Request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
