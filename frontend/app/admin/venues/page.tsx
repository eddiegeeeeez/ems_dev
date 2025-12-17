"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
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
  const { venues, updateVenue, addVenue, refreshVenues } = useData()
  const [deactivationOpen, setDeactivationOpen] = useState(false)
  const [addVenueOpen, setAddVenueOpen] = useState(false)
  const [editVenueOpen, setEditVenueOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddVenue = () => {
    console.log("[v0] Add new venue button clicked")
    setAddVenueOpen(true)
  }

  const handleConfirmAddVenue = async (venueData: VenueFormData) => {
    setIsLoading(true)
    console.log("[v0] Creating new venue with data:", venueData)

    try {
      // Create FormData to handle file upload
      const payload = new FormData()
      payload.append('name', venueData.name)
      payload.append('location', venueData.location)
      payload.append('description', venueData.description)
      payload.append('capacity', venueData.capacity.toString())
      payload.append('college_id', '1') // Default college
      if (venueData.image) payload.append('image', venueData.image)

      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

      // Ensure Sanctum CSRF cookie is present before making stateful POST
      if (typeof window !== 'undefined') {
        const getCookie = (name: string) => {
          return document.cookie.split('; ').find((row) => row.startsWith(name + '='))?.split('=')[1]
        }

        const baseRoot = apiBase.replace(/\/api\/?$/, '')
        if (!getCookie('XSRF-TOKEN')) {
          await fetch(`${baseRoot}/sanctum/csrf-cookie`, {
            credentials: 'include',
            method: 'GET',
          })
        }

        const xsrf = getCookie('XSRF-TOKEN') ? decodeURIComponent(getCookie('XSRF-TOKEN') as string) : ''

        const response = await fetch(`${apiBase}/api/admin/venues`, {
          method: 'POST',
          body: payload,
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrf,
          },
        })

        if (!response.ok) {
          const text = await response.text().catch(() => '')
          console.error('[v0] Create venue failed:', response.status, response.statusText, text)
          if (response.status === 401 || response.status === 419) {
            throw new Error('Authentication required. Please login again.')
          }
          let detail = text
          try {
            const parsed = JSON.parse(text)
            detail = parsed.error ?? parsed.message ?? (parsed.errors ? JSON.stringify(parsed.errors) : JSON.stringify(parsed))
          } catch (_) { }
          throw new Error(detail || 'Failed to create venue')
        }

        const data = await response.json()

        const newVenue: Venue = {
          id: data.venue.id.toString(),
          name: data.venue.name,
          location: data.venue.location,
          description: data.venue.description,
          capacity: data.venue.capacity,
          status: "available",
          image: data.venue.image_url || "/elegant-wedding-venue.png",
        }

        addVenue(newVenue)
        console.log("[v0] Venue created successfully:", newVenue.id)
        toast.success('Venue created successfully')
        setAddVenueOpen(false)
        await refreshVenues()

        setIsLoading(false)
        return
      }

      // Fallback for non-browser environment (unlikely in this client component)
      const response = await fetch(`${apiBase}/admin/venues`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('[v0] Create venue failed:', response.status, response.statusText, text)
        if (response.status === 401 || response.status === 419) {
          throw new Error('Authentication required. Please login again.')
        }
        let detail = text
        try {
          const parsed = JSON.parse(text)
          detail = parsed.error ?? parsed.message ?? (parsed.errors ? JSON.stringify(parsed.errors) : JSON.stringify(parsed))
        } catch (_) { }
        throw new Error(detail || 'Failed to create venue')
      }

      const data = await response.json()

      const newVenue: Venue = {
        id: data.venue.id.toString(),
        name: data.venue.name,
        location: data.venue.location,
        description: data.venue.description,
        capacity: data.venue.capacity,
        status: "available",
        image: data.venue.image_url || "/elegant-wedding-venue.png",
      }

      addVenue(newVenue)
      console.log("[v0] Venue created successfully:", newVenue.id)
      toast.success('Venue created successfully')
      setAddVenueOpen(false)
      await refreshVenues()
    } catch (err: any) {
      console.error("[v0] Error creating venue:", err)
      toast.error(err?.message || 'Failed to create venue')
    } finally {
      setIsLoading(false)
    }
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

      ; (async () => {
        try {
          const payload = new FormData()
          payload.append('name', venueData.name)
          payload.append('location', venueData.location)
          payload.append('description', venueData.description || '')
          payload.append('capacity', String(venueData.capacity))
          payload.append('college_id', '1')
          if ((venueData as any).image) payload.append('image', (venueData as any).image)

          const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

          // Ensure Sanctum CSRF cookie present
          if (typeof window !== 'undefined') {
            const getCookie = (name: string) => {
              return document.cookie.split('; ').find((row) => row.startsWith(name + '='))?.split('=')[1]
            }

            const baseRoot = apiBase.replace(/\/api\/?$/, '')
            if (!getCookie('XSRF-TOKEN')) {
              await fetch(`${baseRoot}/sanctum/csrf-cookie`, { credentials: 'include', method: 'GET' })
            }

            const xsrf = getCookie('XSRF-TOKEN') ? decodeURIComponent(getCookie('XSRF-TOKEN') as string) : ''

            const response = await fetch(`${apiBase}/api/admin/venues/${selectedVenue}`, {
              method: 'POST',
              body: payload,
              credentials: 'include',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': xsrf,
                // Note: do NOT set Content-Type for FormData
              },
            })

            if (!response.ok) {
              const text = await response.text().catch(() => '')
              console.error('[v0] Update venue failed:', response.status, response.statusText, text)
              let detail = text
              try {
                const parsed = JSON.parse(text)
                detail = parsed.error ?? parsed.message ?? (parsed.errors ? JSON.stringify(parsed.errors) : JSON.stringify(parsed))
              } catch (_) { }
              throw new Error(detail || 'Failed to update venue')
            }

            const data = await response.json()

            // Update local state with returned venue
            updateVenue(selectedVenue, {
              name: data.venue.name,
              location: data.venue.location,
              description: data.venue.description,
              capacity: data.venue.capacity,
              image: data.venue.image_url || undefined,
            })

            toast.success('Venue updated successfully')
            console.log('[v0] Venue updated successfully:', selectedVenue)
            await refreshVenues()
          }
        } catch (err: any) {
          console.error('[v0] Error updating venue:', err)
          toast.error(err?.message || 'Failed to update venue')
        } finally {
          setIsLoading(false)
          setSelectedVenue(null)
          setEditVenueOpen(false)
        }
      })()
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
        status: "inactive",
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
            className="h-auto p-0 font-semibold text-gray-900"
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
            className="h-auto p-0 font-semibold text-gray-900"
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
            className="h-auto p-0 font-semibold text-gray-900"
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
      header: "Actions",
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
