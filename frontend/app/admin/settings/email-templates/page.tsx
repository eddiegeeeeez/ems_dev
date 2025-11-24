"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Save, Eye, Send } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function EmailTemplatesPage() {
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState("booking-approved")

  const handleSave = () => {
    toast({
      title: "Template saved",
      description: "Email template has been updated successfully.",
    })
  }

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Email preview will be shown in a new window.",
    })
  }

  const handleTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your admin email address.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Customize email notifications sent to users</p>
        </div>
        <Mail className="w-8 h-8 text-[#8B1538]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Select a template to edit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant={selectedTemplate === "booking-approved" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("booking-approved")}
            >
              Booking Approved
            </Button>
            <Button 
              variant={selectedTemplate === "booking-rejected" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("booking-rejected")}
            >
              Booking Rejected
            </Button>
            <Button 
              variant={selectedTemplate === "booking-pending" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("booking-pending")}
            >
              Booking Pending
            </Button>
            <Button 
              variant={selectedTemplate === "booking-cancelled" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("booking-cancelled")}
            >
              Booking Cancelled
            </Button>
            <Button 
              variant={selectedTemplate === "booking-reminder" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("booking-reminder")}
            >
              Event Reminder
            </Button>
            <Button 
              variant={selectedTemplate === "maintenance-alert" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedTemplate("maintenance-alert")}
            >
              Maintenance Alert
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Template</CardTitle>
            <CardDescription>Customize the email content and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input 
                id="subject" 
                defaultValue="Your Booking Request Has Been Approved"
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preheader">Preheader Text</Label>
              <Input 
                id="preheader" 
                defaultValue="Your event venue booking at UM has been confirmed"
                placeholder="Brief preview text shown in email clients"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea 
                id="body" 
                rows={12}
                defaultValue={`Dear {{organizerName}},

We are pleased to inform you that your booking request for {{venueName}} has been approved!

Event Details:
- Event: {{eventTitle}}
- Date: {{eventDate}}
- Time: {{eventTime}}
- Venue: {{venueName}}
- Expected Attendees: {{attendees}}

Please review your booking details in the Events Management System. If you need to make any changes, please contact us at least 24 hours before your event.

Important reminders:
1. Arrive at least 30 minutes before your event starts
2. Ensure all equipment is returned in good condition
3. Leave the venue clean and organized

If you have any questions, please don't hesitate to contact us.

Best regards,
University of Mindanao
Events Management Team`}
              />
              <p className="text-sm text-gray-600 mt-2">
                Available variables: {'{{organizerName}}, {{venueName}}, {{eventTitle}}, {{eventDate}}, {{eventTime}}, {{attendees}}'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer">Footer Text</Label>
              <Textarea 
                id="footer" 
                rows={3}
                defaultValue="This is an automated message from the UM Events Management System. Please do not reply to this email."
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-[#8B1538] hover:bg-[#6B1028]">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button onClick={handlePreview} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleTestEmail} variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
