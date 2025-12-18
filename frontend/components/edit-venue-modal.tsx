"use client"

import { useState, useEffect, useRef } from "react"
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
import { Upload, X, Trash2 } from 'lucide-react'
import type { Venue } from "@/lib/types"
import { getStorageUrl } from "@/lib/utils"

interface EditVenueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venue: Venue | null
  onConfirm: (venueData: EditVenueData) => void
  onDelete?: () => void
  isLoading?: boolean
}

export interface EditVenueData {
  name: string
  location: string
  description: string
  capacity: number
  image?: File | null
}

export function EditVenueModal({ open, onOpenChange, venue, onConfirm, onDelete, isLoading = false }: EditVenueModalProps) {
  const [formData, setFormData] = useState<EditVenueData>({
    name: "",
    location: "",
    description: "",
    capacity: 0,
    image: null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name,
        location: venue.location,
        description: venue.description,
        capacity: venue.capacity,
        image: null,
      })
      setImagePreview(venue.image ? getStorageUrl(venue.image) : null)
    }
  }, [venue, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log("[v0] Invalid file type - must be an image")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log("[v0] File too large - max 5MB")
        return
      }

      setFormData({ ...formData, image: file })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleConfirm = () => {
    if (!formData.name || !formData.location || !formData.capacity) return
    onConfirm(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#c41e3a]">Edit Venue</DialogTitle>
          <DialogDescription>Update the venue details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Venue Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Main Auditorium" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
            <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Building A, 3rd Floor" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="capacity" className="text-sm font-medium text-gray-700">Capacity (people) *</Label>
            <Input id="capacity" type="number" value={formData.capacity || ""} onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })} placeholder="e.g., 100" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the venue..." className="mt-1 min-h-20" />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Venue Picture
            </Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Venue preview"
                    className="max-w-sm max-h-60 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#c41e3a] hover:bg-red-50 transition"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload venue picture</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex w-full justify-between items-center sm:w-auto">
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading} className="mr-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirm} disabled={!formData.name || !formData.location || !formData.capacity || isLoading} className="bg-[#c41e3a] hover:bg-[#a01830] text-white">
                {isLoading ? "Updating..." : "Update Venue"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
