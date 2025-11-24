"use client"

import type { Booking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock } from "lucide-react"
import { useData } from "@/lib/data-context"

interface BookingRequestCardProps {
  booking: Booking
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function BookingRequestCard({ booking, onApprove, onReject }: BookingRequestCardProps) {
  const { getVenueById } = useData()
  const venue = getVenueById(booking.venueId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{booking.eventTitle}</CardTitle>
            <CardDescription>{venue?.name}</CardDescription>
          </div>
          <Badge className="bg-yellow-500 text-white">{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{booking.eventDescription}</p>

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
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{booking.expectedAttendees} attendees</span>
          </div>
        </div>

        <div className="border-t pt-4 flex gap-2">
          <Button onClick={() => onApprove(booking.id)} className="flex-1 bg-[#4caf50] hover:bg-[#45a049] text-white">
            Approve
          </Button>
          <Button onClick={() => onReject(booking.id)} variant="destructive" className="flex-1">
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
