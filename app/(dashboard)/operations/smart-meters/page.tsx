"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Sample data
const smartMeters = [
  {
    id: "SM001",
    serialNumber: "EM6400-12345",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "online",
    lastSeen: "2023-03-01T12:30:00Z",
    assigned: true,
    assignedTo: "Acme Corporation",
  },
  {
    id: "SM002",
    serialNumber: "EM6400-23456",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "online",
    lastSeen: "2023-03-01T12:35:00Z",
    assigned: true,
    assignedTo: "TechCorp",
  },
  {
    id: "SM003",
    serialNumber: "DTSU666-34567",
    manufacturer: "Huawei",
    model: "DTSU666-H",
    status: "offline",
    lastSeen: "2023-02-28T10:15:00Z",
    assigned: false,
    assignedTo: null,
  },
  {
    id: "SM004",
    serialNumber: "DTSU666-45678",
    manufacturer: "Huawei",
    model: "DTSU666-H",
    status: "online",
    lastSeen: "2023-03-01T12:40:00Z",
    assigned: true,
    assignedTo: "GlobalTech Industries",
  },
  {
    id: "SM005",
    serialNumber: "EM6400-56789",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "online",
    lastSeen: "2023-03-01T12:45:00Z",
    assigned: false,
    assignedTo: null,
  },
]

export default function SmartMetersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMeters = smartMeters.filter(
    (meter) =>
      meter.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Meters</h1>
          <p className="text-muted-foreground">Manage your smart meter inventory</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Smart Meter
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search smart meters..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeters.map((meter) => (
              <TableRow key={meter.id}>
                <TableCell className="font-medium">{meter.serialNumber}</TableCell>
                <TableCell>{meter.manufacturer}</TableCell>
                <TableCell>{meter.model}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {meter.status === "online" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span>Offline</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(meter.lastSeen).toLocaleString()}</TableCell>
                <TableCell>
                  {meter.assigned ? (
                    <Badge variant="outline" className="bg-primary/10">
                      {meter.assignedTo}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted">
                      Unassigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

