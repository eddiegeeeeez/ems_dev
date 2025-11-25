"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Shield, UserCircle, Search, ArrowUpDown } from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import { UserDetailsModal } from "@/components/user-details-modal"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UserData {
  id: string
  email: string
  name: string
  role: "organizer" | "admin"
  college?: string
  department?: string
  position?: string
}

export default function UserManagementPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "user-1",
      email: "edgar.garan@umindanao.edu.ph",
      name: "Edgar Allain Sobremonte Garan",
      role: "organizer",
      college: "College of Computer Studies",
      department: "Bachelor of Science in Information Technology",
      position: "Event Organizer",
    },
    {
      id: "admin-1",
      email: "admin@umindanao.edu.ph",
      name: "Maria Santos",
      role: "admin",
      college: "University Administration",
      department: "Facilities Management",
      position: "Facility Manager",
    },
  ])

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRoleChange = (userId: string, newRole: "organizer" | "admin") => {
    console.log("[v0] Changing user role:", { userId, newRole })
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole })
    }
    setRefreshKey(prev => prev + 1)
  }

  const handlePositionChange = (userId: string, newPosition: string) => {
    console.log("[v0] Changing user position:", { userId, newPosition })
    setUsers(users.map((u) => (u.id === userId ? { ...u, position: newPosition } : u)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, position: newPosition })
    }
    setRefreshKey(prev => prev + 1)
  }

  const handleViewDetails = (userData: UserData) => {
    setSelectedUser(userData)
    setIsDetailsOpen(true)
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4caf50] text-white font-bold text-xs flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "college",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            College
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm">{row.getValue("college") || "N/A"}</div>,
    },
    {
      accessorKey: "department",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm">{row.getValue("department") || "N/A"}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <span className="inline-flex items-center gap-2 text-sm">
            {role === "admin" ? (
              <>
                <Shield className="h-4 w-4 text-[#c41e3a]" />
                <span className="font-medium text-[#c41e3a]">Admin</span>
              </>
            ) : (
              <>
                <UserCircle className="h-4 w-4 text-[#4caf50]" />
                <span className="font-medium text-[#4caf50]">Organizer</span>
              </>
            )}
          </span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
            View Details
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
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
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Manage user roles and positions</p>
          </div>

          {/* Search/Filter */}
          <div className="mb-4">
            <Input
              placeholder="Filter users..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                      No users found.
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
            {table.getFilteredRowModel().rows.length} user(s) total
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

        {selectedUser && (
          <UserDetailsModal
            key={refreshKey}
            user={selectedUser}
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onRoleChange={(newRole) => handleRoleChange(selectedUser.id, newRole)}
            onPositionChange={(newPosition) => handlePositionChange(selectedUser.id, newPosition)}
          />
        )}
        </div>
      </main>
    </AdminGuard>
  )
}
