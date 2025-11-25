"use client"

import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Equipment } from "@/lib/types"
import { Plus } from "lucide-react"

interface EquipmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: Equipment[]
  onAddEquipment: (equipmentId: string, quantity: number) => void
  selectedEquipment?: Record<string, number>
}

export function EquipmentModal({
  open,
  onOpenChange,
  equipment,
  onAddEquipment,
  selectedEquipment = {},
}: EquipmentModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(selectedEquipment)

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    console.log("[v0] Equipment quantity changed:", equipmentId, "Quantity:", quantity)
    setQuantities((prev) => {
      const updated = { ...prev }
      if (quantity > 0) {
        updated[equipmentId] = quantity
      } else {
        delete updated[equipmentId]
      }
      return updated
    })
  }

  const handleAddEquipment = (equipmentId: string) => {
    const quantity = quantities[equipmentId] || 0
    if (quantity > 0) {
      console.log("[v0] Adding equipment:", equipmentId, "Quantity:", quantity)
      onAddEquipment(equipmentId, quantity)
      setQuantities((prev) => {
        const updated = { ...prev }
        delete updated[equipmentId]
        return updated
      })
    }
  }

  const handleClose = () => {
    console.log("[v0] Equipment modal closed")
    setQuantities({})
    onOpenChange(false)
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
    {} as Record<string, Equipment[]>,
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Equipment</DialogTitle>
          <DialogDescription>Choose equipment for your event</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(equipmentByCategory).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">{category}</h4>
              <div className="space-y-3">
                {items.map((eq) => (
                  <div key={eq.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{eq.name}</p>
                      <p className="text-xs text-gray-600">Available: {eq.available}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={eq.available}
                        value={quantities[eq.id] || 0}
                        onChange={(e) => handleQuantityChange(eq.id, Number.parseInt(e.target.value) || 0)}
                        className="w-14 h-8 text-center border-gray-300 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddEquipment(eq.id)}
                        disabled={(quantities[eq.id] || 0) === 0}
                        className="bg-[#4caf50] hover:bg-[#45a049] text-white h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full bg-gray-200 text-gray-900 hover:bg-gray-300">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
