"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OnboardingModalProps {
  isOpen: boolean
  userName: string
  onComplete: (college: string, department: string) => void
}

const UM_COLLEGES = [
  "College of Arts and Sciences",
  "College of Business Administration",
  "College of Computer Studies",
  "College of Education",
  "College of Engineering and Architecture",
  "College of Health and Allied Medical Sciences",
  "College of Law",
  "College of Nursing",
]

const DEPARTMENTS_BY_COLLEGE: Record<string, string[]> = {
  "College of Arts and Sciences": [
    "Bachelor of Arts in Communication",
    "Bachelor of Arts in English",
    "Bachelor of Science in Biology",
    "Bachelor of Science in Psychology",
  ],
  "College of Business Administration": [
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Management Accounting",
  ],
  "College of Computer Studies": [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Information Systems",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education",
    "Bachelor of Physical Education",
  ],
  "College of Engineering and Architecture": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Mechanical Engineering",
    "Bachelor of Science in Architecture",
  ],
  "College of Health and Allied Medical Sciences": [
    "Bachelor of Science in Medical Technology",
    "Bachelor of Science in Pharmacy",
    "Bachelor of Science in Radiologic Technology",
  ],
  "College of Law": ["Bachelor of Laws (LLB)", "Juris Doctor (JD)"],
  "College of Nursing": ["Bachelor of Science in Nursing"],
}

export function OnboardingModal({ isOpen, userName, onComplete }: OnboardingModalProps) {
  const [college, setCollege] = useState("")
  const [department, setDepartment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Onboarding completed:", { college, department })
    onComplete(college, department)
  }

  const availableDepartments = college ? DEPARTMENTS_BY_COLLEGE[college] || [] : []

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
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
                  <SelectItem key={col} value={col}>
                    {col}
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

          <Button
            type="submit"
            disabled={!college || !department}
            className="w-full bg-[#c41e3a] hover:bg-[#a01729] text-white"
          >
            Complete Setup
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
