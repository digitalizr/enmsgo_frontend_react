"use client"

import { useState } from "react"
import { CircuitBoard, Plus, Search, MoreHorizontal, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react"
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<any>(null)

  const filteredMeters = smartMeters.filter(
    (meter) =>
      meter.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (meter: any) => {
    setSelectedMeter(meter)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (meter: any) => {
    setSelectedMeter(meter)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Meters</h1>
          <p className="text-muted-foreground">Manage your smart meter inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Smart Meter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Smart Meter</DialogTitle>
              <DialogDescription>
                Enter the details of the new smart meter to add it to your inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" placeholder="Enter serial number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elmeasure">Elmeasure</SelectItem>
                    <SelectItem value="huawei">Huawei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Enter model" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Smart Meter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            <SelectItem value="elmeasure">Elmeasure</SelectItem>
            <SelectItem value="huawei">Huawei</SelectItem>
          </SelectContent>
        </Select>
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
                      <DropdownMenuItem onClick={() => handleEdit(meter)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(meter)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CircuitBoard className="mr-2 h-4 w-4" />
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
            <DialogTitle>Edit Smart Meter</DialogTitle>
            <DialogDescription>Update the details of the selected smart meter.</DialogDescription>
          </DialogHeader>
          {selectedMeter && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-serialNumber">Serial Number</Label>
                <Input id="edit-serialNumber" defaultValue={selectedMeter.serialNumber} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Select defaultValue={selectedMeter.manufacturer.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elmeasure">Elmeasure</SelectItem>
                    <SelectItem value="huawei">Huawei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input id="edit-model" defaultValue={selectedMeter.model} />
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
            <DialogTitle>Delete Smart Meter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this smart meter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMeter && (
            <div className="py-4">
              <p className="mb-2">You are about to delete the following smart meter:</p>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>Serial Number:</strong> {selectedMeter.serialNumber}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {selectedMeter.manufacturer}
                </p>
                <p>
                  <strong>Model:</strong> {selectedMeter.model}
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

