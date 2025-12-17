"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Lock, CheckCircle2, AlertCircle, Key, Shield, Trash2, Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UM_COLLEGES } from "@/lib/um-data"
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
import { TwoFactorSetupModal } from "@/components/profile/two-factor-setup-modal"

export default function ProfileContent() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    college: user?.college || "",
    position: user?.position || ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Available Programs Logic
  const selectedCollegeData = UM_COLLEGES.find(c => c.name === formData.college)
  const availablePrograms = selectedCollegeData?.programs || []

  const [accountSettings, setAccountSettings] = useState({
    loginNotifications: true,
  })

  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)

  const handleEnableTwoFactor = async (pin: string, password: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pin,
          pin_confirmation: pin, // Controller expects confirmation
          password
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to enable 2FA')
      }

      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled.",
      })

      // Update local user state if possible, effectively re-fetch user or update context
      // For now we might need to rely on page reload or specific update if user object isn't automatically updated
      window.location.reload()

    } catch (error) {
      throw error // Modal handles display
    }
  }

  const handleDisableTwoFactor = async () => {
    // In a real app we'd ask for password here too, but for simplicity/User Request we might skip or use a simple prompt
    // The previous request implied a flow for enabling. For disabling, let's assume we just call the endpoint.
    // However, the backend requires password. We should probably re-use the modal or a simple prompt.
    // For now, let's keep it simple and maybe just alert the user they can't disable it easily without password UI, 
    // OR we can use the same modal in a "DISABLE" mode? 
    // The user request didn't specify disable flow details, but backend demands password.
    // Let's use a simple prompt for now to get the password.

    const password = prompt("Please enter your password to disable 2FA:")
    if (!password) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        throw new Error('Failed to disable 2FA')
      }

      toast({
        title: "Success",
        description: "Two-factor authentication disabled.",
      })
      window.location.reload()

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA. Check your password.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department || "",
        college: user.college || "",
        position: user.position || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Use Sanctum cookie authentication
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          college: formData.college,
          position: formData.position
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={user?.role === "ADMIN" ? "Administrator" : "Organizer"}
                  disabled
                  className="bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Select
                  value={formData.college}
                  onValueChange={(value) => {
                    handleInputChange({ target: { name: 'college', value } } as any)
                    // Reset department when college changes
                    handleInputChange({ target: { name: 'department', value: '' } } as any)
                  }}
                >
                  <SelectTrigger id="college" className="w-full">
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {UM_COLLEGES.map((col) => (
                      <SelectItem key={col.code} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => {
                    handleInputChange({ target: { name: 'department', value } } as any)
                  }}
                  disabled={!formData.college}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder={formData.college ? "Select department" : "Select college first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrograms.map((prog) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                      position: user.position || ""
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
              <div className="flex items-center gap-3 flex-shrink-0" style={{ minWidth: '210px' }}>
                {user?.two_factor_enabled_at ? (
                  <>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full whitespace-nowrap">
                      Enabled
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleDisableTwoFactor}
                      className="whitespace-nowrap h-9 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                      Disable
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap">
                      Disabled
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setShowTwoFactorModal(true)}
                      className="whitespace-nowrap h-9"
                    >
                      Enable
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-medium text-gray-900">Login Notifications</p>
                <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
              </div>
              <div className="flex-shrink-0 flex justify-end" style={{ minWidth: '210px' }}>
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
              <div className="flex-shrink-0 flex justify-end" style={{ minWidth: '210px' }}>
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

      <TwoFactorSetupModal
        open={showTwoFactorModal}
        onOpenChange={setShowTwoFactorModal}
        onEnable={handleEnableTwoFactor}
      />
    </Tabs>
  )
}
