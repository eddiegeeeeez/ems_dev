"use client"

import { useState, useRef } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X } from 'lucide-react'

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
  image?: File
}

export function AddVenueModal({ open, onOpenChange, onConfirm, isLoading = false }: AddVenueModalProps) {
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    location: "",
    description: "",
    capacity: 0,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    onOpenChange(false)
  }

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
    setFormData({ ...formData, image: undefined })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleConfirm = () => {
    if (!formData.name || !formData.location || !formData.capacity) {
      console.log("[v0] Form validation failed - missing required fields")
      return
    }
    console.log("[v0] Opening confirmation dialog for new venue:", formData)
    setIsConfirmOpen(true)
  }

  const handleProceed = () => {
    console.log("[v0] Confirmed adding new venue:", formData)
    onConfirm(formData)
    setFormData({
      name: "",
      location: "",
      description: "",
      capacity: 0,
    })
    setImagePreview(null)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new venue &quot;{formData.name}&quot; with a capacity of {formData.capacity}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceed}
              className="bg-[#c41e3a] hover:bg-[#a01830] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
