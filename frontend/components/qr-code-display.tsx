"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Copy, Check } from "lucide-react"

interface QrCodeDisplayProps {
  bookingId: string
  qrCodeData?: string
  qrCodeSvg?: string
  eventTitle: string
}

export function QrCodeDisplay({
  bookingId,
  qrCodeData,
  qrCodeSvg,
  eventTitle,
}: QrCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrUrl, setQrUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [qrGeneratedData, setQrGeneratedData] = useState(qrCodeData || "")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Dynamically import QRCode only on client side
    import("qrcode").then((QRCode) => {
      // Use backend QR code data if available, otherwise generate locally
      const dataToUse = qrCodeData || `UM-EVENT-${String(bookingId).toUpperCase()}`
      setQrGeneratedData(dataToUse)

      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, dataToUse, {
          width: 250,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
          .then(() => {
            setQrUrl(canvasRef.current?.toDataURL("image/png") || "")
          })
          .catch((err) => {
            console.error("Error generating QR code to canvas:", err)
          })
      } else {
        QRCode.toDataURL(dataToUse, {
          width: 250,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
          .then((url) => {
            setQrUrl(url)
          })
          .catch((err) => {
            console.error("Error generating QR code data URL:", err)
          })
      }
    })
  }, [bookingId, qrCodeData, mounted])

  const handleDownload = () => {
    if (!qrUrl) return

    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `booking-${bookingId}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(qrGeneratedData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Venue Access Pass</Label>
        <p className="text-xs text-gray-500">
          Present this QR code to the venue custodian to verify details and gain access.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        {qrUrl && (
          <img
            src={qrUrl}
            alt="Booking QR Code"
            className="border-2 border-gray-200 rounded-lg p-2"
            width={250}
            height={250}
          />
        )}

        <div className="space-y-2 w-full">
          <p className="text-xs text-center text-gray-600 font-mono break-all">
            {qrGeneratedData}
          </p>

          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
