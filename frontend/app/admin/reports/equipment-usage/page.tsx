"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnVisibility = {
  name: boolean
  category: boolean
  quantity: boolean
  available: boolean
  inUse: boolean
  usageCount: boolean
  utilization: boolean
}

export default function EquipmentUsagePage() {
  const { equipment, bookings } = useData()
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    category: true,
    quantity: true,
    available: true,
    inUse: true,
    usageCount: true,
    utilization: true,
  })

  const getEquipmentUsage = (equipmentId: string) => {
    const usageCount = bookings.filter((b) =>
      b.equipment.some((eq) => eq.equipmentId === equipmentId)
    ).length
    return usageCount
  }

  const equipmentWithUsage = equipment.map((eq) => ({
    ...eq,
    usage: getEquipmentUsage(eq.id),
    utilizationRate: ((eq.quantity - eq.available) / eq.quantity) * 100,
  }))

  const totalEquipment = equipment.reduce((sum, eq) => sum + eq.quantity, 0)
  const totalAvailable = equipment.reduce((sum, eq) => sum + eq.available, 0)
  const overallUtilization = ((totalEquipment - totalAvailable) / totalEquipment) * 100

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipment Usage</h1>
        <p className="text-gray-600 mt-1">Monitor equipment inventory and usage patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEquipment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalEquipment - totalAvailable}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{overallUtilization.toFixed(1)}%</div>
            <Progress value={overallUtilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>Detailed view of all equipment and usage statistics</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={columnVisibility.name}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, name: checked }))
                }
              >
                Equipment Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.category}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, category: checked }))
                }
              >
                Category
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.quantity}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, quantity: checked }))
                }
              >
                Total Quantity
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.available}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, available: checked }))
                }
              >
                Available
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.inUse}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, inUse: checked }))
                }
              >
                In Use
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.usageCount}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, usageCount: checked }))
                }
              >
                Usage Count
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.utilization}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, utilization: checked }))
                }
              >
                Utilization
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead>Equipment Name</TableHead>}
                  {columnVisibility.category && <TableHead>Category</TableHead>}
                  {columnVisibility.quantity && <TableHead>Total Quantity</TableHead>}
                  {columnVisibility.available && <TableHead>Available</TableHead>}
                  {columnVisibility.inUse && <TableHead>In Use</TableHead>}
                  {columnVisibility.usageCount && <TableHead>Usage Count</TableHead>}
                  {columnVisibility.utilization && <TableHead>Utilization</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentWithUsage.map((eq) => (
                  <TableRow key={eq.id}>
                    {columnVisibility.name && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          {eq.name}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.category && (
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-800">{eq.category}</Badge>
                      </TableCell>
                    )}
                    {columnVisibility.quantity && (
                      <TableCell className="text-center">{eq.quantity}</TableCell>
                    )}
                    {columnVisibility.available && (
                      <TableCell className="text-center">
                        <span className="text-green-600 font-medium">{eq.available}</span>
                      </TableCell>
                    )}
                    {columnVisibility.inUse && (
                      <TableCell className="text-center">
                        <span className="text-blue-600 font-medium">{eq.quantity - eq.available}</span>
                      </TableCell>
                    )}
                    {columnVisibility.usageCount && (
                      <TableCell className="text-center">{eq.usage} events</TableCell>
                    )}
                    {columnVisibility.utilization && (
                      <TableCell className="text-center">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="font-medium">{eq.utilizationRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={eq.utilizationRate} className="w-32" />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
