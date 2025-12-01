"use client"

import { useState } from "react"
import type { Booking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Clock, MapPin, Mail, User, Package, FileText, Download } from "lucide-react"
import { useData } from "@/lib/data-context"

interface BookingRequestCardProps {
  booking: Booking
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function BookingRequestCard({ booking, onApprove, onReject }: BookingRequestCardProps) {
  const { getVenueById, equipment, users } = useData()
  const [open, setOpen] = useState(false)
  const venue = getVenueById(booking.venueId)
  const organizer = users.find((u) => u.id === booking.organizerId)

  const requestedEquipment = booking.equipment
    .map((eq) => {
      const equipmentItem = equipment?.find((e) => e.id === eq.equipmentId)
      return equipmentItem ? `${equipmentItem.name} (${eq.quantity})` : null
    })
    .filter(Boolean)

  const handleApprove = () => {
    onApprove(booking.id)
    setOpen(false)
  }

  const handleReject = () => {
    onReject(booking.id)
    setOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle>{booking.eventTitle}</CardTitle>
              <CardDescription>{venue?.name}</CardDescription>
            </div>
            <Status status={booking.status === "approved" ? "approved" : booking.status === "pending" ? "pending" : booking.status === "completed" ? "completed" : "rejected"}>
              <StatusIndicator />
              <StatusLabel />
            </Status>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(booking.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Booking Request Details</DialogTitle>
                <DialogDescription>Review the complete booking information</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Event Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>
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
                  <h3 className="text-lg font-semibold text-gray-900">Venue & Schedule</h3>
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
                        <span className="text-base text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</span>
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
                  <h3 className="text-lg font-semibold text-gray-900">Organizer Information</h3>
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
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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

                {/* Attachments */}
                {booking.documents && booking.documents.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Activity Proposal & Attachments
                    </h3>
                    <div className="grid gap-2">
                      {booking.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-colors group"
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handleReject} variant="destructive">
                  Reject
                </Button>
                <Button onClick={handleApprove} className="bg-[#4caf50] hover:bg-[#45a049] text-white">
                  Approve
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  )
}
