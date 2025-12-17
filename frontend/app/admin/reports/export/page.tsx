"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Loader2 } from 'lucide-react'
import { useData } from "@/lib/data-context"
import { useState } from "react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ExportDataPage() {
    const { venues, bookings } = useData()
    const [isGenerating, setIsGenerating] = useState(false)

    const handleExportSummary = async () => {
        setIsGenerating(true)
        try {
            const doc = new jsPDF()

            // Calculate Venue Stats
            const getVenueStats = (venueId: string) => {
                const venueBookings = bookings.filter((b) => b.venueId === venueId && b.status === "approved")
                const totalHours = venueBookings.reduce((sum, b) => {
                    const start = new Date(`${b.startDate}T${b.startTime}`)
                    const end = new Date(`${b.endDate}T${b.endTime}`)
                    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                }, 0)
                const utilization = Math.min((totalHours / (30 * 10)) * 100, 100)
                return { utilization }
            }

            const venueStats = venues.map((venue) => ({
                ...venue,
                stats: getVenueStats(venue.id),
            }))

            const totalUtilization = venues.length > 0
                ? venueStats.reduce((sum, v) => sum + v.stats.utilization, 0) / venues.length
                : 0

            // Calculate Booking Stats
            const totalBookings = bookings.length
            const approvedBookings = bookings.filter(b => b.status === "approved").length
            const pendingBookings = bookings.filter(b => b.status === "pending").length
            const completedBookings = bookings.filter(b => b.status === "completed").length
            const approvalRate = totalBookings > 0 ? ((approvedBookings / totalBookings) * 100).toFixed(1) : "0"

            // HEADERS
            doc.setFontSize(22)
            doc.setTextColor(139, 21, 56) // Theme color
            doc.text("System Management Report", 14, 22)

            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 30)

            // LINE SEPARATOR
            doc.setDrawColor(200)
            doc.line(14, 35, 196, 35)

            // SECTION 1: VENUE UTILIZATION
            doc.setFontSize(16)
            doc.setTextColor(0)
            doc.text("1. Venue Utilization Summary", 14, 45)

            const venueSummaryData = [
                ["Total Venues", venues.length.toString()],
                ["Overall System Utilization", `${totalUtilization.toFixed(1)}%`],
                ["Active Bookings", approvedBookings.toString()]
            ]

            autoTable(doc, {
                startY: 50,
                head: [['Metric', 'Value']],
                body: venueSummaryData,
                theme: 'striped',
                headStyles: { fillColor: [139, 21, 56] }
            })

            // SECTION 2: BOOKING STATISTICS
            doc.text("2. Booking Statistics Summary", 14, doc.lastAutoTable.finalY + 15)

            const bookingSummaryData = [
                ["Total Bookings (All Time)", totalBookings.toString()],
                ["Approval Rate", `${approvalRate}%`],
                ["Pending Requests", pendingBookings.toString()],
                ["Completed Events", completedBookings.toString()]
            ]

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Metric', 'Value']],
                body: bookingSummaryData,
                theme: 'striped',
                headStyles: { fillColor: [139, 21, 56] }
            })

            // SECTION 3: TOP VENUES
            doc.text("3. Top Performing Venues", 14, doc.lastAutoTable.finalY + 15)

            const venuePopularity = venues.map(venue => ({
                name: venue.name,
                bookings: bookings.filter(b => b.venueId === venue.id).length
            })).sort((a, b) => b.bookings - a.bookings).slice(0, 5)

            const topVenuesData = venuePopularity.map((v, i) => [
                (i + 1).toString(),
                v.name,
                v.bookings.toString()
            ])

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Rank', 'Venue Name', 'Total Bookings']],
                body: topVenuesData,
                theme: 'grid',
                headStyles: { fillColor: [139, 21, 56] }
            })

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
            }

            doc.save("ems_system_summary_report.pdf")
        } catch (error) {
            console.error("Export failed:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
                <p className="text-gray-600 mt-1">Generate and download system reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#8B1538]" />
                            System Summary Report
                        </CardTitle>
                        <CardDescription>
                            Comprehensive PDF report including Venue Utilization and Booking Statistics summaries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportSummary}
                            disabled={isGenerating}
                            className="w-full bg-[#8B1538] hover:bg-[#a01830] text-white"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF Summary
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
