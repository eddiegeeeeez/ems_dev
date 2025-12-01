"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Clock, CheckCircle2, XCircle, Plus, Edit, Trash2, Eye, ChevronDown, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnVisibility = {
  venue: boolean
  title: boolean
  priority: boolean
  status: boolean
  reportedDate: boolean
  actions: boolean
}

export default function MaintenancePage() {
  const router = useRouter()
  const { maintenanceRequests, venues } = useData()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Redirect non-admin users to dashboard
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])
  const [statusFilter, setStatusFilter] = useState("all")
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    venue: true,
    title: true,
    priority: true,
    status: true,
    reportedDate: true,
    actions: true,
  })

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  // Form states
  const [formData, setFormData] = useState({
    venueId: "",
    title: "",
    description: "",
    priority: "medium" as const,
  })

  // Filter maintenance requests
  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateRequest = () => {
    if (!formData.venueId || !formData.title || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    console.log("Creating maintenance request:", formData)
    alert("Maintenance request created successfully!")
    
    // Reset form
    setFormData({
      venueId: "",
      title: "",
      description: "",
      priority: "medium",
    })
    setIsCreateOpen(false)
  }

  const handleEditRequest = () => {
    if (!formData.venueId || !formData.title || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    console.log("Updating maintenance request:", selectedRequest?.id, formData)
    alert("Maintenance request updated successfully!")
    
    setIsEditOpen(false)
    setSelectedRequest(null)
    setFormData({
      venueId: "",
      title: "",
      description: "",
      priority: "medium",
    })
  }

  const handleDeleteRequest = (requestId: string) => {
    if (confirm("Are you sure you want to delete this maintenance request?")) {
      console.log("Deleting maintenance request:", requestId)
      alert("Maintenance request deleted successfully!")
    }
  }

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request)
    setIsViewOpen(true)
  }

  const handleEditClick = (request: any) => {
    setSelectedRequest(request)
    setFormData({
      venueId: request.venueId,
      title: request.title,
      description: request.description,
      priority: request.priority,
    })
    setIsEditOpen(true)
  }

  const getVenueName = (venueId: string) => {
    return venues.find((v) => v.id === venueId)?.name || "Unknown Venue"
  }

  // Stats
  const totalRequests = maintenanceRequests.length
  const pendingRequests = maintenanceRequests.filter((r) => r.status === "pending").length
  const inProgressRequests = maintenanceRequests.filter((r) => r.status === "in-progress").length
  const completedRequests = maintenanceRequests.filter((r) => r.status === "completed").length
  const criticalRequests = maintenanceRequests.filter((r) => r.priority === "critical").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#c41e3a] hover:bg-[#a01830] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Report Maintenance Issue</DialogTitle>
                  <DialogDescription>
                    Create a new maintenance request for a venue issue
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="venue">Venue *</Label>
                    <Select value={formData.venueId} onValueChange={(value) => setFormData({ ...formData, venueId: value })}>
                      <SelectTrigger id="venue">
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Air conditioner not working"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateRequest} className="bg-[#c41e3a] hover:bg-[#a01830]">
                    Create Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-600">Track and manage maintenance issues for your venues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <Label className="text-sm mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-[180px]">
            <Label className="text-sm mb-2 block">Priority</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Label className="text-sm mb-2 block">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={columnVisibility.venue}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, venue: checked }))
                }
              >
                Venue
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.title}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, title: checked }))
                }
              >
                Title
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
                checked={columnVisibility.reportedDate}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, reportedDate: checked }))
                }
              >
                Reported Date
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} of {maintenanceRequests.length} requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {columnVisibility.venue && <TableHead className="font-medium text-sm text-gray-700">Venue</TableHead>}
                    {columnVisibility.title && <TableHead className="font-medium text-sm text-gray-700">Issue Title</TableHead>}
                    {columnVisibility.priority && <TableHead className="font-medium text-sm text-gray-700">Priority</TableHead>}
                    {columnVisibility.status && <TableHead className="font-medium text-sm text-gray-700">Status</TableHead>}
                    {columnVisibility.reportedDate && <TableHead className="font-medium text-sm text-gray-700">Reported Date</TableHead>}
                    {columnVisibility.actions && <TableHead className="font-medium text-sm text-gray-700 text-center">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-600">
                        No maintenance requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        {columnVisibility.venue && (
                          <TableCell className="font-medium">
                            {getVenueName(request.venueId)}
                          </TableCell>
                        )}
                        {columnVisibility.title && (
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">
                              {request.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {request.description}
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.priority && (
                          <TableCell>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.status && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.reportedDate && (
                          <TableCell className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                        )}
                        {columnVisibility.actions && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(request)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRequest(request.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Details Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Venue</Label>
                  <p className="text-gray-900">{getVenueName(selectedRequest.venueId)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Issue Title</Label>
                  <p className="text-gray-900">{selectedRequest.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Description</Label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Priority</Label>
                    <Badge className={getPriorityColor(selectedRequest.priority)}>
                      {selectedRequest.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Status</Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRequest.status)}
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Reported</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Maintenance Request</DialogTitle>
              <DialogDescription>
                Update the maintenance request details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-venue">Venue *</Label>
                <Select value={formData.venueId} onValueChange={(value) => setFormData({ ...formData, venueId: value })}>
                  <SelectTrigger id="edit-venue">
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-title">Issue Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Air conditioner not working"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditRequest} className="bg-[#c41e3a] hover:bg-[#a01830]">
                Update Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
