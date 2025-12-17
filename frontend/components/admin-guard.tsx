"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login">
      {children}
    </ProtectedRoute>
  )
}
