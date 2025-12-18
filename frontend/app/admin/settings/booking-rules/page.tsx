"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { PasswordConfirmationModal } from "@/components/password-confirmation-modal"

interface BookingRules {
  require_approval: boolean
  approval_deadline_hours: number
  auto_reject_hours: number
  max_advance_booking_days: number
  min_booking_duration: number
  max_booking_duration: number
  operating_hours_start: string
  operating_hours_end: string
  min_advance_notice_hours: number
  allow_cancellation: boolean
  cancellation_deadline_hours: number
  require_documents: boolean
  document_deadline_days: number
  equipment_request_deadline_days: number
}

export default function BookingRulesPage() {
  const { toast } = useToast()
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [rules, setRules] = useState<BookingRules>({
    require_approval: true,
    approval_deadline_hours: 48,
    auto_reject_hours: 72,
    max_advance_booking_days: 90,
    min_booking_duration: 1,
    max_booking_duration: 8,
    operating_hours_start: "07:00",
    operating_hours_end: "22:00",
    min_advance_notice_hours: 24,
    allow_cancellation: true,
    cancellation_deadline_hours: 24,
    require_documents: true,
    document_deadline_days: 3,
    equipment_request_deadline_days: 3
  })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiBase}/admin/settings/booking-rules`)
      if (!response.ok) throw new Error('Failed to fetch rules')

      const data = await response.json()
      setRules(data.rules)
    } catch (error) {
      console.error('Error fetching rules:', error)
      toast({
        title: "Error",
        description: "Failed to load booking rules",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setRules(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setRules(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleSaveClick = () => {
    setShowPasswordModal(true)
  }

  const handleConfirmPassword = async (password: string) => {
    try {
      setIsSaving(true)
      const response = await fetch(`${apiBase}/admin/settings/booking-rules`, {
        method: 'PUT', // Changed to PUT to match controller
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...rules, current_password: password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save rules');
      }

      toast({
        title: "Booking rules updated",
        description: "All booking rules have been saved successfully.",
      })
      setShowPasswordModal(false)
    } catch (error: any) {
      console.error('Error saving rules:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save booking rules",
        variant: "destructive"
      })
      // Do not close modal on error so user can retry password
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Loading booking rules...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Rules</h1>
          <p className="text-gray-600 mt-1">Configure rules and policies for venue bookings</p>
        </div>
        <FileText className="w-8 h-8 text-[#8B1538]" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval & Deadline Settings</CardTitle>
            <CardDescription>Configure booking approval workflow and timelines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="require_approval">Administrator Approval</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    id="require_approval"
                    name="require_approval"
                    type="checkbox"
                    checked={rules.require_approval}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <Label htmlFor="require_approval" className="font-normal cursor-pointer">
                    Require approval for new bookings
                  </Label>
                </div>
                <p className="text-sm text-gray-500">All bookings must be reviewed by administrators</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval_deadline_hours">Approval Deadline (hours)</Label>
                <Input
                  id="approval_deadline_hours"
                  name="approval_deadline_hours"
                  type="number"
                  min="1"
                  value={rules.approval_deadline_hours}
                  onChange={handleInputChange}
                  placeholder="48"
                />
                <p className="text-sm text-gray-500">Time administrators have to approve pending requests</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto_reject_hours">Auto-Reject After (hours)</Label>
                <Input
                  id="auto_reject_hours"
                  name="auto_reject_hours"
                  type="number"
                  min="1"
                  value={rules.auto_reject_hours}
                  onChange={handleInputChange}
                  placeholder="72"
                />
                <p className="text-sm text-gray-500">Automatically reject bookings not approved within this time</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_advance_notice_hours">Minimum Advance Notice (hours)</Label>
                <Input
                  id="min_advance_notice_hours"
                  name="min_advance_notice_hours"
                  type="number"
                  min="1"
                  value={rules.min_advance_notice_hours}
                  onChange={handleInputChange}
                  placeholder="24"
                />
                <p className="text-sm text-gray-500">Minimum hours before event to submit booking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
            <CardDescription>Set venue operating hours for bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="operating_hours_start">Operating Hours Start</Label>
                <Input
                  id="operating_hours_start"
                  name="operating_hours_start"
                  type="time"
                  value={rules.operating_hours_start}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operating_hours_end">Operating Hours End</Label>
                <Input
                  id="operating_hours_end"
                  name="operating_hours_end"
                  type="time"
                  value={rules.operating_hours_end}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Duration Settings</CardTitle>
            <CardDescription>Configure booking duration constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="min_booking_duration">Minimum Duration (hours)</Label>
                <Input
                  id="min_booking_duration"
                  name="min_booking_duration"
                  type="number"
                  min="1"
                  value={rules.min_booking_duration}
                  onChange={handleInputChange}
                  placeholder="1"
                />
                <p className="text-sm text-gray-500">Minimum hours for a single booking</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_booking_duration">Maximum Duration (hours)</Label>
                <Input
                  id="max_booking_duration"
                  name="max_booking_duration"
                  type="number"
                  min="1"
                  value={rules.max_booking_duration}
                  onChange={handleInputChange}
                  placeholder="8"
                />
                <p className="text-sm text-gray-500">Maximum hours for a single booking</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_advance_booking_days">Maximum Advance Booking (days)</Label>
                <Input
                  id="max_advance_booking_days"
                  name="max_advance_booking_days"
                  type="number"
                  min="1"
                  value={rules.max_advance_booking_days}
                  onChange={handleInputChange}
                  placeholder="90"
                />
                <p className="text-sm text-gray-500">Maximum days in advance users can book</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation & Requests</CardTitle>
            <CardDescription>Configure cancellation and request policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="allow_cancellation">Cancellation Policy</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    id="allow_cancellation"
                    name="allow_cancellation"
                    type="checkbox"
                    checked={rules.allow_cancellation}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <Label htmlFor="allow_cancellation" className="font-normal cursor-pointer">
                    Allow users to cancel bookings
                  </Label>
                </div>
                <p className="text-sm text-gray-500">Enable self-service cancellation</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_deadline_hours">Cancellation Deadline (hours)</Label>
                <Input
                  id="cancellation_deadline_hours"
                  name="cancellation_deadline_hours"
                  type="number"
                  min="1"
                  value={rules.cancellation_deadline_hours}
                  onChange={handleInputChange}
                  placeholder="24"
                />
                <p className="text-sm text-gray-500">Hours before event to allow cancellations</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="require_documents">Documentation</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    id="require_documents"
                    name="require_documents"
                    type="checkbox"
                    checked={rules.require_documents}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <Label htmlFor="require_documents" className="font-normal cursor-pointer">
                    Require event documents
                  </Label>
                </div>
                <p className="text-sm text-gray-500">Require users to submit event documents</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_deadline_days">Document Deadline (days)</Label>
                <Input
                  id="document_deadline_days"
                  name="document_deadline_days"
                  type="number"
                  min="1"
                  value={rules.document_deadline_days}
                  onChange={handleInputChange}
                  placeholder="3"
                />
                <p className="text-sm text-gray-500">Days before event to submit documents</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment_request_deadline_days">Equipment Request Deadline (days)</Label>
                <Input
                  id="equipment_request_deadline_days"
                  name="equipment_request_deadline_days"
                  type="number"
                  min="1"
                  value={rules.equipment_request_deadline_days}
                  onChange={handleInputChange}
                  placeholder="3"
                />
                <p className="text-sm text-gray-500">Days before event to request equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="bg-[#8B1538] hover:bg-[#6B1028]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Rules"}
          </Button>
        </div>
      </div>

      <PasswordConfirmationModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        onConfirm={handleConfirmPassword}
        isLoading={isSaving}
        title="Confirm Booking Rules Changes"
        description="Please key in your admin password to confirm these changes."
      />
    </div>
  )
}
