"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
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
const assignments = [
  {
    id: "A001",
    meterSerialNumber: "EM6400-12345",
    meterManufacturer: "Elmeasure",
    meterModel: "EM6400NG",
    companyName: "Acme Corporation",
    assignedDate: "2023-01-15T10:00:00Z",
    location: "Main Building, Floor 1",
    status: "active",
  },
  {
    id: "A002",
    meterSerialNumber: "EM6400-23456",
    meterManufacturer: "Elmeasure",
    meterModel: "EM6400NG",
    companyName: "TechCorp",
    assignedDate: "2023-01-20T14:30:00Z",
    location: "Production Facility",
    status: "active",
  },
  {
    id: "A003",
    meterSerialNumber: "DTSU666-45678",
    meterManufacturer: "Huawei",
    meterModel: "DTSU666-H",
    companyName: "GlobalTech Industries",
    assignedDate: "2023-02-05T09:15:00Z",
    location: "Server Room",
    status: "active",
  },
  {
    id: "A004",
    meterSerialNumber: "EM6400-34567",
    meterManufacturer: "Elmeasure",
    meterModel: "EM6400NG",
    companyName: "Acme Corporation",
    assignedDate: "2023-02-10T11:45:00Z",
    location: "Office Building, Floor 2",
    status: "inactive",
  },
]

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.meterSerialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meter Assignments</h1>
          <p className="text-muted-foreground">Manage smart meter assignments to companies</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assignments..."
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
              <TableHead>Meter Serial</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.meterSerialNumber}</TableCell>
                <TableCell>{assignment.meterManufacturer}</TableCell>
                <TableCell>{assignment.companyName}</TableCell>
                <TableCell>{assignment.location}</TableCell>
                <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                    {assignment.status === "active" ? "Active" : "Inactive"}
                  </Badge>
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

