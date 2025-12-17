"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OnboardingModalProps {
  isOpen: boolean
  userName: string
  onComplete: (college: string, department: string) => void
  onClose?: () => void
}

import { UM_COLLEGES } from "@/lib/um-data"


export function OnboardingModal({ isOpen, userName, onComplete, onClose }: OnboardingModalProps) {
  const [college, setCollege] = useState("")
  const [department, setDepartment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Onboarding completed:", { college, department })
    onComplete(college, department)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const availableDepartments = college
    ? UM_COLLEGES.find(c => c.name === college)?.programs || []
    : []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl text-[#c41e3a]">Welcome to UM Events Management!</DialogTitle>
          <DialogDescription className="text-gray-600">
            Hello, {userName}. Please complete your profile to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="college" className="text-sm font-medium text-gray-700">
              College <span className="text-red-500">*</span>
            </Label>
            <Select value={college} onValueChange={(value) => {
              console.log("[v0] College selected:", value)
              setCollege(value)
              setDepartment("") // Reset department when college changes
            }}>
              <SelectTrigger id="college" className="w-full">
                <SelectValue placeholder="Select your college" />
              </SelectTrigger>
              <SelectContent>
                {UM_COLLEGES.map((col) => (
                  <SelectItem key={col.code} value={col.name}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-gray-700">
              Department/Program <span className="text-red-500">*</span>
            </Label>
            <Select value={department} onValueChange={(value) => {
              console.log("[v0] Department selected:", value)
              setDepartment(value)
            }} disabled={!college}>
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder={college ? "Select your department" : "Select college first"} />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!college || !department}
              className="w-full bg-[#c41e3a] hover:bg-[#a01729] text-white"
            >
              Complete Setup
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
