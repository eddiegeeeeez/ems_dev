"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface PendingBookingRowProps {
    booking: any
}

export function PendingBookingRow({ booking }: PendingBookingRowProps) {
    const router = useRouter()

    const handleViewDetails = () => {
        router.push(`/admin/requests?id=${booking.id}`)
    }

    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer group"
            onClick={handleViewDetails}
        >
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm md:text-base truncate group-hover:text-[#c41e3a]">
                    {booking.eventTitle}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()} at {booking.startTime}
                </p>
            </div>

            <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails()
                }}
            >
                <Eye className="h-4 w-4 mr-1" />
                View Details
            </Button>
        </div>
    )
}
