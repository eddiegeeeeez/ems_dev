import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { OnboardingWrapper } from "@/components/onboarding-wrapper"
import { AppLayout } from "@/components/app-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "UM Events Management System",
  description: "University of Mindanao Events Management System",
  generator: "v0.app",
  icons: {
    icon: "/um-logo.png",
    apple: "/um-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            <OnboardingWrapper>
              <AppLayout>{children}</AppLayout>
            </OnboardingWrapper>
          </DataProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
