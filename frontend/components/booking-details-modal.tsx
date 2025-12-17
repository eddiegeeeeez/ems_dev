"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { QrCodeDisplay } from "@/components/qr-code-display"
import { formatTo12Hour } from "@/lib/utils"
import type { Booking } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { Calendar, Clock, Users, MapPin, Package, User, Mail, FileText, Download } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
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
  const { equipment } = useData()
  const qrCodeRef = useRef<HTMLCanvasElement>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleApprove = () => {
    if (onApprove) {
      onApprove(booking.id)
      setShowApproveDialog(false)
    }
  }

  const handleReject = () => {
    if (onReject) {
      onReject(booking.id)
      setShowRejectDialog(false)
    }
  }

  // Use nested venue and user data from booking object
  const venue = booking.venue
  const organizer = booking.user

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

  const requestedEquipment = (booking.equipment || [])
    .map((eq: any) => {
      // Handle both frontend format (equipmentId) and backend format (equipment_id or nested equipment object)
      const equipmentId = eq.equipmentId || eq.equipment_id || eq.equipment?.id
      const quantity = eq.quantity || eq.quantity_requested
      const equipmentItem = equipment?.find((e) => e.id === equipmentId)
      return equipmentItem ? `${equipmentItem.name} (${quantity})` : null
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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* QR Code Section - Left Side */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
              <QrCodeDisplay
                bookingId={booking.id}
                eventTitle={booking.eventTitle}
                qrCodeData={booking.qrCode}
              />
            </div>

            {/* Event Information & Organizer - Right Side */}
            <div className="flex-1 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Event Title</Label>
                  <p className="text-sm text-gray-900">{booking.eventTitle}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="flex items-start">
                    <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
                      <StatusIndicator />
                      <StatusLabel />
                    </Status>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Expected Attendees</Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{booking.expectedAttendees} people</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Venue</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-900">{venue?.name}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <p className="text-sm text-gray-900">{venue?.location}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">End Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatTo12Hour(booking.startTime)} - {formatTo12Hour(booking.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-1 pt-2">
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-sm text-gray-900 leading-relaxed">{booking.eventDescription}</p>
              </div>

              {/* Organizer Information Inline */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Organizer</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{organizer?.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 truncate">{organizer?.email}</span>
                    </div>
                  </div>
                  {organizer?.college && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">College</Label>
                      <p className="text-sm text-gray-900">{organizer.college}</p>
                    </div>
                  )}
                  {organizer?.department && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Department</Label>
                      <p className="text-sm text-gray-900">{organizer.department}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Required - Full Width Below */}
          {requestedEquipment.length > 0 && (
            <div className="space-y-3 bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Equipment Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requestedEquipment.map((eq, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-md p-3 border border-blue-100">
                    <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-800">{eq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {booking.documents && booking.documents.length > 0 && (
            <div className="space-y-3 bg-green-50 rounded-lg p-5 border border-green-200">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Activity Proposal & Attachments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {booking.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 bg-white rounded-md p-3 border border-green-100 hover:border-green-300 hover:bg-green-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-800 truncate">{doc.name}</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-400 group-hover:text-green-600 flex-shrink-0" />
                  </a>
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
            <Button onClick={() => setShowRejectDialog(true)} variant="destructive">
              Reject
            </Button>
            <Button
              onClick={() => setShowApproveDialog(true)}
              className="bg-[#4caf50] hover:bg-[#45a049] text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Booking Request?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve the booking for <strong>{booking.eventTitle}</strong> on{" "}
              {new Date(booking.startDate).toLocaleDateString()}. This action will confirm the venue reservation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Booking Request?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject the booking for <strong>{booking.eventTitle}</strong>. The organizer will be notified of this rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
