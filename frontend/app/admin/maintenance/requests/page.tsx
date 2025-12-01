"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/shadcn-io/status"
import { Search, AlertCircle, Clock, CheckCircle2, XCircle, Eye, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnVisibility = {
  venue: boolean
  title: boolean
  description: boolean
  priority: boolean
  status: boolean
  createdDate: boolean
  actions: boolean
}

export default function MaintenanceRequestsPage() {
  const { maintenanceRequests, venues } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    venue: true,
    title: true,
    description: true,
    priority: true,
    status: true,
    createdDate: true,
    actions: true,
  })

  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-transparent text-red-200"
      case "high":
        return "bg-transparent text-orange-800"
      case "medium":
        return "bg-transparent text-yellow-800"
      case "low":
        return "bg-transparent text-blue-800"
      default:
        return "bg-transparent text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-800 bg-transparent"
      case "in-progress":
        return "text-blue-800 bg-transparent"
      case "pending":
        return "text-yellow-800 bg-transparent"
      case "cancelled":
        return "text-gray-800 bg-transparent"
      default:
        return "text-gray-800 bg-transparent"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Track and manage venue maintenance issues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right text-2xl font-bold text-gray-900">{maintenanceRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>"
              <div className="text-right text-2xl font-bold text-yellow-600">
                {maintenanceRequests.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600"> In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right text-2xl font-bold text-blue-600">
                {maintenanceRequests.filter((r) => r.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right text-2xl font-bold text-red-600">
                {maintenanceRequests.filter((r) => r.priority === "critical").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <div className="mb-4 flex gap-4 items-start">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={columnVisibility.title}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, title: checked }))
                }
              >
                Title
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.venue}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, venue: checked }))
                }
              >
                Venue
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.priority}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, priority: checked }))
                }
              >
                Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, status: checked }))
                }
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.createdDate}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, createdDate: checked }))
                }
              >
                Reported Date
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-sm text-gray-700">Request ID</TableHead>
                  {columnVisibility.title && <TableHead className="font-medium text-sm text-gray-700">Title</TableHead>}
                  {columnVisibility.venue && <TableHead className="font-medium text-sm text-gray-700">Venue</TableHead>}
                  {columnVisibility.priority && <TableHead className="font-medium text-sm text-gray-700">Priority</TableHead>}
                  {columnVisibility.status && <TableHead className="font-medium text-sm text-gray-700">Status</TableHead>}
                  {columnVisibility.createdDate && <TableHead className="font-medium text-sm text-gray-700">Reported Date</TableHead>}
                  {columnVisibility.actions && <TableHead className="font-medium text-sm text-gray-700 text-center">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-xs text-gray-600">{request.id}</TableCell>
                    {columnVisibility.title && (
                      <TableCell className="font-medium text-sm text-gray-900">{request.title}</TableCell>
                    )}
                    {columnVisibility.venue && (
                      <TableCell className="text-sm text-gray-600">{venues.find((v) => v.id === request.venueId)?.name || "Unknown"}</TableCell>
                    )}
                    {columnVisibility.priority && (
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Status status={request.status === "completed" ? "completed" : request.status === "in-progress" ? "maintenance" : request.status === "pending" ? "pending" : "offline"}
                            className={getStatusColor(request.status)}>
                          <StatusIndicator />
                          <StatusLabel />
                        </Status>
                      </TableCell>
                    )}
                    {columnVisibility.createdDate && (
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    )}
                    {columnVisibility.actions && (
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}
