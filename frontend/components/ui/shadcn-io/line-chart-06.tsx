"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartLineDots06Props {
  data?: Array<{ month: string; bookings: number; approved: number }>
  dataKey1?: string
  dataKey2?: string
  label1?: string
  label2?: string
}

export function ChartLineDots({
  data = [
    { month: "Jan", bookings: 12, approved: 8 },
    { month: "Feb", bookings: 15, approved: 11 },
    { month: "Mar", bookings: 18, approved: 14 },
    { month: "Apr", bookings: 22, approved: 18 },
    { month: "May", bookings: 25, approved: 20 },
    { month: "Jun", bookings: 28, approved: 23 },
  ],
  dataKey1 = "bookings",
  dataKey2 = "approved",
  label1 = "Total Bookings",
  label2 = "Approved",
}: ChartLineDots06Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line 
            type="monotone" 
            dataKey={dataKey1} 
            stroke="#c41e3a" 
            strokeWidth={2}
            name={label1} 
            dot={{ fill: '#c41e3a', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey2} 
            stroke="#4caf50" 
            strokeWidth={2}
            name={label2} 
            dot={{ fill: '#4caf50', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
