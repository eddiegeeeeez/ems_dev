"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "organizer" | "any"
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole = "any",
  redirectTo = "/"
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) {
      return
    }

    // Not authenticated - redirect to home
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // Normalize role comparison to avoid case-sensitivity issues
    const normalizedRequired = String(requiredRole ?? "any").toUpperCase()
    const userRole = String(user?.role ?? "").toUpperCase()

    // Check role requirements (skip if required is ANY)
    if (normalizedRequired !== "ANY") {
      if (userRole !== normalizedRequired) {
        // Wrong role - redirect based on their actual role
        const target = userRole === "ADMIN" ? "/admin/dashboard" : "/dashboard"
        // avoid pushing same pathname to prevent redirect loops
        if (typeof window !== 'undefined' && window.location.pathname !== target) {
          router.push(target)
        }
        return
      }
    }

    // All checks passed
    setShouldRender(true)
  }, [isAuthenticated, isLoading, user, router, requiredRole, redirectTo])

  // Show loading spinner while checking auth
  if (isLoading || !shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
