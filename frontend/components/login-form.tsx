"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Login attempt with email:", email)

    try {
      await login(email, "")
      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (err) {
      console.log("[v0] Login failed:", err)
      setError("Invalid email. Please use a valid UM account.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string) => {
    console.log("[v0] Demo login initiated with:", demoEmail)
    setEmail(demoEmail)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4caf50] text-white text-2xl font-bold">
              UM
            </div>
          </div>
          <CardTitle className="text-2xl text-[#c41e3a]">UM Events Management</CardTitle>
          <CardDescription>Sign in with your University of Mindanao account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="your.name@umindanao.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">Use your official UM email account</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-[#c41e3a] hover:bg-[#a01830] text-white">
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <p className="mb-2">
                  <strong>Organizer (Existing):</strong> edgar.garan@umindanao.edu.ph
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs bg-transparent"
                onClick={() => handleDemoLogin("edgar.garan@umindanao.edu.ph")}
              >
                Login as Organizer
              </Button>

              <div className="text-xs text-gray-600">
                <p className="mb-2">
                  <strong>New User (Needs Onboarding):</strong> newuser@umindanao.edu.ph
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs bg-transparent"
                onClick={() => handleDemoLogin("newuser@umindanao.edu.ph")}
              >
                Login as New User
              </Button>

              <div className="text-xs text-gray-600">
                <p className="mb-2">
                  <strong>Admin:</strong> admin@umindanao.edu.ph
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs bg-transparent"
                onClick={() => handleDemoLogin("admin@umindanao.edu.ph")}
              >
                Login as Admin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
