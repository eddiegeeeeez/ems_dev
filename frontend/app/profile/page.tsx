"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    college: user?.college || "",
    position: user?.position || ""
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

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

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#8B1538] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-[#8B1538] hover:bg-[#6B1028]">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-[#8B1538] hover:bg-[#6B1028]">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 bg-[#4caf50]">
                    <AvatarFallback className="bg-[#4caf50] text-white text-2xl font-bold">
                      {user?.avatar || user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <Badge className={user?.role === "admin" ? "bg-[#8B1538] text-white mt-2" : "bg-[#4caf50] text-white mt-2"}>
                      {user?.role === "admin" ? "Admin" : "Event Organizer"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-gray-900 p-2">{user?.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <div>
                          <Input 
                            id="email" 
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed (Google account)</p>
                        </div>
                      ) : (
                        <p className="text-gray-900 p-2">{user?.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      {isEditing ? (
                        <Input 
                          id="college" 
                          value={formData.college}
                          onChange={(e) => setFormData({...formData, college: e.target.value})}
                        />
                      ) : (
                        <p className="text-gray-900 p-2">{user?.college || "N/A"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Input 
                          id="department" 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                        />
                      ) : (
                        <p className="text-gray-900 p-2">{user?.department || "N/A"}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position (Optional)</Label>
                    {isEditing ? (
                      <Input 
                        id="position" 
                        placeholder="e.g., Department Head, Faculty Member"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 p-2">{user?.position || "Not specified"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
