"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Venue, Equipment, Booking, Notification, User, MaintenanceRequest, ScheduledMaintenance, Department, AuditLog } from "./types"
import { mockUsers } from "./mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
  loading: boolean
  error: string | null
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
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from backend API
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch venues
        try {
          const venuesRes = await fetch(`${API_BASE_URL}/api/venues`)
          if (venuesRes.ok) {
            const venuesData = await venuesRes.json()
            setVenues(venuesData)
          }
        } catch (err) {
          console.warn("Failed to fetch venues:", err)
        }

        // Fetch equipment
        try {
          const equipmentRes = await fetch(`${API_BASE_URL}/api/equipment`)
          if (equipmentRes.ok) {
            const equipmentData = await equipmentRes.json()
            setEquipment(equipmentData)
          }
        } catch (err) {
          console.warn("Failed to fetch equipment:", err)
        }

        // Fetch bookings
        try {
          const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings`)
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json()
            setBookings(bookingsData)
          }
        } catch (err) {
          console.warn("Failed to fetch bookings:", err)
        }

        // Fetch notifications
        try {
          const notificationsRes = await fetch(`${API_BASE_URL}/api/notifications`)
          if (notificationsRes.ok) {
            const notificationsData = await notificationsRes.json()
            setNotifications(notificationsData)
          }
        } catch (err) {
          console.warn("Failed to fetch notifications:", err)
        }

        // Fetch departments
        try {
          const departmentsRes = await fetch(`${API_BASE_URL}/api/departments`)
          if (departmentsRes.ok) {
            const departmentsData = await departmentsRes.json()
            setDepartments(departmentsData)
          }
        } catch (err) {
          console.warn("Failed to fetch departments:", err)
        }

        // Fetch maintenance requests
        try {
          const maintenanceRes = await fetch(`${API_BASE_URL}/api/maintenance-requests`)
          if (maintenanceRes.ok) {
            const maintenanceData = await maintenanceRes.json()
            setMaintenanceRequests(maintenanceData)
          }
        } catch (err) {
          console.warn("Failed to fetch maintenance requests:", err)
        }

        // Fetch audit logs
        try {
          const auditRes = await fetch(`${API_BASE_URL}/api/audit-logs`)
          if (auditRes.ok) {
            const auditData = await auditRes.json()
            setAuditLogs(auditData)
          }
        } catch (err) {
          console.warn("Failed to fetch audit logs:", err)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch data"
        setError(errorMsg)
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        loading,
        error,
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
