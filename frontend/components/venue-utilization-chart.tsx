"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { Booking, Venue } from "@/lib/types"

export const description = "An interactive bar chart"

const chartConfig = {
    bookings: {
        label: "Total Bookings",
        color: "var(--chart-1)",
    },
    hours: {
        label: "Hours Booked",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

interface VenueUtilizationChartProps {
    bookings: Booking[]
    venues: Venue[]
}

export function VenueUtilizationChart({ bookings, venues }: VenueUtilizationChartProps) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("bookings")

    const chartData = React.useMemo(() => {
        // 1. Initialize map with 0 for all venues
        const venueMap = new Map<string, { venue: string; bookings: number; hours: number }>()

        venues.forEach(v => {
            venueMap.set(v.id, { venue: v.name, bookings: 0, hours: 0 })
        })

        // 2. Aggregate bookings
        bookings.forEach(b => {
            const stats = venueMap.get(b.venueId)
            if (stats && b.status !== 'rejected') { // Include pending/approved/completed
                stats.bookings += 1

                // Calculate hours
                const start = new Date(`${b.startDate}T${b.startTime}`)
                const end = new Date(`${b.endDate}T${b.endTime}`)
                const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                stats.hours += Math.round(hours * 100) / 100
            }
        })

        // 3. Convert to array and sort by active metric
        // Showing top 10 venues
        return Array.from(venueMap.values())
            .sort((a, b) => b[activeChart] - a[activeChart])
            .slice(0, 10)
    }, [bookings, venues, activeChart])

    const total = React.useMemo(
        () => ({
            bookings: chartData.reduce((acc, curr) => acc + curr.bookings, 0),
            hours: chartData.reduce((acc, curr) => acc + curr.hours, 0),
        }),
        [chartData]
    )

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Venue Utilization</CardTitle>
                    <CardDescription>
                        Most used venues by {activeChart === "bookings" ? "booking count" : "total hours"}
                    </CardDescription>
                </div>
                <div className="flex">
                    {["bookings", "hours"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="venue"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            // Truncate long venue names if needed
                            tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey={activeChart}
                                    labelFormatter={(value) => value}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
