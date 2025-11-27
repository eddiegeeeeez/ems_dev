"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    college: user?.college || "",
    position: user?.position || ""
  })

  // OTP states
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [otpError, setOtpError] = useState("")
  const [otpAttempts, setOtpAttempts] = useState(0)

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

  // OTP timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleSaveClick = () => {
    // Open OTP modal instead of saving directly
    setIsOtpModalOpen(true)
    sendOtp()
  }

  const sendOtp = () => {
    setOtpCode("")
    setOtpSent(true)
    setTimeLeft(120) // 2 minutes
    setOtpError("")
    setOtpAttempts(0)

    console.log(`[OTP] Sending OTP to ${user?.email}`)
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${user?.email}`,
    })
  }

  const handleResendOtp = () => {
    if (timeLeft === 0) {
      sendOtp()
    }
  }

  const handleVerifyOtp = () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifying(true)
    
    // Simulate OTP verification - in real app, this would call an API
    setTimeout(() => {
      // Mock verification - any 6 digits work, but 123456 is the demo code
      if (otpCode === "123456" || /^\d{6}$/.test(otpCode)) {
        console.log(`[OTP] Verified OTP: ${otpCode}`)
        
        // Proceed with saving profile
        setIsVerifying(false)
        toast({
          title: "Changes Saved",
          description: "Your profile has been updated successfully with OTP verification.",
        })
        
        setIsEditing(false)
        setIsOtpModalOpen(false)
        setOtpCode("")
        setOtpSent(false)
      } else {
        setOtpAttempts(otpAttempts + 1)
        setOtpError(`Invalid OTP. ${3 - otpAttempts} attempts remaining`)
        
        if (otpAttempts >= 2) {
          // Close modal after 3 failed attempts
          setTimeout(() => {
            setIsOtpModalOpen(false)
            setOtpCode("")
            setOtpSent(false)
            setOtpAttempts(0)
            setOtpError("")
          }, 1500)
        }
        
        setIsVerifying(false)
      }
    }, 800)
  }

  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false)
    setOtpCode("")
    setOtpSent(false)
    setOtpError("")
    setOtpAttempts(0)
    setTimeLeft(0)
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
                <Button onClick={handleSaveClick} className="bg-[#8B1538] hover:bg-[#6B1028]">
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

      {/* OTP Verification Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={handleCloseOtpModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#8B1538]" />
              <DialogTitle>Verify Changes</DialogTitle>
            </div>
            <DialogDescription>
              We've sent a verification code to <span className="font-semibold text-gray-900">{user?.email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!otpSent ? (
              <div className="text-center py-8">
                <Spinner className="h-8 w-8 text-[#8B1538] mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Sending verification code...</p>
              </div>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setOtpCode(value)
                      setOtpError("")
                    }}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    disabled={isVerifying}
                  />
                  <p className="text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
                </div>

                {/* Error Message */}
                {otpError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{otpError}</p>
                  </div>
                )}

                {/* Timer */}
                {timeLeft > 0 ? (
                  <p className="text-xs text-center text-gray-600">
                    Code expires in <span className="font-semibold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
                  </p>
                ) : otpSent ? (
                  <p className="text-xs text-center text-gray-500">Code has expired</p>
                ) : null}

                {/* Demo Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">Demo:</span> Enter <span className="font-mono font-semibold">123456</span> or any 6 digits to verify
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || !otpCode || otpCode.length !== 6}
                    className="flex-1 bg-[#8B1538] hover:bg-[#6B1028]"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Verify Code
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCloseOtpModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Resend Option */}
                <div className="text-center pt-2">
                  {timeLeft === 0 ? (
                    <Button
                      onClick={handleResendOtp}
                      variant="link"
                      className="text-sm text-[#8B1538] hover:text-[#6B1028]"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Resend Code
                    </Button>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Didn't receive? <span className="text-gray-600">Wait {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
