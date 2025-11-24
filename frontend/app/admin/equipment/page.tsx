"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminEquipmentPage() {
  const { equipment, venues } = useData()
  const [isLoading, setIsLoading] = useState(false)

  const getVenueName = (venueId: string) => {
    return venues.find((v) => v.id === venueId)?.name || "Unknown Venue"
  }

  const handleAddEquipment = () => {
    console.log("[v0] Add equipment clicked")
    // TODO: Implement add equipment modal
  }

  const handleEditEquipment = (equipmentId: string, equipmentName: string) => {
    console.log("[v0] Edit equipment clicked:", equipmentId, equipmentName)
    // TODO: Implement edit equipment modal
  }

  const handleDeleteEquipment = (equipmentId: string, equipmentName: string) => {
    console.log("[v0] Delete equipment clicked:", equipmentId, equipmentName)
    if (confirm(`Are you sure you want to delete "${equipmentName}"?`)) {
      setIsLoading(true)
      setTimeout(() => {
        console.log("[v0] Equipment deleted successfully:", equipmentId)
        setIsLoading(false)
      }, 500)
    }
  }

  // Group equipment by category
  const equipmentByCategory = equipment.reduce(
    (acc, eq) => {
      if (!acc[eq.category]) {
        acc[eq.category] = []
      }
      acc[eq.category].push(eq)
      return acc
    },
    {} as Record<string, typeof equipment>,
  )

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Equipment Management</h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">Manage available equipment for venues</p>
            </div>
            <Button
              onClick={handleAddEquipment}
              className="w-full sm:w-auto bg-[#c41e3a] hover:bg-[#a01830] text-white text-sm"
            >
              Add Equipment
            </Button>
          </div>

          {/* Equipment by Category */}
          <div className="space-y-6 md:space-y-8">
            {Object.entries(equipmentByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">Equipment Name</TableHead>
                          <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                          <TableHead className="font-semibold text-gray-900">Description</TableHead>
                          <TableHead className="font-semibold text-gray-900">Total Qty</TableHead>
                          <TableHead className="font-semibold text-gray-900">Available</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((eq) => (
                          <TableRow key={eq.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{eq.name}</TableCell>
                            <TableCell className="text-sm text-gray-600">{getVenueName(eq.venueId)}</TableCell>
                            <TableCell className="text-sm text-gray-600 max-w-xs">
                              <div className="line-clamp-2">{eq.description}</div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-900 font-medium">{eq.quantity}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  eq.available > 0 ? "bg-[#4caf50] text-white" : "bg-red-500 text-white"
                                }`}
                              >
                                {eq.available}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleEditEquipment(eq.id, eq.name)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteEquipment(eq.id, eq.name)}
                                  variant="destructive"
                                  size="sm"
                                  className="text-xs"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {equipment.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 mb-4 text-sm md:text-base">No equipment found</p>
              <Button onClick={handleAddEquipment} className="bg-[#c41e3a] hover:bg-[#a01830] text-white">
                Add First Equipment
              </Button>
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}
