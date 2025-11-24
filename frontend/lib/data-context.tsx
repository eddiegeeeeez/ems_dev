"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Venue, Equipment, Booking, Notification, User, MaintenanceRequest, ScheduledMaintenance, Department, AuditLog } from "./types"
import { mockVenues, mockEquipment, mockBookings, mockUsers, mockMaintenanceRequests, mockScheduledMaintenance, mockDepartments, mockAuditLogs } from "./mock-data"

interface DataContextType {
  venues: Venue[]
  equipment: Equipment[]
  bookings: Booking[]
  notifications: Notification[]
  users: User[]
  maintenanceRequests: MaintenanceRequest[]
  scheduledMaintenance: ScheduledMaintenance[]
  departments: Department[]
  auditLogs: AuditLog[]
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  getVenueById: (id: string) => Venue | undefined
  getBookingsByOrganizer: (organizerId: string) => Booking[]
  getBookingsByVenue: (venueId: string) => Booking[]
  checkVenueAvailability: (
    venueId: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
  ) => boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    // Initialize with mock data
    setVenues(mockVenues)
    setEquipment(mockEquipment)
    setBookings(mockBookings)
    setUsers(mockUsers)
    setMaintenanceRequests(mockMaintenanceRequests)
    setScheduledMaintenance(mockScheduledMaintenance)
    setDepartments(mockDepartments)
    setAuditLogs(mockAuditLogs)
  }, [])

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking])
    // Add notification for admin
    addNotification({
      id: `notif-${Date.now()}`,
      userId: "admin-1",
      title: "New Booking Request",
      message: `New event booking: ${booking.eventTitle}`,
      type: "booking",
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const cancelBooking = (id: string) => {
    updateBooking(id, { status: "cancelled" })
  }

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getVenueById = (id: string) => venues.find((v) => v.id === id)

  const getBookingsByOrganizer = (organizerId: string) => bookings.filter((b) => b.organizerId === organizerId)

  const getBookingsByVenue = (venueId: string) => bookings.filter((b) => b.venueId === venueId)

  const checkVenueAvailability = (
    venueId: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
  ): boolean => {
    const venueBookings = getBookingsByVenue(venueId).filter((b) => b.status === "approved" || b.status === "pending")

    return !venueBookings.some((booking) => {
      const bookingStart = new Date(`${booking.startDate}T${booking.startTime}`)
      const bookingEnd = new Date(`${booking.endDate}T${booking.endTime}`)
      const requestStart = new Date(`${startDate}T${startTime}`)
      const requestEnd = new Date(`${endDate}T${endTime}`)

      return !(requestEnd <= bookingStart || requestStart >= bookingEnd)
    })
  }

  return (
    <DataContext.Provider
      value={{
        venues,
        equipment,
        bookings,
        notifications,
        users,
        maintenanceRequests,
        scheduledMaintenance,
        departments,
        auditLogs,
        addBooking,
        updateBooking,
        cancelBooking,
        addNotification,
        markNotificationAsRead,
        getVenueById,
        getBookingsByOrganizer,
        getBookingsByVenue,
        checkVenueAvailability,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
