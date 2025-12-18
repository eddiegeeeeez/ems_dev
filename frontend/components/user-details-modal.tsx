"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Mail, Building2, GraduationCap, Briefcase, Shield, UserCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { UM_COLLEGES } from "@/lib/um-data"

interface UserDetailsModalProps {
  user: {
    id: string
    email: string
    name: string
    role: "organizer" | "admin"
    college?: string
    department?: string
    position?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleChange?: (userId: string, newRole: "organizer" | "admin") => void
  onPositionChange?: (userId: string, newPosition: string) => void
}

export function UserDetailsModal({ user, open, onOpenChange, onRoleChange, onPositionChange }: UserDetailsModalProps) {
  const [position, setPosition] = useState(user.position || "")
  const [selectedCollege, setSelectedCollege] = useState(user.college || "")
  const [selectedProgram, setSelectedProgram] = useState(user.department || "")
  const [selectedRole, setSelectedRole] = useState<"organizer" | "admin">(user.role)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])

  // Update local state when user prop changes
  useEffect(() => {
    setPosition(user.position || "")
    setSelectedCollege(user.college || "")
    setSelectedProgram(user.department || "")
    setSelectedRole(user.role)
  }, [user])

  // Update available programs when college changes
  useEffect(() => {
    if (selectedCollege) {
      const college = UM_COLLEGES.find(c => c.name === selectedCollege)
      setAvailablePrograms(college?.programs ? [...college.programs] : [])
    } else {
      setAvailablePrograms([])
    }
  }, [selectedCollege])

  const handleClose = () => {
    setPassword("")
    setIsPasswordOpen(false)
    onOpenChange(false)
  }

  const handleSaveClick = () => {
    if (selectedRole !== user.role) {
      setIsPasswordOpen(true)
    } else {
      handleClose()
    }
  }

  const handleConfirmSave = () => {
    // Ideally, we would verify the password with the backend here
    if (password.trim() === "") return // Simple validation

    if (onRoleChange && selectedRole !== user.role) {
      onRoleChange(user.id, selectedRole)
    }

    // Position change is not supported in this "Role Only" edit mode per user request, 
    // but if we wanted to support it, we'd check 'position' vs 'user.position' here.

    handleClose()
  }



  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">User Details</DialogTitle>
            <DialogDescription>Complete information and activity history</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Profile Section */}
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-xl flex-shrink-0">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={selectedRole === "admin" ? "bg-[#c41e3a]" : "bg-[#4caf50]"}>
                    {selectedRole === "admin" ? "Administrator" : "Organizer"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.college && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.college}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.department}</span>
                    </div>
                  )}
                  {user.position && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.position}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Management Section */}
            <div className="p-5 bg-white border border-gray-200 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Role & Position Management</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    User Role
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value: "organizer" | "admin") => setSelectedRole(value)}
                  >
                    <SelectTrigger id="role" className="w-full md:w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organizer">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Organizer</div>
                            <div className="text-xs text-gray-500">Can create and manage bookings</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Administrator</div>
                            <div className="text-xs text-gray-500">Full system access and management</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Read-Only Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      College
                    </Label>
                    <Input value={selectedCollege} disabled className="bg-gray-50 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program" className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Program
                    </Label>
                    <Input value={selectedProgram} disabled className="bg-gray-50 text-gray-500" />
                  </div>
                </div>

                <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
                  <strong>Note:</strong> Changing a user&apos;s role will immediately affect their access permissions and available features.
                </p>
              </div>
            </div>


          </div>

          <DialogFooter className="mt-6 flex flex-row gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveClick} className="bg-[#c41e3a] hover:bg-[#a01830] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Authentication</DialogTitle>
            <DialogDescription>
              Please enter your password to confirm this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} className="bg-[#c41e3a] hover:bg-[#a01830]">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
