"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Spinner } from "@/components/ui/spinner"
import { LandingPage } from "@/components/landing-page"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('[Page] User authenticated, role:', user?.role)
      // Redirect based on user role
      const dashboardUrl = user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"
      console.log('[Page] Redirecting to:', dashboardUrl)
      router.push(dashboardUrl)
    }
  }, [isAuthenticated, isLoading, user?.role, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <Button
              variant="outline"
              onClick={() => setShowLogin(false)}
              className="mb-6 text-[#c41e3a] border-[#c41e3a] hover:bg-[#c41e3a] hover:text-white"
            >
              ← Back to Home
            </Button>
            <LoginForm />
          </div>
        </div>
      )
    }
    return <LandingPage onSignIn={() => setShowLogin(true)} />
  }

  // This should never render, but return null for consistency
  return null
}
