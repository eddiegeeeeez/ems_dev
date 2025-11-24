"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function GeneralSettingsPage() {
  const { toast } = useToast()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoApproval, setAutoApproval] = useState(false)
  const [allowWeekendBookings, setAllowWeekendBookings] = useState(true)

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "General settings have been updated successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600 mt-1">Manage basic system configuration and preferences</p>
        </div>
        <Settings className="w-8 h-8 text-[#8B1538]" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Basic system details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input id="systemName" defaultValue="University of Mindanao Events Management" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" defaultValue="University of Mindanao" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@umindanao.edu.ph" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@umindanao.edu.ph" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemDescription">System Description</Label>
              <Textarea 
                id="systemDescription" 
                defaultValue="Comprehensive event and venue management system for the University of Mindanao."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Configuration</CardTitle>
            <CardDescription>Configure booking behavior and limitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="advanceBooking">Advance Booking Days</Label>
                <Input id="advanceBooking" type="number" defaultValue="90" />
                <p className="text-sm text-gray-600">Maximum days in advance users can book venues</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minBooking">Minimum Booking Duration (hours)</Label>
                <Input id="minBooking" type="number" defaultValue="1" />
                <p className="text-sm text-gray-600">Minimum duration for venue bookings</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Approval for Events</Label>
                  <p className="text-sm text-gray-600">Automatically approve booking requests without admin review</p>
                </div>
                <Switch checked={autoApproval} onCheckedChange={setAutoApproval} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Weekend Bookings</Label>
                  <p className="text-sm text-gray-600">Permit venue reservations on Saturdays and Sundays</p>
                </div>
                <Switch checked={allowWeekendBookings} onCheckedChange={setAllowWeekendBookings} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Operations</CardTitle>
            <CardDescription>Control system availability and operational settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50">
              <div className="space-y-1">
                <Label className="text-amber-900">Maintenance Mode</Label>
                <p className="text-sm text-amber-700">Temporarily disable the system for maintenance. Users will see a maintenance message.</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">System Timezone</Label>
              <Input id="timezone" defaultValue="Asia/Manila (UTC+8)" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[#8B1538] hover:bg-[#6B1028]">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
