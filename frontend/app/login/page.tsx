"use client"

import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) {
      return
    }

    // If already authenticated, redirect immediately
    if (isAuthenticated && user) {
      console.log('[LoginPage] User already authenticated, redirecting to dashboard')
      setIsRedirecting(true)
      const dashboardUrl = user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"
      // Use setTimeout to ensure state update completes before redirect
      const timer = setTimeout(() => {
        router.push(dashboardUrl)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If redirecting, show loading screen
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is not authenticated, show login form
  return (
    <div className="relative">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost">← Back home</Button>
        </Link>
      </div>
      <LoginForm />
    </div>
  )
}
