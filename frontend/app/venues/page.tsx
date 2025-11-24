"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users, MapPin, Eye } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function VenuesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { venues } = useData()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  const handleSearch = (value: string) => {
    console.log("[v0] Search term updated:", value)
    setSearchTerm(value)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-[#c41e3a] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Venues</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Browse and book venues for your events</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 md:mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-gray-300 text-sm md:text-base w-full"
            />
          </div>
        </div>

        {/* Venues Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Venue Name</TableHead>
                  <TableHead className="font-semibold text-gray-900">Location</TableHead>
                  <TableHead className="font-semibold text-gray-900">Capacity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVenues.map((venue) => (
                  <TableRow key={venue.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">{venue.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{venue.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{venue.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>{venue.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${
                          venue.status === "available" ? "bg-[#4caf50] text-white" : "bg-gray-400 text-white"
                        } inline-flex px-2 py-1 text-xs font-medium rounded`}
                      >
                        {venue.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <Button
                          onClick={() => {
                            console.log("[v0] Viewing venue details for:", venue.id, venue.name)
                            router.push(`/venues/${venue.id}`)
                          }}
                          className="bg-[#c41e3a] hover:bg-[#a01830] text-white text-xs"
                          size="sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View & Book
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-600 text-sm md:text-base">No venues found matching your search</p>
          </div>
        )}
      </div>
    </main>
  )
}
