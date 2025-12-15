"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Shield, RefreshCw } from "lucide-react"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface OTPVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (pin: string) => Promise<void>
  title?: string
  description?: string
  onResend?: () => Promise<void> | void
}

export function OTPVerificationModal({
  open,
  onOpenChange,
  onVerify,
  title = "Verify Your Identity",
  description = "Please enter the one-time password to authorize this action.",
  onResend,
}: OTPVerificationModalProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const maxAttempts = 3

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  // Debug logging
  useEffect(() => {
    console.log("OTP Modal open state:", open)
  }, [open])

  // Countdown timer
  useEffect(() => {
    if (!open) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCountdown(120)
      setCanResend(false)
      setAttempts(0)
      form.reset()
    }
  }, [open, form])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = async () => {
    try {
      setIsResending(true)
      if (onResend) {
        await onResend()
      }
      setCountdown(120)
      setCanResend(false)
      form.reset()
    } catch (error) {
      form.setError("pin", {
        message: "Failed to resend code. Please try again.",
      })
      setCanResend(true)
    } finally {
      setIsResending(false)
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (attempts >= maxAttempts) {
      form.setError("pin", {
        message: "Maximum attempts reached. Please try again later.",
      })
      return
    }

    setIsVerifying(true)
    try {
      await onVerify(data.pin)
      onOpenChange(false)
    } catch (error) {
      setAttempts((prev) => prev + 1)
      const remainingAttempts = maxAttempts - (attempts + 1)
      
      if (remainingAttempts > 0) {
        form.setError("pin", {
          message: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`,
        })
      } else {
        form.setError("pin", {
          message: "Maximum attempts reached. Please try again later.",
        })
      }
      form.reset()
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#8B1538]/10 rounded-full">
              <Shield className="w-5 h-5 text-[#8B1538]" />
            </div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">One-Time Password</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP 
                        maxLength={6} 
                        {...field}
                        disabled={isVerifying || attempts >= maxAttempts}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormDescription className="text-center">
                    Enter the 6-digit code sent to your email
                  </FormDescription>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              {/* Timer and Resend */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {countdown > 0 ? (
                    <>Time remaining: <span className="font-semibold text-[#8B1538]">{formatTime(countdown)}</span></>
                  ) : (
                    <span className="text-red-600">Code expired</span>
                  )}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={!canResend || attempts >= maxAttempts || isResending}
                  className="text-[#8B1538] hover:text-[#6B0D28] hover:bg-[#8B1538]/10"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>

              {/* Attempts remaining */}
              {attempts > 0 && attempts < maxAttempts && (
                <p className="text-xs text-center text-amber-600">
                  {maxAttempts - attempts} verification attempt{maxAttempts - attempts > 1 ? 's' : ''} remaining
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isVerifying}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying || attempts >= maxAttempts || form.watch("pin").length !== 6}
                  className="flex-1 bg-[#8B1538] hover:bg-[#6B0D28]"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
