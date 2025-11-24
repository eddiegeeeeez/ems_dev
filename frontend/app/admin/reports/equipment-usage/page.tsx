"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp } from 'lucide-react'

export default function EquipmentUsagePage() {
  const { equipment, bookings } = useData()

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
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>Detailed view of all equipment and usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Quantity</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>In Use</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentWithUsage.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        {eq.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">{eq.category}</Badge>
                    </TableCell>
                    <TableCell>{eq.quantity}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{eq.available}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-medium">{eq.quantity - eq.available}</span>
                    </TableCell>
                    <TableCell>{eq.usage} events</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{eq.utilizationRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={eq.utilizationRate} className="w-24" />
                      </div>
                    </TableCell>
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
