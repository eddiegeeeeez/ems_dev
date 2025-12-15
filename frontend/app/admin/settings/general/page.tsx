"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface GeneralSettings {
  system_name: string
  university_name: string
  admin_email: string
  support_email: string
  system_description: string
  maintenance_mode: boolean
  auto_approval_enabled: boolean
  timezone: string
  advance_booking_days: number
  min_booking_duration: number
  allow_weekend_bookings: boolean
}

export default function GeneralSettingsPage() {
  const { toast } = useToast()
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<GeneralSettings>({
    system_name: "",
    university_name: "",
    admin_email: "",
    support_email: "",
    system_description: "",
    maintenance_mode: false,
    auto_approval_enabled: false,
    timezone: "",
    advance_booking_days: 90,
    min_booking_duration: 1,
    allow_weekend_bookings: false
  })


  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiBase}/admin/settings/general`)
      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load general settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const response = await fetch(`${apiBase}/admin/settings/general`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Loading general settings...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600 mt-1">Configure basic system information</p>
        </div>
        <Settings className="w-8 h-8 text-[#8B1538]" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Basic configuration and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="system_name">System Name</Label>
                <Input 
                  id="system_name"
                  name="system_name"
                  value={settings.system_name}
                  onChange={handleInputChange}
                  placeholder="Enter system name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university_name">Institution Name</Label>
                <Input 
                  id="university_name"
                  name="university_name"
                  value={settings.university_name}
                  onChange={handleInputChange}
                  placeholder="Enter institution name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input 
                  id="admin_email"
                  name="admin_email"
                  type="email"
                  value={settings.admin_email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_email">Support Email</Label>
                <Input 
                  id="support_email"
                  name="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={handleInputChange}
                  placeholder="support@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleSelectChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Manila">Asia/Manila (UTC+8)</SelectItem>
                    <SelectItem value="Asia/Bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore (UTC+8)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advance_booking_days">Advance Booking Days</Label>
                <Input 
                  id="advance_booking_days"
                  name="advance_booking_days"
                  type="number"
                  min="1"
                  value={settings.advance_booking_days}
                  onChange={handleInputChange}
                  placeholder="90"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system_description">System Description</Label>
              <Textarea 
                id="system_description"
                name="system_description"
                rows={4}
                value={settings.system_description}
                onChange={handleInputChange}
                placeholder="Enter system description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Configuration</CardTitle>
            <CardDescription>Default booking behavior settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="min_booking_duration">Minimum Booking Duration (hours)</Label>
                <Input 
                  id="min_booking_duration"
                  name="min_booking_duration"
                  type="number"
                  min="1"
                  value={settings.min_booking_duration}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </div>

              <div className="space-y-4 flex items-end">
                <div className="flex items-center space-x-3">
                  <input 
                    id="allow_weekend_bookings"
                    name="allow_weekend_bookings"
                    type="checkbox"
                    checked={settings.allow_weekend_bookings}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="allow_weekend_bookings" className="cursor-pointer">
                    Allow Weekend Bookings
                  </Label>
                </div>
              </div>

              <div className="space-y-4 flex items-end">
                <div className="flex items-center space-x-3">
                  <input 
                    id="auto_approval_enabled"
                    name="auto_approval_enabled"
                    type="checkbox"
                    checked={settings.auto_approval_enabled}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="auto_approval_enabled" className="cursor-pointer">
                    Enable Auto-Approval for Bookings
                  </Label>
                </div>
              </div>

              <div className="space-y-4 flex items-end">
                <div className="flex items-center space-x-3">
                  <input 
                    id="maintenance_mode"
                    name="maintenance_mode"
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="maintenance_mode" className="cursor-pointer">
                    Maintenance Mode
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-[#8B1538] hover:bg-[#6B1028]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
