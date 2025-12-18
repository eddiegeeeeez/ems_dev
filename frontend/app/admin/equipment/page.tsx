"use client"

import { useData } from "@/lib/data-context"
import { AdminGuard } from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUpDown, MoreHorizontal, ChevronDown } from 'lucide-react'
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Equipment } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AdminEquipmentPage() {
  const { equipment, venues, colleges } = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    venueId: "",
    collegeId: "",
    quantity: 0,
    available: 0,
  })

  // Helper to refresh data (simple page reload or could add refresh method to context)
  const refreshData = () => {
    window.location.reload()
  }

  const getVenueName = (venueId?: string) => {
    if (!venueId) return "Any Venue"
    return venues.find((v) => v.id === venueId)?.name || "Unknown Venue"
  }

  const handleAddEquipment = () => {
    setFormData({
      name: "",
      category: "",
      venueId: "null", // API handles "null" string or undefined? We'll convert to null before sending
      collegeId: colleges.length > 0 ? colleges[0].id : "",
      quantity: 0,
      available: 0,
    })
    setIsAddOpen(true)
  }

  const handleEditEquipment = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId)
    if (eq) {
      setSelectedEquipment(eq)
      setFormData({
        name: eq.name,
        category: eq.category,
        venueId: eq.venueId || eq.venue_id || "null",
        collegeId: eq.collegeId || eq.college_id || (colleges.length > 0 ? colleges[0].id : ""),
        quantity: eq.quantity,
        available: eq.available_quantity ?? eq.available ?? eq.quantity,
      })
      setIsEditOpen(true)
    }
  }

  const handleDeleteEquipment = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId)
    if (eq) {
      setSelectedEquipment(eq)
      setIsDeleteOpen(true)
    }
  }

  const handleSubmitAdd = async () => {
    if (!formData.collegeId) {
      alert("Please select a college (required by system)")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        available_quantity: formData.available, // Send available quantity
        college_id: formData.collegeId,
        venue_id: formData.venueId === "null" || !formData.venueId ? null : formData.venueId,
        description: "", // Optional
      }

      await apiClient.createEquipment(payload)
      setIsAddOpen(false)
      refreshData()
    } catch (error) {
      console.error("Failed to add equipment:", error)
      alert("Failed to add equipment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedEquipment) return
    setIsLoading(true)
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        available_quantity: formData.available, // Send available quantity
        college_id: formData.collegeId,
        venue_id: formData.venueId === "null" || !formData.venueId ? null : formData.venueId,
        description: selectedEquipment.description || "",
      }

      await apiClient.updateEquipment(selectedEquipment.id, payload)
      setIsEditOpen(false)
      refreshData()
    } catch (error) {
      console.error("Failed to update equipment:", error)
      alert("Failed to update equipment.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitDelete = async () => {
    if (!selectedEquipment) return
    setIsLoading(true)
    try {
      await apiClient.deleteEquipment(selectedEquipment.id)
      setIsDeleteOpen(false)
      refreshData()
    } catch (error) {
      console.error("Failed to delete equipment:", error)
      alert("Failed to delete equipment.")
    } finally {
      setIsLoading(false)
    }
  }

  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Equipment Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-sm">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-900"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        const getCategoryTextColor = (value: string) => {
          switch (value?.toLowerCase()) {
            case "audio-visual":
              return "text-purple-700"
            case "supplies":
              return "text-blue-700"
            case "furniture":
              return "text-green-700"
            default:
              return "text-gray-800"
          }
        }
        return (
          <div className={`text-sm font-medium ${getCategoryTextColor(category)}`}>
            {category}
          </div>
        )
      },
    },
    {
      accessorKey: "venue_id", // Updated accessor
      header: "Venue",
      cell: ({ row }) => {
        // Handle both snake_case and camelCase
        const vId = row.original.venue_id || row.original.venueId
        return <div className="text-sm">{getVenueName(vId)}</div>
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <div className="w-full flex justify-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold text-gray-900"
            >
              Qty
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center font-medium text-sm">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "available_quantity",
      header: ({ column }) => {
        return (
          <div className="w-full flex justify-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold text-gray-900"
            >
              Available
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const available = row.original.available_quantity ?? row.original.available ?? 0
        const availableColor = available > 0 ? "text-[#4caf50]" : "text-red-600"
        return (
          <div className={`text-center font-semibold text-sm ${availableColor}`}>
            {available}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center font-semibold text-gray-900">Actions</div>,
      cell: ({ row }) => {
        const eq = row.original
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditEquipment(eq.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteEquipment(eq.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: equipment,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

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

          {/* Search/Filter */}
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Filter equipment..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "quantity" && "Total Qty"}
                        {column.id === "Venue" && "Venue"}
                        {column.id === "category" && "Category"}
                        {column.id === "venueId" && "Venue"}
                        {column.id === "name" && "Equipment Name"}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Equipment Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gray-50">
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="font-semibold text-sm text-gray-900">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {table.getFilteredRowModel().rows.length} equipment item(s) total
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Add Equipment Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
              <DialogDescription>Add new equipment to a venue or general inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter equipment name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio-visual">Audio-Visual</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">Owner (College)</Label>
                <Select value={formData.collegeId} onValueChange={(value) => setFormData({ ...formData, collegeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue (Optional)</Label>
                <Select value={formData.venueId} onValueChange={(value) => setFormData({ ...formData, venueId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Any / General Inventory</SelectItem>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAdd} disabled={isLoading} className="bg-[#c41e3a] hover:bg-[#a01830]">
                {isLoading ? "Adding..." : "Add Equipment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Equipment Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Equipment</DialogTitle>
              <DialogDescription>Update equipment details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Equipment Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter equipment name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio-visual">Audio-Visual</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-college">Owner (College)</Label>
                <Select value={formData.collegeId} onValueChange={(value) => setFormData({ ...formData, collegeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-venue">Venue (Optional)</Label>
                <Select value={formData.venueId} onValueChange={(value) => setFormData({ ...formData, venueId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Any / General Inventory</SelectItem>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEdit} disabled={isLoading} className="bg-[#c41e3a] hover:bg-[#a01830]">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Equipment Modal */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Equipment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this equipment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Equipment:</span> {selectedEquipment?.name}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Venue:</span> {selectedEquipment && getVenueName(selectedEquipment.venueId)}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmitDelete} disabled={isLoading} variant="destructive">
                {isLoading ? "Deleting..." : "Delete Equipment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </AdminGuard>
  )
}
