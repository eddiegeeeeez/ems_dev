import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"

interface TwoFactorSetupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onEnable: (pin: string, password: string) => Promise<void>
}

type Step = "CREATE_PIN" | "VERIFY_PIN" | "ENTER_PASSWORD"

export function TwoFactorSetupModal({
    open,
    onOpenChange,
    onEnable,
}: TwoFactorSetupModalProps) {
    const [step, setStep] = useState<Step>("CREATE_PIN")
    const [pin, setPin] = useState("")
    const [verifyPin, setVerifyPin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleNext = async () => {
        setError("")

        if (step === "CREATE_PIN") {
            if (pin.length !== 6) {
                setError("Please enter a 6-digit PIN")
                return
            }
            setStep("VERIFY_PIN")
        } else if (step === "VERIFY_PIN") {
            if (verifyPin !== pin) {
                setError("PINs do not match. Please try again.")
                setVerifyPin("")
                setStep("CREATE_PIN") // Reset to start if mismatch
                setPin("")
                return
            }
            setStep("ENTER_PASSWORD")
        } else if (step === "ENTER_PASSWORD") {
            if (!password) {
                setError("Please enter your password")
                return
            }

            setIsSubmitting(true)
            try {
                await onEnable(pin, password)
                handleClose()
            } catch (err) {
                // Error is handled by parent or shown here if prop throws
                setError(err instanceof Error ? err.message : "Failed to enable 2FA")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleClose = () => {
        onOpenChange(false)
        // Reset state after transition
        setTimeout(() => {
            setStep("CREATE_PIN")
            setPin("")
            setVerifyPin("")
            setPassword("")
            setError("")
        }, 300)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        {step === "CREATE_PIN" && "Create a 6-digit PIN to secure your account."}
                        {step === "VERIFY_PIN" && "Please re-enter your PIN to verify."}
                        {step === "ENTER_PASSWORD" && "Enter your account password to confirm."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {step === "CREATE_PIN" && (
                        <div className="space-y-2">
                            <Label className="text-center block">Enter 6-digit PIN</Label>
                            <InputOTP
                                maxLength={6}
                                value={pin}
                                onChange={(value) => {
                                    setPin(value)
                                    setError("")
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    )}

                    {step === "VERIFY_PIN" && (
                        <div className="space-y-2">
                            <Label className="text-center block">Confirm 6-digit PIN</Label>
                            <InputOTP
                                maxLength={6}
                                value={verifyPin}
                                onChange={(value) => {
                                    setVerifyPin(value)
                                    setError("")
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    )}

                    {step === "ENTER_PASSWORD" && (
                        <div className="w-full space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError("")
                                }}
                                placeholder="Enter your password"
                            />
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="bg-[#8B1538] hover:bg-[#6B0D28]"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {step === "ENTER_PASSWORD" ? "Enable 2FA" : "Next"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
