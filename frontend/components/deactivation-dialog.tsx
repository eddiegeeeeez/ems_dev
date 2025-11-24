"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface DeactivationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venueName: string
  onConfirm: (reason: string, description: string) => void
  isLoading?: boolean
}

export function DeactivationDialog({
  open,
  onOpenChange,
  venueName,
  onConfirm,
  isLoading = false,
}: DeactivationDialogProps) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")

  const handleConfirm = () => {
    if (!reason) {
      console.log("[v0] Deactivation reason not selected")
      return
    }
    console.log("[v0] Deactivating venue:", venueName, "Reason:", reason, "Description:", description)
    onConfirm(reason, description)
    setReason("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Deactivate Venue
          </DialogTitle>
          <DialogDescription>
            You are about to deactivate <strong>{venueName}</strong>. This action will prevent new bookings for this
            venue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Reason for Deactivation *</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Venue Maintenance</SelectItem>
                <SelectItem value="technical">Technical Maintenance</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="temporary">Temporary Closure</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Additional Details</label>
            <Textarea
              value={description}
              onChange={(e) => {
                console.log("[v0] Deactivation description updated")
                setDescription(e.target.value)
              }}
              placeholder="Provide more information about the deactivation..."
              className="mt-1 min-h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason || isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deactivating..." : "Confirm Deactivation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
