"use client"

import ProfileHeader from "./components/profile-header"
import ProfileContent from "./components/profile-content"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute requiredRole="any">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <ProfileHeader />
        <ProfileContent />
      </div>
    </ProtectedRoute>
  )
}
