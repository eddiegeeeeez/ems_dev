"use client"

import { useParams, useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

export default function BookingRequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { bookings, venues, users, equipment, updateBooking, addNotification } = useData()
  const [isModalOpen, setIsModalOpen] = useState(true)

  const booking = bookings.find((b) => b.id === params.id)

  useEffect(() => {
    if (!booking) {
      router.push("/admin/requests")
    }
  }, [booking, router])

  if (!booking) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
            <p className="text-gray-600 mb-4">The booking request you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push("/admin/requests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </div>
        </div>
      </AdminGuard>
    )
  }

  const handleApprove = (id: string) => {
    updateBooking(id, { status: "approved" })
    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.organizerId,
      message: `Your booking for "${booking.eventTitle}" has been approved.`,
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
    })
    setIsModalOpen(false)
    router.push("/admin/requests")
  }

  const handleReject = (id: string) => {
    updateBooking(id, { status: "rejected" })
    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.organizerId,
      message: `Your booking for "${booking.eventTitle}" has been rejected.`,
      type: "error",
      read: false,
      timestamp: new Date().toISOString(),
    })
    setIsModalOpen(false)
    router.push("/admin/requests")
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    router.push("/admin/requests")
  }

  return (
    <AdminGuard>
      <BookingDetailsModal
        booking={booking}
        open={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        showActions={booking.status === "pending"}
      />
    </AdminGuard>
  )
}
