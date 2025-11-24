"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Calendar, Users, Download, Clock } from 'lucide-react'
import { useData } from "@/lib/data-context"

export default function BookingStatisticsPage() {
  const { bookings, venues } = useData()
  const [timeRange, setTimeRange] = useState("month")

  const totalBookings = bookings?.length || 0
  const approvedBookings = bookings?.filter(b => b.status === "approved").length || 0
  const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0
  const completedBookings = bookings?.filter(b => b.status === "completed").length || 0
  const approvalRate = totalBookings > 0 ? ((approvedBookings / totalBookings) * 100).toFixed(1) : "0"

  // Mock data for charts
  const monthlyData = [
    { month: "Jan", bookings: 45 },
    { month: "Feb", bookings: 52 },
    { month: "Mar", bookings: 61 },
    { month: "Apr", bookings: 58 },
    { month: "May", bookings: 67 },
    { month: "Jun", bookings: 73 },
  ]

  const venuePopularity = venues?.map(venue => ({
    name: venue.name,
    bookings: bookings?.filter(b => b.venueId === venue.id).length || 0
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 5) || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Statistics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights on venue bookings</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalBookings}</div>
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{approvalRate}%</div>
            <p className="text-sm text-gray-600 mt-1">{approvedBookings} approved bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
            <Clock className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingBookings}</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Events</CardTitle>
            <Users className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedBookings}</div>
            <p className="text-sm text-gray-600 mt-1">Successfully held</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>Monthly booking volume over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-end justify-between gap-4 px-4">
            {monthlyData.map((data, index) => {
              const maxBookings = Math.max(...monthlyData.map(d => d.bookings))
              const heightPercent = (data.bookings / maxBookings) * 90
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#c41e3a] rounded-t-lg transition-all hover:bg-[#a01830] hover:shadow-lg cursor-pointer relative group" 
                    style={{ height: `${heightPercent}%`, minHeight: '40px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.bookings} bookings
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{data.bookings}</p>
                    <p className="text-xs text-gray-600">{data.month}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Venues */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Venues</CardTitle>
            <CardDescription>Top 5 venues by booking count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {venuePopularity.map((venue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B1538] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{venue.name}</span>
                  </div>
                  <span className="text-lg font-bold text-[#8B1538]">{venue.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Breakdown of all booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Approved</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(approvedBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-green-600 w-12 text-right">{approvedBookings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(pendingBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-amber-600 w-12 text-right">{pendingBookings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(completedBookings / totalBookings) * 100}%` }}></div>
                  </div>
                  <span className="font-bold text-blue-600 w-12 text-right">{completedBookings}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
