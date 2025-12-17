"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Database, Mail } from 'lucide-react'
import { OTPVerificationModal } from "@/components/otp-verification-modal"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

interface GeneralSettings {
  system_name: string
  admin_email: string
  maintenance_mode: boolean
  auto_approval_enabled: boolean
}

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpAction, setOTPAction] = useState<'general' | 'security' | null>(null)
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    system_name: "",
    admin_email: "",
    maintenance_mode: false,
    auto_approval_enabled: false
  })
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiBase}/admin/settings/general`)
      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const data = await response.json()
      setGeneralSettings(data.settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setGeneralSettings(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSaveSettings = (action: 'general' | 'security') => {
    setOTPAction(action)
    setShowOTPModal(true)
  }

  const verifyAndSaveSettings = async (pin: string) => {
    try {
      // In production, verify OTP with backend first
      if (pin !== "123456") {
        throw new Error('Invalid OTP')
      }

      setIsSaving(true)
      // Save general settings if that's what's being saved
      if (otpAction === 'general') {
        const response = await fetch(`${apiBase}/admin/settings/general`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(generalSettings),
        })

        if (!response.ok) throw new Error('Failed to save settings')
      }

      toast({
        title: "Success",
        description: `${otpAction === 'general' ? 'General' : 'Security'} settings saved successfully`,
      })
      setOTPAction(null)
    } catch (error: any) {
      if (error.message === 'Invalid OTP') {
        throw error // Re-throw to be handled by OTP modal
      }
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="p-6">
          <div className="text-center text-gray-600">Loading settings...</div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage basic system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="system_name">System Name</Label>
                  <Input 
                    id="system_name"
                    name="system_name"
                    value={generalSettings.system_name}
                    onChange={handleInputChange}
                    placeholder="Enter system name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_email">Admin Email</Label>
                  <Input 
                    id="admin_email"
                    name="admin_email"
                    type="email"
                    value={generalSettings.admin_email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input 
                      id="maintenance_mode"
                      name="maintenance_mode"
                      type="checkbox"
                      checked={generalSettings.maintenance_mode}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="maintenance_mode" className="cursor-pointer">
                      Enable Maintenance Mode
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input 
                      id="auto_approval_enabled"
                      name="auto_approval_enabled"
                      type="checkbox"
                      checked={generalSettings.auto_approval_enabled}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="auto_approval_enabled" className="cursor-pointer">
                      Enable Auto-Approval for Bookings
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings('general')}
                    disabled={isSaving}
                    className="bg-[#8B1538] hover:bg-[#6B1028]"
                  >
                    {isSaving ? "Saving..." : "Save General Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input 
                    id="email_notifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="email_notifications" className="cursor-pointer">
                    Enable Email Notifications
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, the system will send email notifications for booking approvals, rejections, and other important events.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Email Templates</CardTitle>
                <CardDescription>Manage email templates from the dedicated page</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  To customize email templates, visit the Email Templates settings page.
                </p>
                <Button variant="outline" asChild>
                  <a href="/admin/settings/email-templates">Go to Email Templates</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage system security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-600">
                  Security settings help protect your system and user data. Changes to security settings require verification.
                </p>
                <Button 
                  onClick={() => handleSaveSettings('security')}
                  className="bg-[#8B1538] hover:bg-[#6B1028]"
                >
                  Verify and Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Information</CardTitle>
                <CardDescription>View database connection details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Database configuration is managed through environment variables. Please contact your system administrator for changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <OTPVerificationModal 
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onVerify={verifyAndSaveSettings}
        onResend={() => Promise.resolve()}
        title="Verify Settings Change"
        description="Enter your OTP to confirm these changes"
      />
    </ProtectedRoute>
  )
}
