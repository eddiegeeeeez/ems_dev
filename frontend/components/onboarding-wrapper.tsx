"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { OnboardingModal } from "./onboarding-modal"

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user, updateUserProfile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Show onboarding modal for organizers who haven't completed onboarding
    if (user && user.role === "organizer" && !user.isOnboarded) {
      console.log("[v0] User needs onboarding:", user.id)
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }, [user])

  const handleOnboardingComplete = (college: string, department: string) => {
    console.log("[v0] Onboarding completed with:", { college, department })
    updateUserProfile({
      college,
      department,
      isOnboarded: true,
      position: "Event Organizer", // Default position for new organizers
    })
    setShowOnboarding(false)
  }

  return (
    <>
      {user && showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          userName={user.name}
          onComplete={handleOnboardingComplete}
        />
      )}
      {children}
    </>
  )
}
