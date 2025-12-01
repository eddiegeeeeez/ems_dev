"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUserProfile: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user from localStorage synchronously to prevent flash
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const storedUser = localStorage.getItem("currentUser")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error("Failed to parse stored user:", error)
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth - find user by email
      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))
        return foundUser
      } else {
        throw new Error("User not found")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    // Redirect to home/login page
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const updateUserProfile = (updates: Partial<User>) => {
    console.log("[v0] Updating user profile:", updates)
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
