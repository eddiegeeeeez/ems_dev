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

// Centralized API base URL configuration
const getApiBase = () => {
  if (typeof window === 'undefined') return ""
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiBase = getApiBase()

  // Initialize auth state by checking with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Check current user without CSRF preflight (GET request is safe)
          console.log('[Auth] Checking current user at:', `${apiBase}/auth/user`)
          const response = await fetch(`${apiBase}/auth/user`, {
            credentials: 'include',
          })
          console.log('[Auth] User response status:', response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log('[Auth] User authenticated:', data)
            setUser(data)
          } else {
            console.log('[Auth] Not authenticated (this is normal for logged out users)')
          }
        }
      } catch (error) {
        console.log('[Auth] Could not check auth status (this is normal on first visit):', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [apiBase])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('[Auth] Logging in with email:', email)
      
      // Attempt login directly (CSRF disabled for local testing)
      const loginUrl = `${apiBase}/auth/login`
      console.log('[Auth] Posting login to:', loginUrl)
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      console.log('[Auth] Login response status:', response.status)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('[Auth] Login failed:', error)
        throw new Error(error.message || 'Login failed')
      }

      console.log('[Auth] Login successful, fetching user data')
      
      // Fetch authenticated user
      const userResponse = await fetch(`${apiBase}/auth/user`, {
        credentials: 'include',
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('[Auth] User data received:', userData)
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
      // Send credential to backend
      const response = await fetch(`${apiBase}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
