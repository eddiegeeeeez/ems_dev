// Data types for the Events Management System

export type UserRole = "ORGANIZER" | "ADMIN"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  department?: string
  college?: string
  position?: string
  isOnboarded?: boolean
}

export interface Venue {
  id: string
  name: string
  capacity: number
  location: string
  image: string
  description: string
  status: "available" | "maintenance" | "inactive"
}

export interface Equipment {
  id: string
  name: string
  category: string
  quantity: number
  available: number
  venueId: string
  description: string
}

export interface Booking {
  id: string
  organizerId: string
  venueId: string
  eventTitle: string
  eventDescription: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  expectedAttendees: number
  equipment: { equipmentId: string; quantity: number }[]
  documents: { name: string; url: string }[]
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed" | "resubmission"
  createdAt: string
  updatedAt: string
  adminNotes?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "approval" | "rejection"
  read: boolean
  createdAt: string
}

export interface MaintenanceRequest {
  id: string
  venueId: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  reportedBy: string
  assignedTo?: string
  createdAt: string
  completedAt?: string
}

export interface ScheduledMaintenance {
  id: string
  venueId: string
  title: string
  description: string
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  assignedTo: string
  createdAt: string
}

export interface Department {
  id: string
  name: string
  college: string
  headOfDepartment: string
  email: string
  totalMembers: number
  activeEvents: number
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  details: string
  timestamp: string
  ipAddress?: string
}
