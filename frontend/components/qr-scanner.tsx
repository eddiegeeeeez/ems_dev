"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X, AlertCircle } from "lucide-react"
import jsQR from "jsqr"

interface QrScannerProps {
  open: boolean
  onClose: () => void
  onScanResult: (qrData: string) => void
}

export function QrScanner({ open, onClose, onScanResult }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [scannerActive, setScannerActive] = useState(false)

  useEffect(() => {
    if (!open || !scannerActive) {
      stopScanning()
      return
    }

    startScanning()

    return () => {
      stopScanning()
    }
  }, [open, scannerActive])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning loop
        scanQrCode()
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to access camera. Please check permissions."
      )
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const scanQrCode = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scanFrame = () => {
      // Check if video has valid dimensions before processing
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        if (scannerActive) {
          requestAnimationFrame(scanFrame)
        }
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
      const code = jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        {
          inversionAttempts: "dontInvert",
        }
      )

      if (code) {
        handleScanSuccess(code.data)
        return
      }

      if (scannerActive) {
        requestAnimationFrame(scanFrame)
      }
    }

    scanFrame()
  }

  const handleScanSuccess = (qrData: string) => {
    stopScanning()
    onScanResult(qrData)
    onClose()
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScanSuccess(manualInput.trim())
      setManualInput("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Booking QR Code</DialogTitle>
          <DialogDescription>
            Point your camera at a booking QR code or enter the code manually
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!scannerActive && !error && (
            <Button
              onClick={() => setScannerActive(true)}
              className="w-full"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing camera...
                </>
              ) : (
                "Start Scanning"
              )}
            </Button>
          )}

          {scannerActive && (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden h-80 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  playsInline
                  muted
                  autoPlay
                />
                <canvas ref={canvasRef} className="hidden" />

                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-white rounded-lg opacity-50" />
                  </div>
                )}
              </div>

              <Button
                onClick={() => setScannerActive(false)}
                variant="outline"
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Stop Scanning
              </Button>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter code manually:</label>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                placeholder="UM-EVENT-..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
