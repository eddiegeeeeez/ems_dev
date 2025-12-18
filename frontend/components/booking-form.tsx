"use client"

import type React from "react"
import { useState } from "react"
import type { Venue } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EquipmentModal } from "@/components/equipment-modal"
import { AlertCircle, CheckCircle, Plus, X, Upload, FileText } from 'lucide-react'

interface BookingFormProps {
  venue: Venue
  onSuccess?: () => void
}

export function BookingForm({ venue, onSuccess }: BookingFormProps) {
  const { user } = useAuth()
  const { equipment, addBooking, checkVenueAvailability } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, number>>({})
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const venueEquipment = equipment.filter((eq) => (eq.venueId || eq.venue_id) === venue.id)

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDescription: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    expectedAttendees: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log("[v0] Form field updated:", name, "Value:", value)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEquipment = (equipmentId: string, quantity: number) => {
    console.log("[v0] Equipment added to booking:", equipmentId, "Quantity:", quantity)
    setSelectedEquipment((prev) => ({
      ...prev,
      [equipmentId]: quantity,
    }))
  }

  const handleRemoveEquipment = (equipmentId: string) => {
    console.log("[v0] Equipment removed from booking:", equipmentId)
    setSelectedEquipment((prev) => {
      const updated = { ...prev }
      delete updated[equipmentId]
      return updated
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError("File size must be less than 10MB")
      e.target.value = ""
      return
    }

    console.log("[v0] File uploaded:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB")
    setUploadedFile(file)
    setError("")
  }

  const handleRemoveFile = () => {
    console.log("[v0] File removed")
    setUploadedFile(null)
    const fileInput = document.getElementById("document-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!formData.eventTitle || !formData.startDate || !formData.startTime || !formData.endTime) {
        throw new Error("Please fill in all required fields")
      }

      if (!uploadedFile) {
        throw new Error("Please upload supporting documents")
      }

      if (
        new Date(`${formData.startDate}T${formData.startTime}`) >=
        new Date(`${formData.endDate || formData.startDate}T${formData.endTime}`)
      ) {
        throw new Error("End time must be after start time")
      }

      // Prepare FormData for backend
      const payload = new FormData()
      payload.append('venue_id', venue.id)
      payload.append('event_title', formData.eventTitle)
      if (formData.eventDescription) payload.append('event_description', formData.eventDescription)
      payload.append('start_datetime', `${formData.startDate} ${formData.startTime}:00`)
      payload.append('end_datetime', `${formData.endDate || formData.startDate} ${formData.endTime}:00`)
      payload.append('expected_attendees', formData.expectedAttendees || "1")

      // Equipment
      const equipmentList = Object.entries(selectedEquipment).map(([equipmentId, quantity]) => ({
        equipment_id: equipmentId,
        quantity: quantity,
      }))

      equipmentList.forEach((item, index) => {
        payload.append(`equipment[${index}][equipment_id]`, item.equipment_id)
        payload.append(`equipment[${index}][quantity]`, item.quantity.toString())
      })

      // File
      if (uploadedFile) {
        payload.append('documents[]', uploadedFile)
      }

      console.log("[BookingForm] Submitting booking via FormData")

      // Call backend API using apiClient
      const result = await apiClient.createBooking(payload)
      console.log("[BookingForm] Booking created successfully:", result)

      setSuccess(true)
      setFormData({
        eventTitle: "",
        eventDescription: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        expectedAttendees: "",
      })
      setSelectedEquipment({})
      setUploadedFile(null)

      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error("[BookingForm] Error:", err)
      setError(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedEquipmentDetails = Object.entries(selectedEquipment).map(([equipmentId, quantity]) => {
    const eq = equipment.find((e) => e.id === equipmentId)
    return { ...eq, quantity }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book {venue.name}</CardTitle>
        <CardDescription>Fill in the details for your event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-[#4caf50] bg-[#f0f9ff]">
              <CheckCircle className="h-4 w-4 text-[#4caf50]" />
              <AlertDescription className="text-[#4caf50]">
                Booking request submitted successfully! Pending admin approval.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Event Details</h3>

            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700">Event Title *</label>
              <Input
                type="text"
                name="eventTitle"
                value={formData.eventTitle}
                onChange={handleInputChange}
                placeholder="e.g., Annual IT Department Seminar"
                className="mt-1 border-gray-300 text-xs md:text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700">Event Description</label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleInputChange}
                placeholder="Describe your event..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-xs md:text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700">Start Date *</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 text-xs md:text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700">Start Time *</label>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 text-xs md:text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700">End Time *</label>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 text-xs md:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700">Expected Attendees</label>
              <Input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleInputChange}
                placeholder="0"
                className="mt-1 border-gray-300 text-xs md:text-sm"
                min="0"
                max={venue.capacity}
              />
              <p className="text-xs text-gray-500 mt-1">Venue capacity: {venue.capacity} people</p>
            </div>
          </div>

          {venueEquipment.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Equipment (Optional)</h3>
                <Button
                  type="button"
                  onClick={() => {
                    console.log("[v0] Equipment modal opened")
                    setEquipmentModalOpen(true)
                  }}
                  size="sm"
                  className="bg-[#4caf50] hover:bg-[#45a049] text-white text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Equipment
                </Button>
              </div>

              {selectedEquipmentDetails.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-xs md:text-sm text-gray-700">Equipment Name</TableHead>
                        <TableHead className="font-medium text-xs md:text-sm text-gray-700 text-center">Quantity</TableHead>
                        <TableHead className="font-medium text-xs md:text-sm text-gray-700 text-center w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEquipmentDetails.map((eq) => (
                        <TableRow key={eq?.id}>
                          <TableCell className="font-medium text-xs md:text-sm">{eq?.name}</TableCell>
                          <TableCell className="text-xs md:text-sm text-center">{eq?.quantity}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              onClick={() => handleRemoveEquipment(eq?.id || "")}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Supporting Documents <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500">
                Upload activity proposal or other supporting documents (Max 10MB)
              </p>

              {!uploadedFile ? (
                <div className="relative">
                  <input
                    type="file"
                    id="document-upload"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label
                    htmlFor="document-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#4caf50] hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload document</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-[#4caf50] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs md:text-sm truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleRemoveFile}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#c41e3a] hover:bg-[#a01830] text-white text-xs md:text-sm"
            >
              {isLoading ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Your booking will be reviewed by the facility manager and you will receive a notification once approved or
            rejected.
          </p>
        </form>
      </CardContent>

      <EquipmentModal
        open={equipmentModalOpen}
        onOpenChange={setEquipmentModalOpen}
        equipment={venueEquipment}
        onAddEquipment={handleAddEquipment}
        selectedEquipment={selectedEquipment}
      />
    </Card>
  )
}
