"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function BookingRulesPage() {
  const { toast } = useToast()
  const [requireApproval, setRequireApproval] = useState(true)
  const [allowCancellation, setAllowCancellation] = useState(true)
  const [requireDocuments, setRequireDocuments] = useState(true)

  const handleSave = () => {
    toast({
      title: "Booking rules updated",
      description: "All booking rules have been saved successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Rules</h1>
          <p className="text-gray-600 mt-1">Configure rules and policies for venue bookings</p>
        </div>
        <FileText className="w-8 h-8 text-[#8B1538]" />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Settings</CardTitle>
            <CardDescription>Configure booking approval workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require Admin Approval</Label>
                <p className="text-sm text-gray-600">All bookings must be reviewed and approved by administrators</p>
              </div>
              <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="approvalDeadline">Approval Deadline (hours)</Label>
              <Input id="approvalDeadline" type="number" defaultValue="48" />
              <p className="text-sm text-gray-600">Time limit for admin to approve/reject requests</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoReject">Auto-Reject After (hours)</Label>
              <Input id="autoReject" type="number" defaultValue="72" />
              <p className="text-sm text-gray-600">Automatically reject if not processed within this timeframe</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Time Restrictions</CardTitle>
            <CardDescription>Set allowed time slots and restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Operating Hours Start</Label>
                <Input id="startTime" type="time" defaultValue="07:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Operating Hours End</Label>
                <Input id="endTime" type="time" defaultValue="22:00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxDuration">Maximum Booking Duration (hours)</Label>
                <Input id="maxDuration" type="number" defaultValue="8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAdvance">Minimum Advance Notice (hours)</Label>
                <Input id="minAdvance" type="number" defaultValue="24" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Restricted Days</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Monday</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Tuesday</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Wednesday</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Thursday</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Friday</Badge>
                <Badge className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200">Saturday</Badge>
                <Badge className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200">Sunday</Badge>
              </div>
              <p className="text-sm text-gray-600">Click days to mark as restricted (red = restricted)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Policy</CardTitle>
            <CardDescription>Configure booking cancellation rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow Organizer Cancellation</Label>
                <p className="text-sm text-gray-600">Permit organizers to cancel their own bookings</p>
              </div>
              <Switch checked={allowCancellation} onCheckedChange={setAllowCancellation} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="cancelDeadline">Cancellation Deadline (hours before event)</Label>
              <Input id="cancelDeadline" type="number" defaultValue="24" />
              <p className="text-sm text-gray-600">Minimum hours before event starts to allow cancellation</p>
            </div>

            <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900">Late Cancellation Policy</p>
                <p className="text-sm text-amber-700">Cancellations within the deadline period may result in restrictions on future bookings.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Requirements</CardTitle>
            <CardDescription>Configure required documents for bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require Document Submission</Label>
                <p className="text-sm text-gray-600">Organizers must upload supporting documents with their booking request</p>
              </div>
              <Switch checked={requireDocuments} onCheckedChange={setRequireDocuments} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
              <Input id="maxFileSize" type="number" defaultValue="10" />
            </div>

            <div className="space-y-2">
              <Label>Accepted File Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">DOCX</Badge>
                <Badge variant="secondary">DOC</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">PNG</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Rules</CardTitle>
            <CardDescription>Configure equipment request policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="equipmentDeadline">Equipment Request Deadline (days before)</Label>
              <Input id="equipmentDeadline" type="number" defaultValue="3" />
              <p className="text-sm text-gray-600">Days in advance equipment must be requested</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEquipment">Maximum Equipment Items Per Booking</Label>
              <Input id="maxEquipment" type="number" defaultValue="10" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[#8B1538] hover:bg-[#6B1028]">
            <Save className="w-4 h-4 mr-2" />
            Save Booking Rules
          </Button>
        </div>
      </div>
    </div>
  )
}
