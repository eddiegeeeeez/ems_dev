"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, Users, Calendar, Eye } from 'lucide-react'

export default function DepartmentsPage() {
  const { departments } = useData()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalMembers = departments.reduce((sum, dept) => sum + dept.totalMembers, 0)
  const totalEvents = departments.reduce((sum, dept) => sum + dept.activeEvents, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Manage university departments and their activities</p>
          </div>
          <Button className="w-full sm:w-auto bg-[#8B1538] hover:bg-[#6B1028] text-white text-sm">
            Add Department
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-end text-2xl font-bold text-gray-900">{departments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-endtext-2xl font-bold text-blue-600">{totalMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-end text-2xl font-bold text-green-600">{totalEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Head of Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Active Events</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {dept.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#8B1538] text-white">{dept.college}</Badge>
                    </TableCell>
                    <TableCell>{dept.headOfDepartment}</TableCell>
                    <TableCell className="text-blue-600">{dept.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {dept.totalMembers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <Badge className="bg-green-100 text-green-800">{dept.activeEvents}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
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
