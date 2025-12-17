"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Eye, GraduationCap } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Program {
  id: number
  college_id: number
  name: string
  is_active: boolean
}

interface College {
  id: number
  name: string
  code: string
  dean: string
  description: string | null
  is_active: boolean
  programs?: Program[]
  programs_count?: number
}

export default function DepartmentsPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/admin/colleges`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setColleges(data.colleges || [])
      }
    } catch (error) {
      console.error('Error fetching colleges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (college: College) => {
    setSelectedCollege(college)
    setIsViewModalOpen(true)
  }

  const totalPrograms = colleges.reduce((sum, college) => sum + (college.programs_count || 0), 0)

  /* Define columns for DataTable */
  const columns: any[] = [
    {
      accessorKey: "name",
      header: "College",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-gray-500">{row.original.code}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "programs_count",
      header: "Program",
      cell: ({ row }: any) => (
        <Badge className="bg-blue-100 text-blue-800">
          {row.original.programs_count || 0} Program{(row.original.programs_count || 0) !== 1 ? 's' : ''}
        </Badge>
      )
    },
    {
      accessorKey: "dean",
      header: "College Dean",
      cell: ({ row }: any) => <span className="text-sm">{row.original.dean}</span>
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Colleges & Programs</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Manage university colleges and academic programs</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Colleges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-end text-2xl font-bold text-gray-900">{colleges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-end text-2xl font-bold text-blue-600">{totalPrograms}</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin h-6 w-6 border-2 border-[#8B1538] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div>
            <DataTable columns={columns} data={colleges} searchKey="name" searchPlaceholder="Search colleges..." />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#8B1538]" />
              {selectedCollege?.name}
            </DialogTitle>
            <DialogDescription>
              College code: {selectedCollege?.code}
            </DialogDescription>
          </DialogHeader>

          {selectedCollege && (
            <div className="space-y-6 py-4">
              {/* College Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">College Dean</h4>
                  <p className="text-sm text-gray-900">{selectedCollege.dean}</p>
                </div>

                {selectedCollege.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                    <p className="text-sm text-gray-600">{selectedCollege.description}</p>
                  </div>
                )}
              </div>

              {/* Programs List */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Programs Offered ({selectedCollege.programs?.length || 0})
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedCollege.programs && selectedCollege.programs.length > 0 ? (
                    selectedCollege.programs.map((program, index) => (
                      <div
                        key={program.id}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#8B1538] text-white text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-900 flex-1">{program.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No programs found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
