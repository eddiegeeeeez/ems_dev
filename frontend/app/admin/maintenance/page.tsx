"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function MaintenancePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to maintenance requests by default
    router.push("/admin/maintenance/requests")
  }, [router])

  return null
}
