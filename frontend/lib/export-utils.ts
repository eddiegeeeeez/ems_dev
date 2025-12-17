import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Booking, Venue } from '@/lib/types'

export const generateSystemReport = (bookings: Booking[], venues: Venue[]) => {
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
        // @ts-ignore
        doc.text("2. Booking Statistics Summary", 14, doc.lastAutoTable.finalY + 15)

        const bookingSummaryData = [
            ["Total Bookings (All Time)", totalBookings.toString()],
            ["Approval Rate", `${approvalRate}%`],
            ["Pending Requests", pendingBookings.toString()],
            ["Completed Events", completedBookings.toString()]
        ]

        autoTable(doc, {
            // @ts-ignore
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Metric', 'Value']],
            body: bookingSummaryData,
            theme: 'striped',
            headStyles: { fillColor: [139, 21, 56] }
        })

        // SECTION 3: TOP VENUES
        // @ts-ignore
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
            // @ts-ignore
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
        return true
    } catch (error) {
        console.error("Export failed:", error)
        return false
    }
}
