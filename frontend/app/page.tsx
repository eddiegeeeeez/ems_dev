"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) {
      return
    }

    // If authenticated, redirect to dashboard
    if (isAuthenticated && user) {
      console.log('[Home] User authenticated, redirecting to dashboard')
      setIsRedirecting(true)
      const dashboardUrl = user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"
      const timer = setTimeout(() => {
        router.push(dashboardUrl)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If redirecting, show loading state
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // Show landing page only when NOT authenticated AND loading is complete
  if (!isAuthenticated && !isLoading) {
    return <LandingPage onSignIn={() => router.push('/login')} />
  }

  // Fallback (should not reach here)
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
