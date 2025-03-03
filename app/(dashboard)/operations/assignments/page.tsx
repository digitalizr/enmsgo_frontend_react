"use client"

import { useState } from "react"
import { Zap, Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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

// Sample data for dropdowns
const availableMeters = [
  { id: "SM005", serialNumber: "EM6400-56789", manufacturer: "Elmeasure", model: "EM6400NG" },
  { id: "SM003", serialNumber: "DTSU666-34567", manufacturer: "Huawei", model: "DTSU666-H" },
]

const availableCompanies = [
  { id: "C001", name: "Acme Corporation" },
  { id: "C002", name: "TechCorp" },
  { id: "C003", name: "GlobalTech Industries" },
  { id: "C004", name: "Innovative Solutions" },
  { id: "C005", name: "Future Energy" },
]

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.meterSerialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (assignment: any) => {
    setSelectedAssignment(assignment)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (assignment: any) => {
    setSelectedAssignment(assignment)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meter Assignments</h1>
          <p className="text-muted-foreground">Manage smart meter assignments to companies</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Assign a smart meter to a company.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meter">Smart Meter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a smart meter" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMeters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id}>
                        {meter.serialNumber} ({meter.manufacturer} {meter.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Installation Location</Label>
                <Input id="location" placeholder="Enter installation location" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
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
                      <DropdownMenuItem onClick={() => handleEdit(assignment)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(assignment)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Zap className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Update the details of the selected meter assignment.</DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-meter">Smart Meter</Label>
                <Input id="edit-meter" defaultValue={selectedAssignment.meterSerialNumber} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input id="edit-company" defaultValue={selectedAssignment.companyName} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Installation Location</Label>
                <Input id="edit-location" defaultValue={selectedAssignment.location} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedAssignment.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="py-4">
              <p className="mb-2">You are about to delete the following assignment:</p>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>Meter:</strong> {selectedAssignment.meterSerialNumber}
                </p>
                <p>
                  <strong>Company:</strong> {selectedAssignment.companyName}
                </p>
                <p>
                  <strong>Location:</strong> {selectedAssignment.location}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

