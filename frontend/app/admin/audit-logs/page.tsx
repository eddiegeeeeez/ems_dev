"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, User, Activity, ArrowUpDown } from 'lucide-react'

type SortField = 'timestamp' | 'user' | 'action' | 'target' | null
type SortDirection = 'asc' | 'desc'

export default function AuditLogsPage() {
  const { auditLogs } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'timestamp' ? 'desc' : 'asc')
    }
  }

  let filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase())
    return matchesSearch && matchesAction
  })

  // Sort logs
  if (sortField) {
    filteredLogs = [...filteredLogs].sort((a, b) => {
      let aVal: any = ''
      let bVal: any = ''

      switch (sortField) {
        case 'timestamp':
          aVal = new Date(a.timestamp).getTime()
          bVal = new Date(b.timestamp).getTime()
          break
        case 'user':
          aVal = a.userName.toLowerCase()
          bVal = b.userName.toLowerCase()
          break
        case 'action':
          aVal = a.action.toLowerCase()
          bVal = b.action.toLowerCase()
          break
        case 'target':
          aVal = a.target.toLowerCase()
          bVal = b.target.toLowerCase()
          break
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes("approved")) return "bg-green-100 text-green-800"
    if (action.toLowerCase().includes("rejected")) return "bg-red-100 text-red-800"
    if (action.toLowerCase().includes("created")) return "bg-blue-100 text-blue-800"
    if (action.toLowerCase().includes("updated")) return "bg-yellow-100 text-yellow-800"
    if (action.toLowerCase().includes("deleted")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  /* Define columns for DataTable */
  const columns: any[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {new Date(row.original.timestamp).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.original.userName}</span>
        </div>
      )
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => (
        <Badge className={getActionColor(row.original.action)}>
          <Activity className="w-3 h-3 mr-1" />
          {row.original.action}
        </Badge>
      )
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }: any) => <div className="font-mono text-sm">{row.original.target}</div>
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }: any) => <div className="max-w-md truncate">{row.original.details}</div>
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }: any) => <div className="text-sm text-gray-600">{row.original.ipAddress}</div>
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">Track all system activities and changes</p>
      </div>

      <div>
        <DataTable columns={columns} data={auditLogs} searchKey="details" searchPlaceholder="Search activities..." />
      </div>
    </div>
  )
}
