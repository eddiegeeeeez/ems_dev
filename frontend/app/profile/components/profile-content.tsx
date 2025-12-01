"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Lock, CheckCircle2, AlertCircle, Key, Shield, Trash2, Download } from 'lucide-react'
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
import { OTPVerificationModal } from "@/components/otp-verification-modal"

export default function ProfileContent() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    college: user?.college || "",
    position: user?.position || "",
    bio: ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [pendingSaveData, setPendingSaveData] = useState<any>(null)
  const [accountSettings, setAccountSettings] = useState({
    accountVisibility: true,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    weeklySummary: true,
    loginNotifications: true,
    securityAlerts: true
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department || "",
        college: user.college || "",
        position: user.position || "",
        bio: ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // Store the data and show OTP modal
    console.log("Save button clicked, showing OTP modal")
    setPendingSaveData({
      name: formData.name,
      department: formData.department,
      college: formData.college,
      position: formData.position,
      bio: formData.bio
    })
    setShowOTPModal(true)
    console.log("OTP modal state set to true")
  }

  const verifyAndSaveProfile = async (pin: string) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      
      // In production, verify OTP with backend first
      // For now, simulate verification
      if (pin !== "123456") {
        throw new Error('Invalid OTP')
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pendingSaveData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setIsEditing(false)
        setPendingSaveData(null)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error: any) {
      if (error.message === 'Invalid OTP') {
        throw error // Re-throw to be handled by OTP modal
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Success",
          description: "Your data has been exported successfully",
        })
      } else {
        throw new Error('Failed to export data')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted",
        })
        setTimeout(() => {
          logout()
        }, 2000)
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSettingChange = async (setting: string, value: boolean) => {
    setAccountSettings(prev => ({ ...prev, [setting]: value }))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [setting]: value })
      })

      if (response.ok) {
        toast({
          title: "Settings Updated",
          description: "Your preferences have been saved",
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      // Revert the change on error
      setAccountSettings(prev => ({ ...prev, [setting]: !value }))
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
        <TabsTrigger 
          value="personal" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
        >
          Personal
        </TabsTrigger>
        <TabsTrigger 
          value="account" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
        >
          Account
        </TabsTrigger>
        <TabsTrigger 
          value="security" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
        >
          Security
        </TabsTrigger>
        <TabsTrigger 
          value="notifications" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
        >
          Notifications
        </TabsTrigger>
      </TabsList>

      {/* Personal Information Tab */}
      <TabsContent value="personal" className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.name.split(' ')[0] || ''}
                  onChange={(e) => {
                    const lastName = formData.name.split(' ').slice(1).join(' ')
                    handleInputChange({ target: { name: 'name', value: `${e.target.value} ${lastName}`.trim() } } as any)
                  }}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                    const firstName = formData.name.split(' ')[0] || ''
                    handleInputChange({ target: { name: 'name', value: `${firstName} ${e.target.value}`.trim() } } as any)
                  }}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Job Title</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Senior Product Designer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college">College/Company</Label>
                <Input
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department/Location</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Passionate product designer with 8+ years of experience creating user-centered digital experiences. I love solving complex problems and turning ideas into beautiful, functional products."
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Reset form to original values
                  if (user) {
                    setFormData({
                      name: user.name,
                      email: user.email,
                      department: user.department || "",
                      college: user.college || "",
                      position: user.position || "",
                      bio: ""
                    })
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-[#8B1538] hover:bg-[#6B0D28]"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings Tab */}
      <TabsContent value="account" className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Account Status</p>
                <p className="text-sm text-gray-600">Your account is currently active</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full whitespace-nowrap">
                  Active
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Account Visibility</p>
                <p className="text-sm text-gray-600">Make your profile visible to other users</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.accountVisibility}
                  onCheckedChange={(checked) => handleSettingChange('accountVisibility', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Data Export</p>
                <p className="text-sm text-gray-600">Download a copy of your data</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="whitespace-nowrap h-9"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 w-full">
          <CardHeader>
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription className="text-red-700">Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Button 
                  variant="destructive" 
                  className="bg-red-600 hover:bg-red-700 whitespace-nowrap h-9"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers including all your bookings,
                notifications, and profile information.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TabsContent>

      {/* Security Settings Tab */}
      <TabsContent value="security" className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0" style={{minWidth: '210px'}}>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full whitespace-nowrap">
                  Enabled
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "2FA Configuration",
                      description: "Two-factor authentication is managed through your Google account",
                    })
                  }}
                  className="whitespace-nowrap h-9"
                >
                  Configure
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-medium text-gray-900">Login Notifications</p>
                <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
              </div>
              <div className="flex-shrink-0 flex justify-end" style={{minWidth: '210px'}}>
                <Switch 
                  checked={accountSettings.loginNotifications}
                  onCheckedChange={(checked) => handleSettingChange('loginNotifications', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-medium text-gray-900">Active Sessions</p>
                <p className="text-sm text-gray-600">Manage devices that are logged into your account</p>
              </div>
              <div className="flex-shrink-0 flex justify-end" style={{minWidth: '210px'}}>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "Active Sessions",
                      description: "Viewing active sessions feature coming soon",
                    })
                  }}
                  className="whitespace-nowrap h-9"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive emails about new features and updates</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Weekly Summary</p>
                <p className="text-sm text-gray-600">Get a weekly summary of your activity</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.weeklySummary}
                  onCheckedChange={(checked) => handleSettingChange('weeklySummary', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Security Alerts</p>
                <p className="text-sm text-gray-600">Important security notifications (always enabled)</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Switch 
                  checked={accountSettings.securityAlerts}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onVerify={verifyAndSaveProfile}
        title="Authorize Profile Changes"
        description="Please verify your identity before saving changes to your profile."
      />
    </Tabs>
  )
}
