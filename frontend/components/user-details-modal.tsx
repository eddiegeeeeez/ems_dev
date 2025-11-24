"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Building2, GraduationCap, Briefcase, Calendar, CheckCircle, XCircle, Clock, Award } from "lucide-react"

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
}

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  // Mock booking statistics - in real app, fetch from API
  const bookingStats = {
    total: 24,
    approved: 18,
    pending: 3,
    rejected: 2,
    completed: 15,
  }

  const recentBookings = [
    {
      id: "1",
      eventTitle: "Computer Science Workshop",
      venue: "Tech Hub Room",
      date: "2024-01-15",
      status: "approved" as const,
    },
    {
      id: "2",
      eventTitle: "Student Council Meeting",
      venue: "Conference Room A",
      date: "2024-01-10",
      status: "completed" as const,
    },
    {
      id: "3",
      eventTitle: "Career Fair 2024",
      venue: "University Auditorium",
      date: "2024-01-05",
      status: "pending" as const,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Details</DialogTitle>
          <DialogDescription>Complete information and activity history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-xl flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={user.role === "admin" ? "bg-[#c41e3a]" : "bg-[#4caf50]"}>
                  {user.role === "admin" ? "Administrator" : "Event Organizer"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.college && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{user.college}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span className="truncate">{user.department}</span>
                  </div>
                )}
                {user.position && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="truncate">{user.position}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="statistics" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            </TabsList>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-[#c41e3a]" />
                    <span className="text-sm text-gray-600">Total Bookings</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.approved}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.pending}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-gray-600">Rejected</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.rejected}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.completed}</p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-[#4caf50]" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((bookingStats.approved / bookingStats.total) * 100)}%
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Performance:</strong> This user has maintained an excellent booking success rate and
                  consistently follows venue booking guidelines.
                </p>
              </div>
            </TabsContent>

            {/* Recent Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{booking.eventTitle}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{booking.venue}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Bookings
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
