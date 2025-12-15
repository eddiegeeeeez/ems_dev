"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<User>) => void
  isAuthenticated: boolean
  loginWithGoogle: (credential: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiBase = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api")
    : ""

  // Initialize auth state by checking with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First, preflight CSRF cookie
        if (typeof window !== 'undefined') {
          await fetch((process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace('/api', '/sanctum/csrf-cookie'), {
            credentials: 'include',
          }).catch(() => {}) // Ignore errors, just ensure cookie is set

          // Then check current user
          const response = await fetch(`${apiBase}/auth/user`, {
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            setUser(data)
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [apiBase])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Preflight CSRF cookie
      await fetch((process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace('/api', '/sanctum/csrf-cookie'), {
        credentials: 'include',
      }).catch(() => {})

      // Attempt login
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Login failed')
      }

      // Fetch authenticated user
      const userResponse = await fetch(`${apiBase}/auth/user`, {
        credentials: 'include',
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true)
    try {
      // Preflight CSRF cookie
      await fetch((process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace('/api', '/sanctum/csrf-cookie'), {
        credentials: 'include',
      }).catch(() => {})

      // Send credential to backend
      const response = await fetch(`${apiBase}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      })

      if (!response.ok) {
        throw new Error('Google login failed')
      }

      // Fetch authenticated user
      const userResponse = await fetch(`${apiBase}/auth/user`, {
        credentials: 'include',
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
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
        loginWithGoogle,
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
