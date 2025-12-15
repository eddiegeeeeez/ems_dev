"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Save, Eye, Send } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { OTPVerificationModal } from "@/components/otp-verification-modal"

interface EmailTemplate {
  subject: string
  preheader: string
  body: string
  footer: string
}

export default function EmailTemplatesPage() {
  const { toast } = useToast()
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
  const [selectedTemplate, setSelectedTemplate] = useState("booking_approved")
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [subject, setSubject] = useState("")
  const [preheader, setPreheader] = useState("")
  const [body, setBody] = useState("")
  const [footer, setFooter] = useState("")

  // Fetch email templates from backend
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiBase}/admin/settings/email-templates`)
      if (!response.ok) throw new Error('Failed to fetch templates')
      
      const data = await response.json()
      setTemplates(data.templates)
      
      // Load first template
      if (data.templates.booking_approved) {
        loadTemplate("booking_approved", data.templates.booking_approved)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadTemplate = (templateName: string, template: EmailTemplate) => {
    setSelectedTemplate(templateName)
    setSubject(template.subject || "")
    setPreheader(template.preheader || "")
    setBody(template.body || "")
    setFooter(template.footer || "")
  }

  const handleTemplateSelect = (templateName: string) => {
    if (templates[templateName]) {
      loadTemplate(templateName, templates[templateName])
    }
  }

  const handleRequestOtp = async () => {
    try {
      setIsRequestingOtp(true)
      const response = await fetch(`${apiBase}/admin/settings/email-templates/request-otp`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to send OTP')
      }

      toast({
        title: "OTP sent",
        description: "Enter the OTP sent to your email to save changes.",
      })
      setShowOTPModal(true)
    } catch (error) {
      console.error('Error requesting OTP:', error)
      toast({
        title: "Error",
        description: "Could not send OTP. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const saveTemplateWithOtp = async (otp: string) => {
    try {
      setIsSaving(true)
      const response = await fetch(`${apiBase}/admin/settings/email-templates`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          subject,
          preheader,
          body,
          footer,
          otp,
        }),
      })

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Invalid OTP')
        }
        throw new Error('Failed to save template')
      }

      toast({
        title: "Template saved",
        description: "Email template has been updated successfully.",
      })
      setShowOTPModal(false)
      await fetchTemplates()
    } catch (error: any) {
      console.error('Error saving template:', error)
      if (error.message === 'Invalid OTP' || error.message === 'Invalid or expired OTP') {
        throw error
      }
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = async () => {
    try {
      setIsPreviewing(true)
      const response = await fetch(`${apiBase}/admin/settings/email-templates/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          subject,
          preheader,
          body,
          footer,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate preview')

      const data = await response.json()
      console.log('Preview data:', data)
      toast({
        title: "Preview ready",
        description: "Template preview generated with sample data.",
      })
    } catch (error) {
      console.error('Error previewing template:', error)
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive"
      })
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      setIsSendingTest(true)
      const response = await fetch(`${apiBase}/admin/settings/email-templates/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          subject,
          preheader,
          body,
          footer,
        }),
      })

      if (!response.ok) throw new Error('Failed to send test email')

      toast({
        title: "Test email sent",
        description: "A test email has been sent to your admin email address.",
      })
    } catch (error) {
      console.error('Error sending test email:', error)
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Loading email templates...</div>
      </div>
    )
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
              variant={selectedTemplate === "booking_approved" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("booking_approved")}
            >
              Booking Approved
            </Button>
            <Button 
              variant={selectedTemplate === "booking_rejected" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("booking_rejected")}
            >
              Booking Rejected
            </Button>
            <Button 
              variant={selectedTemplate === "booking_pending" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("booking_pending")}
            >
              Booking Pending
            </Button>
            <Button 
              variant={selectedTemplate === "booking_cancelled" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("booking_cancelled")}
            >
              Booking Cancelled
            </Button>
            <Button 
              variant={selectedTemplate === "booking_reminder" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("booking_reminder")}
            >
              Event Reminder
            </Button>
            <Button 
              variant={selectedTemplate === "maintenance_alert" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleTemplateSelect("maintenance_alert")}
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preheader">Preheader Text</Label>
              <Input 
                id="preheader" 
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="Brief preview text shown in email clients"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea 
                id="body" 
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter email body content"
              />
              <p className="text-sm text-gray-600 mt-2">
                Available variables: {'{{organizerName}}'}, {'{{venueName}}'}, {'{{eventTitle}}'}, {'{{eventDate}}'}, {'{{eventTime}}'}, {'{{attendees}}'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer">Footer Text</Label>
              <Textarea 
                id="footer" 
                rows={3}
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="Enter footer text"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleRequestOtp} 
                className="bg-[#8B1538] hover:bg-[#6B1028]"
                disabled={isRequestingOtp}
              >
                <Save className="w-4 h-4 mr-2" />
                {isRequestingOtp ? "Sending OTP..." : "Save Template"}
              </Button>
              <Button onClick={handlePreview} variant="outline" disabled={isPreviewing}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewing ? "Generating..." : "Preview"}
              </Button>
              <Button onClick={handleTestEmail} variant="outline" disabled={isSendingTest}>
                <Send className="w-4 h-4 mr-2" />
                {isSendingTest ? "Sending..." : "Send Test Email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onVerify={saveTemplateWithOtp}
        onResend={handleRequestOtp}
        title="Verify Save"
        description="Enter the OTP sent to your email to save this template."
      />
    </div>
  )
}
