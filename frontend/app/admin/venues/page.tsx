"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeactivationDialog } from "@/components/deactivation-dialog"
import { AddVenueModal } from "@/components/add-venue-modal"
import { EditVenueModal } from "@/components/edit-venue-modal"
import { Users, MapPin, Edit, Trash2 } from 'lucide-react'
import { useState } from "react"
import type { Venue } from "@/lib/types"
import type { VenueFormData } from "@/components/add-venue-modal"
import type { EditVenueData } from "@/components/edit-venue-modal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

          {/* Venues Table - Responsive */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Venue Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Location</TableHead>
                    <TableHead className="font-semibold text-gray-900">Capacity</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{venue.name}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{venue.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="line-clamp-1">{venue.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{venue.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`${
                            venue.status === "available" ? "bg-[#4caf50] text-white" : "bg-gray-400 text-white"
                          } inline-flex px-2 py-1 text-xs font-medium rounded`}
                        >
                          {venue.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleEditVenue(venue.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeactivateClick(venue.id)}
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Deactivate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {venues.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 mb-4 text-sm md:text-base">No venues found</p>
              <Button onClick={handleAddVenue} className="bg-[#c41e3a] hover:bg-[#a01830] text-white">
                Create First Venue
              </Button>
            </div>
          )}
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
