"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginError: string | null
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<User>) => void
  isAuthenticated: boolean
  loginWithGoogle: (credential: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Centralized API base URL configuration
const getApiBase = () => {
  if (typeof window === 'undefined') return ""
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const apiBase = getApiBase()

  // Initialize auth state by checking with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Check current user without CSRF preflight (GET request is safe)
          console.log('[Auth] Checking current user at:', `${apiBase}/api/auth/user`)

          // Add small delay to ensure cookies are properly set after page load
          await new Promise(resolve => setTimeout(resolve, 100))

          const response = await fetch(`${apiBase}/api/auth/user`, {
            credentials: 'include',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            },
          }).catch(err => {
            console.warn('[Auth] Network error checking user (backend might not be running):', err.message)
            return null
          })

          if (response && response.ok) {
            try {
              const data = await response.json()
              console.log('[Auth] User authenticated:', data)
              setUser(data)
            } catch (parseErr) {
              console.warn('[Auth] Failed to parse user response:', parseErr)
              console.warn('[Auth] Response text:', await response.text())
              setUser(null)
            }
          } else if (response) {
            console.log('[Auth] Not authenticated (status:', response.status, ')')
            try {
              const errorData = await response.json()
              console.log('[Auth] Error details:', errorData)
            } catch {
              const text = await response.text()
              console.log('[Auth] Response was not JSON:', text.substring(0, 200))
            }
            setUser(null)
          } else {
            console.warn('[Auth] No response from user check endpoint')
            setUser(null)
          }
        }
      } catch (error) {
        console.log('[Auth] Could not check auth status:', error)
        setUser(null)
      } finally {
        // Set loading to false ONLY after user state is determined
        // This prevents race conditions where pages redirect before auth check completes
        setIsLoading(false)
      }
    }

    initAuth()
  }, [apiBase])

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true)
    setLoginError(null)
    try {
      console.log('[Auth] Logging in with email:', email)
      console.log('[Auth] API Base:', apiBase)

      // Attempt login directly (CSRF disabled for local testing)
      const loginUrl = `${apiBase}/api/auth/login`
      console.log('[Auth] Posting login to:', loginUrl)

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ email, password }),
      }).catch(fetchError => {
        console.error('[Auth] Network error - Cannot reach API server:', fetchError)
        throw new Error(`Cannot connect to server at ${apiBase}. Please ensure the backend is running.`)
      })

      console.log('[Auth] Login response status:', response.status)

      if (!response.ok) {
        const raw = await response.text().catch(() => '')
        let parsed: any = {}
        try {
          parsed = raw ? JSON.parse(raw) : {}
        } catch {
          parsed = { message: raw }
        }
        const message = parsed?.message || parsed?.error || response.statusText || 'Login failed'
        console.error('[Auth] Login failed:', parsed)
        setLoginError(String(message))
        throw new Error(String(message))
      }

      const loginData = await response.json()
      console.log('[Auth] Login successful:', loginData)

      // Set user from login response and return it for immediate use
      if (loginData.user) {
        console.log('[Auth] User data received:', loginData.user)
        setUser(loginData.user)
        setLoginError(null)

        // Add small delay to ensure session cookie is properly set
        await new Promise(resolve => setTimeout(resolve, 100))

        return loginData.user as User
      }

      // Fallback: Fetch authenticated user
      const userResponse = await fetch(`${apiBase}/api/auth/user`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('[Auth] User data fetched:', userData)
        setUser(userData)
        setLoginError(null)
        return userData as User
      }

      return null
    } catch (error: any) {
      console.error("[Auth] Login error:", error)
      setLoginError(error?.message || String(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true)
    try {
      // Send credential to backend
      const response = await fetch(`${apiBase}/api/auth/google`, {
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

      // Add small delay to ensure session cookie is properly set
      await new Promise(resolve => setTimeout(resolve, 100))

      // Fetch authenticated user
      const userResponse = await fetch(`${apiBase}/api/auth/user`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
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
      console.log('[Auth] Logging out...')

      // Clear user state immediately
      setUser(null)

      setLoginError(null)

      // Call backend logout
      const response = await fetch(`${apiBase}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        console.log('[Auth] Logout successful from backend')
      } else {
        console.warn('[Auth] Logout response status:', response.status)
      }
    } catch (error) {
      console.error("[Auth] Logout error:", error)
    } finally {
      // Ensure state is cleared
      setUser(null)

      setLoginError(null)

      console.log('[Auth] Local auth state cleared, redirecting to home')

      // Force redirect to landing page
      if (typeof window !== 'undefined') {
        // Clear any cached data
        sessionStorage.clear()

        // Use replace to prevent back button issues
        window.location.replace('/')
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
        loginError,
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
