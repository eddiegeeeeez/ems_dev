"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [authCheckComplete, setAuthCheckComplete] = useState(false)

  useEffect(() => {
    // Mark auth check as complete once loading is done
    if (!isLoading) {
      setAuthCheckComplete(true)
    }
  }, [isLoading])

  useEffect(() => {
    // Don't proceed until auth check is complete
    if (!authCheckComplete) {
      return
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      console.warn(`[ProtectedRoute] Unauthorized access attempt to ${pathname} - redirecting to ${redirectTo}`)
      setIsRedirecting(true)
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
        console.warn(`[ProtectedRoute] Invalid role ${userRole} for ${pathname} - required ${normalizedRequired}`)
        const target = userRole === "ADMIN" ? "/admin/dashboard" : "/dashboard"
        // avoid pushing same pathname to prevent redirect loops
        if (typeof window !== 'undefined' && window.location.pathname !== target) {
          setIsRedirecting(true)
          router.push(target)
          return
        }
      }
    }

    // All security checks passed - safe to render
    console.log(`[ProtectedRoute] Access granted to ${pathname} for role ${userRole}`)
    setShouldRender(true)
  }, [authCheckComplete, isAuthenticated, user, router, requiredRole, redirectTo, pathname])

  // Blocking state - shows while auth is loading or redirecting
  if (isLoading || !authCheckComplete || isRedirecting || !shouldRender) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 border rounded-lg bg-white">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="border rounded-lg bg-white p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // All checks passed - render protected content
  return <>{children}</>
}
