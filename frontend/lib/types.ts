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
  created_at?: string
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
  available?: number // Legacy/Frontend
  available_quantity?: number // Snake_case from backend
  venueId?: string // CamelCase legacy/mapped
  venue_id?: string | null // Snake_case from backend
  collegeId?: string // CamelCase legacy/mapped
  college_id?: string // Snake_case from backend
  description: string
  venue?: Venue
  college?: College
}

// Assuming BookingEquipment and BookingDocument are defined elsewhere or will be added.
// For the purpose of this edit, we'll use the types as specified in the instruction.
export type BookingEquipment = { equipmentId: string; quantity: number };
export type BookingDocument = { name: string; url: string };

export interface Booking {
  id: string
  userId?: string
  organizerId: string
  venueId: string
  eventTitle: string
  eventDescription: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  expectedAttendees: number
  equipment: BookingEquipment[]
  documents?: BookingDocument[]
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  adminNotes?: string
  rejectionReason?: string
  qrCode?: string
  // Nested objects from backend
  venue?: {
    id: string
    name: string
    location: string
    capacity: number
  }
  user?: {
    id: string
    name: string
    email: string
    role: string
    department?: string
    college?: string
  }
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "approval" | "rejection"
  read: boolean
  createdAt: string
  relatedId?: string
}

export interface Program {
  id: number
  collegeId: number
  name: string
  isActive: boolean
}

export interface College {
  id: string
  name: string
  code: string
  dean: string
  description: string | null
  programs?: Program[]
  programsCount?: number
  isActive: boolean
}

// Deprecated alias for backward compatibility until refactor is complete
export type Department = College

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
