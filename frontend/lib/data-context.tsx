"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Venue, Equipment, Booking, Notification, User, College, AuditLog } from "./types"
import { mockUsers } from "./mock-data"
import { useAuth } from "./auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface DataContextType {
  venues: Venue[]
  equipment: Equipment[]
  bookings: Booking[]
  notifications: Notification[]
  users: User[]
  colleges: College[]
  loading: boolean
  error: string | null
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
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
  addVenue: (venue: Venue) => void
  updateVenue: (id: string, updates: Partial<Venue>) => void
  refreshVenues: () => Promise<void>
  refreshBookings: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [venues, setVenues] = useState<Venue[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // CRITICAL: Only fetch data when authenticated
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if still checking auth or not authenticated
      if (authLoading || !isAuthenticated) {
        // Clear data on logout
        if (!authLoading && !isAuthenticated && hasInitialized) {
          console.log('[DataProvider] Clearing data on logout')
          setVenues([])
          setEquipment([])
          setBookings([])
          setNotifications([])
          setColleges([])
          setLoading(false)
          setError(null)
        }
        return
      }

      // Only initialize once and when authenticated
      if (hasInitialized) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch venues
        try {
          const venuesRes = await fetch(`${API_BASE_URL}/api/venues`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          if (venuesRes.ok) {
            const response = await venuesRes.json()
            // Handle both wrapped { success, data } and unwrapped [] formats
            const venuesData = Array.isArray(response) ? response : (response.data || response.venues || [])
            setVenues(venuesData)
            console.log('[DataProvider] Loaded venues:', venuesData.length)
          } else {
            console.warn('[DataProvider] Venues fetch failed:', venuesRes.status)
          }
        } catch (err) {
          console.warn("Failed to fetch venues:", err)
        }

        // Fetch equipment (for all authenticated users)
        try {
          // Use public endpoint accessible to organizers too
          const equipmentRes = await fetch(`${API_BASE_URL}/api/equipment`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          if (equipmentRes.ok) {
            const response = await equipmentRes.json()
            // Handle paginated response: { equipment: { data: [...] } } or flat { equipment: [...] }
            let equipmentData = []
            if (response.equipment?.data) {
              equipmentData = response.equipment.data
            } else if (Array.isArray(response.equipment)) {
              equipmentData = response.equipment
            } else if (Array.isArray(response.data)) {
              equipmentData = response.data
            } else if (Array.isArray(response)) {
              equipmentData = response
            }
            setEquipment(equipmentData)
            console.log('[DataProvider] Loaded equipment:', equipmentData.length)
          } else {
            console.warn('[DataProvider] Equipment fetch failed:', equipmentRes.status)
          }
        } catch (err) {
          console.warn("Failed to fetch equipment:", err)
        }

        // Fetch bookings
        try {
          const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          if (bookingsRes.ok) {
            const response = await bookingsRes.json()
            // Handle both wrapped { success, data } and unwrapped [] formats
            let bookingsData = []
            if (response.success && response.data) {
              bookingsData = Array.isArray(response.data) ? response.data : []
            } else if (Array.isArray(response)) {
              bookingsData = response
            }
            setBookings(bookingsData)
            console.log('[DataProvider] Loaded bookings:', bookingsData.length)
          } else {
            console.warn('[DataProvider] Bookings fetch failed:', bookingsRes.status)
          }
        } catch (err) {
          console.warn("Failed to fetch bookings:", err)
        }

        // Fetch notifications
        try {
          const notificationsRes = await fetch(`${API_BASE_URL}/api/notifications`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
          if (notificationsRes.ok) {
            const response = await notificationsRes.json()
            const notificationsData = Array.isArray(response) ? response : (response.data || response.notifications || [])
            setNotifications(notificationsData)
            console.log('[DataProvider] Loaded notifications:', notificationsData.length)
          } else {
            console.warn('[DataProvider] Notifications fetch failed:', notificationsRes.status)
          }
        } catch (err) {
          console.warn("Failed to fetch notifications:", err)
        }

        // Fetch colleges (admin endpoint, only if user is admin)
        if (user?.role === 'ADMIN') {
          try {
            const collegesRes = await fetch(`${API_BASE_URL}/api/admin/colleges`, {
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            })
            if (collegesRes.ok) {
              const response = await collegesRes.json()
              const collegesData = response.colleges || []
              setColleges(collegesData)
              console.log('[DataProvider] Loaded colleges:', collegesData.length)
            } else {
              console.warn('[DataProvider] Colleges fetch failed:', collegesRes.status)
            }
          } catch (err) {
            console.warn("Failed to fetch colleges:", err)
          }
        }



        setHasInitialized(true)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch data"
        setError(errorMsg)
        console.error("[DataProvider] Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, authLoading, hasInitialized, user?.role])

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
      relatedId: booking.id,
    })
  }

  const addVenue = (venue: Venue) => {
    setVenues((prev) => [...prev, venue])
  }

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))
  }

  const refreshVenues = async () => {
    try {
      const venuesRes = await fetch(`${API_BASE_URL}/api/venues`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (venuesRes.ok) {
        const response = await venuesRes.json()
        const venuesData = Array.isArray(response) ? response : (response.data || response.venues || [])
        setVenues(venuesData)
        console.log("[v0] Venues refreshed from server:", venuesData.length)
      }
    } catch (err) {
      console.warn("Failed to refresh venues:", err)
    }
  }

  const refreshBookings = async () => {
    try {
      const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (bookingsRes.ok) {
        const response = await bookingsRes.json()
        let bookingsData = []
        if (response.success && response.data) {
          bookingsData = Array.isArray(response.data) ? response.data : []
        } else if (Array.isArray(response)) {
          bookingsData = response
        }
        setBookings(bookingsData)
        console.log('[DataProvider] Bookings refreshed:', bookingsData.length)
      }
    } catch (err) {
      console.warn('Failed to refresh bookings:', err)
    }
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

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
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
        colleges,
        loading,
        error,
        addBooking,
        updateBooking,
        cancelBooking,
        addVenue,
        updateVenue,
        refreshVenues,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getVenueById,
        getBookingsByOrganizer,
        getBookingsByVenue,
        checkVenueAvailability,
        refreshBookings,
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
