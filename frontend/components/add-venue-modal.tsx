"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AddVenueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (venueData: VenueFormData) => void
  isLoading?: boolean
}

export interface VenueFormData {
  name: string
  location: string
  description: string
  capacity: number
}

export function AddVenueModal({ open, onOpenChange, onConfirm, isLoading = false }: AddVenueModalProps) {
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    location: "",
    description: "",
    capacity: 0,
  })

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleConfirm = () => {
    if (!formData.name || !formData.location || !formData.capacity) {
      console.log("[v0] Form validation failed - missing required fields")
      return
    }
    console.log("[v0] Adding new venue:", formData)
    onConfirm(formData)
    setFormData({
      name: "",
      location: "",
      description: "",
      capacity: 0,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#c41e3a]">Add New Venue</DialogTitle>
          <DialogDescription>Fill in the details to create a new venue for events.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Venue Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                console.log("[v0] Venue name updated:", e.target.value)
                setFormData({ ...formData, name: e.target.value })
              }}
              placeholder="e.g., Main Auditorium"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => {
                console.log("[v0] Venue location updated:", e.target.value)
                setFormData({ ...formData, location: e.target.value })
              }}
              placeholder="e.g., Building A, 3rd Floor"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="capacity" className="text-sm font-medium text-gray-700">
              Capacity (people) *
            </Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => {
                console.log("[v0] Venue capacity updated:", e.target.value)
                setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })
              }}
              placeholder="e.g., 100"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                console.log("[v0] Venue description updated")
                setFormData({ ...formData, description: e.target.value })
              }}
              placeholder="Describe the venue..."
              className="mt-1 min-h-20"
            />
          </div>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={!formData.name || !formData.location || !formData.capacity || isLoading}
            className="bg-[#c41e3a] hover:bg-[#a01830] text-white"
          >
            {isLoading ? "Creating..." : "Create Venue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
