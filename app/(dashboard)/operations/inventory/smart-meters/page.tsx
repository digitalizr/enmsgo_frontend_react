"use client"

import { useState } from "react"
import {
  CircuitBoard,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  InfoIcon,
} from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const smartMeters = [
  {
    id: "SM001",
    serialNumber: "EM6400-12345",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "available",
    lastSeen: null,
    assigned: false,
    assignedTo: null,
  },
  {
    id: "SM002",
    serialNumber: "EM6400-23456",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "assigned",
    lastSeen: "2023-03-01T12:35:00Z",
    assigned: true,
    assignedTo: "TechCorp",
  },
  {
    id: "SM003",
    serialNumber: "DTSU666-34567",
    manufacturer: "Huawei",
    model: "DTSU666-H",
    status: "maintenance",
    lastSeen: "2023-02-28T10:15:00Z",
    assigned: false,
    assignedTo: null,
  },
  {
    id: "SM004",
    serialNumber: "DTSU666-45678",
    manufacturer: "Huawei",
    model: "DTSU666-H",
    status: "assigned",
    lastSeen: "2023-03-01T12:40:00Z",
    assigned: true,
    assignedTo: "GlobalTech Industries",
  },
  {
    id: "SM005",
    serialNumber: "EM6400-56789",
    manufacturer: "Elmeasure",
    model: "EM6400NG",
    status: "available",
    lastSeen: null,
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
  const [activeTab, setActiveTab] = useState("all")

  const filteredMeters = smartMeters.filter((meter) => {
    const matchesSearch =
      meter.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || meter.status === activeTab

    return matchesSearch && matchesTab
  })

  const handleEdit = (meter: any) => {
    setSelectedMeter(meter)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (meter: any) => {
    setSelectedMeter(meter)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "assigned":
        return <Badge className="bg-blue-500">Assigned</Badge>
      case "maintenance":
        return <Badge className="bg-amber-500">Maintenance</Badge>
      case "decommissioned":
        return <Badge className="bg-red-500">Decommissioned</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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
                    <SelectItem value="schneider">Schneider Electric</SelectItem>
                    <SelectItem value="siemens">Siemens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Enter model" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="available">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="decommissioned">Decommissioned</SelectItem>
                  </SelectContent>
                </Select>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Smart Meters</CardTitle>
            <CircuitBoard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartMeters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartMeters.filter((m) => m.status === "available").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <CircuitBoard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartMeters.filter((m) => m.status === "assigned").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <XCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartMeters.filter((m) => m.status === "maintenance").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="decommissioned">Decommissioned</TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meters..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0 pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No smart meters found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMeters.map((meter) => (
                        <TableRow key={meter.id}>
                          <TableCell className="font-medium">{meter.serialNumber}</TableCell>
                          <TableCell>{meter.manufacturer}</TableCell>
                          <TableCell>{meter.model}</TableCell>
                          <TableCell>{getStatusBadge(meter.status)}</TableCell>
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
                                  <InfoIcon className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="available" className="mt-0">
          {/* Content for available tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="assigned" className="mt-0">
          {/* Content for assigned tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="maintenance" className="mt-0">
          {/* Content for maintenance tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="decommissioned" className="mt-0">
          {/* Content for decommissioned tab - the base content will show filtered results */}
        </TabsContent>
      </Tabs>

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
                    <SelectItem value="schneider">Schneider Electric</SelectItem>
                    <SelectItem value="siemens">Siemens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input id="edit-model" defaultValue={selectedMeter.model} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedMeter.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="decommissioned">Decommissioned</SelectItem>
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
                {selectedMeter.assigned && (
                  <p className="mt-2 text-destructive">
                    Warning: This smart meter is currently assigned. Deleting it will remove the assignment.
                  </p>
                )}
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

