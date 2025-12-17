"use client"

import { useData } from "@/lib/data-context"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Users, MapPin } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

export default function VenueDetailPage() {
  const { venues, getVenueById } = useData()
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

  const [venue, setVenue] = useState(getVenueById(venueId))

  useEffect(() => {
    const foundVenue = getVenueById(venueId)
    setVenue(foundVenue)
  }, [venueId, venues])

  if (!venue) {
    return (
      <ProtectedRoute requiredRole="organizer">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Venue not found</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="organizer">
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <Link href="/venues">
            <Button variant="outline" className="mb-6 bg-transparent">
              Back to Venues
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Venue Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={venue.image || "/placeholder.svg"}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </div>

              {/* Venue Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl">{venue.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" />
                        {venue.location}
                      </CardDescription>
                    </div>
                    <Status status={venue.status === "available" ? "online" : "offline"}>
                      <StatusIndicator />
                      <StatusLabel />
                    </Status>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{venue.description}</p>

                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Users className="h-5 w-5 text-[#c41e3a]" />
                    Capacity: {venue.capacity} people
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <BookingForm venue={venue} onSuccess={() => router.push("/my-bookings")} />
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
