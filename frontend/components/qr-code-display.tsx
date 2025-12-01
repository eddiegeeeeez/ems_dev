"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

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
  const [qrUrl, setQrUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [qrGeneratedData, setQrGeneratedData] = useState(qrCodeData || "")

  useEffect(() => {
    // Use backend QR code data if available, otherwise generate locally
    const dataToUse = qrCodeData || `UM-EVENT-${bookingId.toUpperCase()}`
    setQrGeneratedData(dataToUse)

    // Generate QR code as data URL
    QRCode.toDataURL(dataToUse, {
      width: 300,
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
        console.error("Error generating QR code:", err)
      })
  }, [bookingId, qrCodeData])

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
        <Label className="text-sm font-medium text-gray-700">Booking QR Code</Label>
        <p className="text-xs text-gray-500">
          Use this QR code to quickly identify and reference this booking
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
