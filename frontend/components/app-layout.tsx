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

  // Pages that should not show sidebar/header (login page)
  const isAuthPage = pathname === "/"

  // During hydration, render a basic structure to avoid mismatch
  if (!mounted) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
          <div className="w-64 bg-white border-r border-gray-200" />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </>
    )
  }

  // Show content without layout if on auth page or not authenticated
  if (isAuthPage || (!isAuthenticated && !isLoading)) {
    return <>{children}</>
  }

  // Show full layout with sidebar and header when authenticated
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
