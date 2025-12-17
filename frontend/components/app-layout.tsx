"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from 'next/navigation'
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useState, useEffect } from 'react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pages that should not show sidebar/header (login, home page)
  const isAuthPage = pathname === "/" || pathname === "/login"

  // During hydration or auth loading
  if (!mounted || isLoading) {
    // Show nothing for auth pages to avoid flash
    if (isAuthPage) {
      return <>{children}</>
    }

    // For protected pages, show loading state with proper layout structure
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B1538] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show content without layout if on auth page
  if (isAuthPage) {
    return <>{children}</>
  }

  // Show full layout with sidebar and header only when authenticated
  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </>
    )
  }

  // Not authenticated and not on auth page - don't render layout
  return <>{children}</>
}
