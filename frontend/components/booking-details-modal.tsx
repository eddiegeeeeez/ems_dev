"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { QrCodeDisplay } from "@/components/qr-code-display"
import { formatTo12Hour } from "@/lib/utils"
import type { Booking } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { Calendar, Clock, Users, MapPin, Package, User, Mail } from 'lucide-react'
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

  const handleClose = () => {
    onClose()
  }

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
      <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Booking Request Details</DialogTitle>
          <DialogDescription>Review the complete booking information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code at Top Left with Event Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* QR Code Section - Left Side */}
            <div className="lg:col-span-1">
              <QrCodeDisplay
                bookingId={booking.id}
                eventTitle={booking.eventTitle}
              />
            </div>

            {/* Event Information & Organizer - Right Side */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Event Title</Label>
                  <p className="text-base text-gray-900">{booking.eventTitle}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="w-fit">
                    <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
                      <StatusIndicator />
                      <StatusLabel />
                    </Status>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Expected Attendees</Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-base text-gray-900">{booking.expectedAttendees} people</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Venue</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-base text-gray-900">{venue?.name}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-sm text-gray-600">{venue?.location}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-base text-gray-900">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">End Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-base text-gray-900">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-base text-gray-900">
                      {formatTo12Hour(booking.startTime)} - {formatTo12Hour(booking.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-base text-gray-900 leading-relaxed">{booking.eventDescription}</p>
              </div>

              {/* Organizer Information Inline */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Organizer</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-gray-600">Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{organizer?.name}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-gray-600">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 truncate">{organizer?.email}</span>
                    </div>
                  </div>
                  {organizer?.college && (
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium text-gray-600">College</Label>
                      <p className="text-sm text-gray-900">{organizer.college}</p>
                    </div>
                  )}
                  {organizer?.department && (
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium text-gray-600">Department</Label>
                      <p className="text-sm text-gray-900">{organizer.department}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Required - Full Width Below */}
          {requestedEquipment.length > 0 && (
            <div className="space-y-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Equipment Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {requestedEquipment.map((eq, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-md p-3 border border-blue-100">
                    <span className="h-3 w-3 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-base font-medium text-gray-800">{eq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && onApprove && onReject && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => onReject(booking.id)} variant="destructive">
              Reject
            </Button>
            <Button
              onClick={() => onApprove(booking.id)}
              className="bg-[#4caf50] hover:bg-[#45a049] text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
