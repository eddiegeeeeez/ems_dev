"use client"

import { useState, useEffect } from "react"
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
import { Shield, UserCircle, Search, ArrowUpDown, ChevronDown } from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import { UserDetailsModal } from "@/components/user-details-modal"
import { Spinner } from "@/components/ui/spinner"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserData {
  id: number
  email: string
  name: string
  role: "ORGANIZER" | "ADMIN"
  department_id?: number
  created_at?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function UserManagementPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('[Users Page] Fetching users from API...')
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`)
        }

        const data = await response.json()
        console.log('[Users Page] API response:', data)

        // Handle paginated response: { users: { data: [...] } }
        let usersData: UserData[] = []
        if (data.users?.data) {
          usersData = data.users.data
        } else if (Array.isArray(data.users)) {
          usersData = data.users
        } else if (Array.isArray(data.data)) {
          usersData = data.data
        } else if (Array.isArray(data)) {
          usersData = data
        }

        console.log('[Users Page] Loaded users:', usersData.length)
        setUsers(usersData)
      } catch (err) {
        console.error('[Users Page] Error fetching users:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: number, newRole: "ORGANIZER" | "ADMIN") => {
    console.log("[Users Page] Changing user role:", { userId, newRole })

    // Optimistic UI update
    const previousUsers = [...users]
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole })
    }

    try {
      // Ensure role is uppercase to match backend validation
      const roleToSend = newRole.toUpperCase();

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: roleToSend }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update role: ${response.status}`)
      }

      const data = await response.json()
      console.log("[Users Page] Role updated successfully:", data)
      setRefreshKey(prev => prev + 1)

    } catch (error) {
      console.error("[Users Page] Error updating role:", error)
      // Revert optimistic update
      setUsers(previousUsers)
      if (selectedUser && selectedUser.id === userId) {
        // Find original role from previousUsers
        const originalUser = previousUsers.find(u => u.id === userId)
        if (originalUser) {
          setSelectedUser({ ...selectedUser, role: originalUser.role })
        }
      }
      alert(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handlePositionChange = (userId: number, newPosition: string) => {
    console.log("[Users Page] Changing user position:", { userId, newPosition })
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, ...{ position: newPosition } })
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
            className="h-auto p-0 font-semibold text-gray-900"
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
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <span className="inline-flex items-center gap-2 text-sm">
            {role === "ADMIN" ? (
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
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
              View Details
            </Button>
          </div>
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
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">Manage user roles and permissions</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Error loading users</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Users Data */}
          {!loading && !error && (
            <>
              {/* Search/Filter */}
              <div className="mb-4 flex items-center gap-2">
                <Input
                  placeholder="Filter users..."
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
                            {column.id === "name" && "User"}
                            {column.id === "role" && "Role"}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50">
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
            </>
          )}

          {selectedUser && (
            <UserDetailsModal
              key={refreshKey}
              user={selectedUser as any}
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              onRoleChange={(userId, newRole) => handleRoleChange(userId as unknown as number, newRole as "ORGANIZER" | "ADMIN")}
              onPositionChange={(userId, newPosition) => handlePositionChange(userId as unknown as number, newPosition)}
            />
          )}
        </div>
      </main>
    </AdminGuard>
  )
}
