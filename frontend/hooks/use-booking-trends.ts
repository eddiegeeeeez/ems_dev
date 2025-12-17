import { useState, useMemo } from 'react'
import { Booking } from '@/lib/types'

export type TimeRange = "week" | "month" | "year"

interface TrendData {
    label: string
    value: number
}

interface UseBookingTrendsReturn {
    trendData: TrendData[]
    timeRange: TimeRange
    setTimeRange: (range: TimeRange) => void
    filteredBookings: any[] // Using any[] to match existing usage, ideally Booking[]
}

export function useBookingTrends(bookings: any[], metric: 'count' | 'hours' = 'count'): UseBookingTrendsReturn {
    const [timeRange, setTimeRange] = useState<TimeRange>("month")

    const filteredBookings = useMemo(() => {
        const today = new Date()
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - 7);
        const startOfMonth = new Date(today); startOfMonth.setDate(today.getDate() - 30);
        const startOfYear = new Date(today); startOfYear.setMonth(today.getMonth() - 12);

        return bookings.filter(booking => {
            const date = new Date(booking.startDate)
            if (timeRange === "week") return date >= startOfWeek && date <= today;
            if (timeRange === "month") return date >= startOfMonth && date <= today;
            if (timeRange === "year") return date >= startOfYear && date <= today;
            return true;
        })
    }, [bookings, timeRange])

    const trendData = useMemo(() => {
        const today = new Date()
        let result: TrendData[] = []

        if (timeRange === "week") {
            // Last 7 days
            const last7Days: { date: Date, label: string, count: number }[] = []
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)
                last7Days.push({
                    date: d,
                    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    count: 0
                })
            }

            filteredBookings.forEach(booking => {
                const bDate = new Date(booking.startDate)
                const dayStat = last7Days.find(d => d.date.toDateString() === bDate.toDateString())
                if (dayStat) {
                    if (metric === 'count') {
                        dayStat.count++
                    } else {
                        const start = new Date(booking.startDate + 'T' + booking.startTime)
                        const end = new Date(booking.endDate + 'T' + booking.endTime)
                        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                        dayStat.count += duration
                    }
                }
            })
            result = last7Days.map(d => ({ label: d.label, value: Number(d.count.toFixed(1)) }))

        } else if (timeRange === "month") {
            // Last 30 days daily
            const last30Days: { date: Date, label: string, count: number }[] = []
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)
                last30Days.push({
                    date: d,
                    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    count: 0
                })
            }

            filteredBookings.forEach(booking => {
                const bDate = new Date(booking.startDate)
                const dayStat = last30Days.find(d => d.date.toDateString() === bDate.toDateString())
                if (dayStat) {
                    if (metric === 'count') {
                        dayStat.count++
                    } else {
                        const start = new Date(booking.startDate + 'T' + booking.startTime)
                        const end = new Date(booking.endDate + 'T' + booking.endTime)
                        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                        dayStat.count += duration
                    }
                }
            })
            result = last30Days.map(d => ({ label: d.label, value: Number(d.count.toFixed(1)) }))

        } else if (timeRange === "year") {
            // Last 12 months
            const last12Months: { monthIdx: number, label: string, count: number, year: number }[] = []
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
                last12Months.push({
                    monthIdx: d.getMonth(),
                    year: d.getFullYear(),
                    label: d.toLocaleString('default', { month: 'short' }),
                    count: 0
                })
            }

            filteredBookings.forEach(booking => {
                const bDate = new Date(booking.startDate)
                const match = last12Months.find(m => m.monthIdx === bDate.getMonth() && m.year === bDate.getFullYear())
                if (match) {
                    if (metric === 'count') {
                        match.count++
                    } else {
                        const start = new Date(booking.startDate + 'T' + booking.startTime)
                        const end = new Date(booking.endDate + 'T' + booking.endTime)
                        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                        match.count += duration
                    }
                }
            })
            result = last12Months.map(d => ({ label: d.label, value: Number(d.count.toFixed(1)) }))
        }

        return result
    }, [filteredBookings, timeRange])

    return { trendData, timeRange, setTimeRange, filteredBookings }
}
