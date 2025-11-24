"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from 'next/navigation'
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  // Pages that should not show sidebar/header (login page)
  const isAuthPage = pathname === "/"

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
