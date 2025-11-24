"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Shield, UserCircle, Search } from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import { UserDetailsModal } from "@/components/user-details-modal"

interface UserData {
  id: string
  email: string
  name: string
  role: "organizer" | "admin"
  college?: string
  department?: string
  position?: string
}

export default function UserManagementPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "user-1",
      email: "edgar.garan@umindanao.edu.ph",
      name: "Edgar Allain Sobremonte Garan",
      role: "organizer",
      college: "College of Computer Studies",
      department: "Bachelor of Science in Information Technology",
      position: "Event Organizer",
    },
    {
      id: "admin-1",
      email: "admin@umindanao.edu.ph",
      name: "Maria Santos",
      role: "admin",
      college: "University Administration",
      department: "Facilities Management",
      position: "Facility Manager",
    },
  ])

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRoleChange = (userId: string, newRole: "organizer" | "admin") => {
    console.log("[v0] Changing user role:", { userId, newRole })
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole })
    }
    setRefreshKey(prev => prev + 1)
  }

  const handlePositionChange = (userId: string, newPosition: string) => {
    console.log("[v0] Changing user position:", { userId, newPosition })
    setUsers(users.map((u) => (u.id === userId ? { ...u, position: newPosition } : u)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, position: newPosition })
    }
    setRefreshKey(prev => prev + 1)
  }

  const handleViewDetails = (userData: UserData) => {
    setSelectedUser(userData)
    setIsDetailsOpen(true)
  }

  return (
    <AdminGuard>
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage user roles and positions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("[v0] Search query:", e.target.value)
                  setSearchQuery(e.target.value)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-xs flex-shrink-0">
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                          <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{userData.college || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{userData.department || "N/A"}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                        {userData.role === "admin" ? (
                          <>
                            <Shield className="h-4 w-4 text-[#c41e3a]" />
                            <span className="font-medium text-[#c41e3a]">Admin</span>
                          </>
                        ) : (
                          <>
                            <UserCircle className="h-4 w-4 text-[#4caf50]" />
                            <span className="font-medium text-[#4caf50]">Organizer</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(userData)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found matching your search.</p>
            </div>
          )}
        </div>

        {/* UserDetailsModal */}
        {selectedUser && (
          <UserDetailsModal 
            key={refreshKey}
            user={selectedUser} 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
            onRoleChange={handleRoleChange}
            onPositionChange={handlePositionChange}
          />
        )}
      </main>
    </AdminGuard>
  )
}
