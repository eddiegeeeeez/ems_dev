"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { Users, MapPin, Eye, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DataTable } from "@/components/data-table"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { ProtectedRoute } from "@/components/protected-route"
import type { ColumnDef } from "@tanstack/react-table"
import type { Venue } from "@/lib/types"

export default function VenuesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { venues } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  const columns: ColumnDef<Venue>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Venue Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{row.original.location}</span>
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Capacity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>{row.original.capacity}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusVariant = row.original.status === "available" ? "online" : "offline"
        return (
          <Status status={statusVariant}>
            <StatusIndicator />
            <StatusLabel />
          </Status>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              console.log("[v0] Viewing venue details for:", row.original.id, row.original.name)
              router.push(`/venues/${row.original.id}`)
            }}
            className="bg-[#c41e3a] hover:bg-[#a01830] text-white text-xs"
            size="sm"
          >
            <Eye className="h-3 w-3 mr-1" />
            View & Book
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="organizer">
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Venues</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Browse and book venues for your events</p>
        </div>

        <DataTable 
          columns={columns} 
          data={venues} 
          searchKey="name"
          searchPlaceholder="Search venues..."
        />
      </div>
    </div>
    </ProtectedRoute>
  )
}
