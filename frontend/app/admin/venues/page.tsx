"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { DeactivationDialog } from "@/components/deactivation-dialog"
import { AddVenueModal } from "@/components/add-venue-modal"
import { EditVenueModal } from "@/components/edit-venue-modal"
import { Users, MapPin, Edit, Trash2, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import type { Venue } from "@/lib/types"
import type { VenueFormData } from "@/components/add-venue-modal"
import type { EditVenueData } from "@/components/edit-venue-modal"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminVenuesPage() {
  const { venues, updateVenue, addVenue } = useData()
  const [deactivationOpen, setDeactivationOpen] = useState(false)
  const [addVenueOpen, setAddVenueOpen] = useState(false)
  const [editVenueOpen, setEditVenueOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddVenue = () => {
    console.log("[v0] Add new venue button clicked")
    setAddVenueOpen(true)
  }

  const handleConfirmAddVenue = (venueData: VenueFormData) => {
    setIsLoading(true)
    console.log("[v0] Creating new venue with data:", venueData)

    setTimeout(() => {
      const newVenue: Venue = {
        id: `venue-${Date.now()}`,
        name: venueData.name,
        location: venueData.location,
        description: venueData.description,
        capacity: venueData.capacity,
        status: "available",
        image: "/elegant-wedding-venue.png",
      }
      addVenue(newVenue)
      setIsLoading(false)
      console.log("[v0] Venue created successfully:", newVenue.id)
    }, 500)
  }

  const handleEditVenue = (venueId: string) => {
    console.log("[v0] Edit venue clicked:", venueId)
    setSelectedVenue(venueId)
    setEditVenueOpen(true)
  }

  const handleConfirmEditVenue = (venueData: EditVenueData) => {
    if (!selectedVenue) return
    setIsLoading(true)
    console.log("[v0] Updating venue:", selectedVenue, "with data:", venueData)

    setTimeout(() => {
      updateVenue(selectedVenue, {
        name: venueData.name,
        location: venueData.location,
        description: venueData.description,
        capacity: venueData.capacity,
      })
      setIsLoading(false)
      setSelectedVenue(null)
      console.log("[v0] Venue updated successfully")
    }, 500)
  }

  const handleDeactivateClick = (venueId: string) => {
    console.log("[v0] Deactivate venue clicked:", venueId)
    setSelectedVenue(venueId)
    setDeactivationOpen(true)
  }

  const handleConfirmDeactivation = (reason: string, description: string) => {
    if (!selectedVenue) return
    setIsLoading(true)
    console.log(
      "[v0] Confirming deactivation for venue:",
      selectedVenue,
      "Reason:",
      reason,
      "Description:",
      description,
    )

    setTimeout(() => {
      updateVenue(selectedVenue, {
        status: "unavailable",
        deactivationReason: reason,
        deactivationDescription: description,
      })
      setIsLoading(false)
      setSelectedVenue(null)
      setDeactivationOpen(false)
      console.log("[v0] Venue deactivated successfully")
    }, 500)
  }

  const selectedVenueData = venues.find((v) => v.id === selectedVenue)
  const editingVenue = selectedVenue && editVenueOpen ? selectedVenueData : null

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
        <div className="font-medium text-sm text-gray-900">{row.original.name}</div>
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
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
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditVenue(row.original.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeactivateClick(row.original.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Venues</h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">Add, edit, or deactivate venues</p>
            </div>
            <Button
              onClick={handleAddVenue}
              className="w-full sm:w-auto bg-[#c41e3a] hover:bg-[#a01830] text-white text-sm"
            >
              Add New Venue
            </Button>
          </div>

          <DataTable 
            columns={columns} 
            data={venues} 
            searchKey="name"
            searchPlaceholder="Search venues..."
          />
        </div>
      </main>

      {/* Modals */}
      <AddVenueModal
        open={addVenueOpen}
        onOpenChange={setAddVenueOpen}
        onConfirm={handleConfirmAddVenue}
        isLoading={isLoading}
      />

      <EditVenueModal
        open={editVenueOpen}
        onOpenChange={setEditVenueOpen}
        venue={editingVenue || null}
        onConfirm={handleConfirmEditVenue}
        isLoading={isLoading}
      />

      <DeactivationDialog
        open={deactivationOpen}
        onOpenChange={setDeactivationOpen}
        venueName={selectedVenueData?.name || ""}
        onConfirm={handleConfirmDeactivation}
        isLoading={isLoading}
      />
    </AdminGuard>
  )
}
