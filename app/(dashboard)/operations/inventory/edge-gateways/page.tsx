"use client"

import { useState } from "react"
import { Server, Plus, Search, MoreHorizontal, CheckCircle, XCircle, Pencil, Trash2, InfoIcon } from "lucide-react"
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
const edgeGateways = [
  {
    id: "EG001",
    serialNumber: "EGDC-12345",
    model: "EdgeConnect Pro",
    manufacturer: "Cisco",
    status: "available",
    lastSeen: null,
    assigned: false,
    assignedTo: null,
  },
  {
    id: "EG002",
    serialNumber: "EGDC-23456",
    model: "EdgeConnect Pro",
    manufacturer: "Cisco",
    status: "assigned",
    lastSeen: "2023-03-01T12:35:00Z",
    assigned: true,
    assignedTo: "TechCorp",
  },
  {
    id: "EG003",
    serialNumber: "EGIOT-34567",
    model: "IoT Gateway 500",
    manufacturer: "Dell",
    status: "maintenance",
    lastSeen: "2023-02-28T10:15:00Z",
    assigned: false,
    assignedTo: null,
  },
  {
    id: "EG004",
    serialNumber: "EGIOT-45678",
    model: "IoT Gateway 500",
    manufacturer: "Dell",
    status: "assigned",
    lastSeen: "2023-03-01T12:40:00Z",
    assigned: true,
    assignedTo: "GlobalTech Industries",
  },
  {
    id: "EG005",
    serialNumber: "EGDC-56789",
    model: "EdgeConnect Pro",
    manufacturer: "Cisco",
    status: "available",
    lastSeen: null,
    assigned: false,
    assignedTo: null,
  },
]

export default function EdgeGatewaysPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredGateways = edgeGateways.filter((gateway) => {
    const matchesSearch =
      gateway.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || gateway.status === activeTab

    return matchesSearch && matchesTab
  })

  const handleEdit = (gateway: any) => {
    setSelectedGateway(gateway)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (gateway: any) => {
    setSelectedGateway(gateway)
    setIsDeleteDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-500"
      case "assigned":
        return "text-blue-500"
      case "maintenance":
        return "text-amber-500"
      case "decommissioned":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Edge Gateways</h1>
          <p className="text-muted-foreground">Manage your edge gateway inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Edge Gateway
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Edge Gateway</DialogTitle>
              <DialogDescription>
                Enter the details of the new edge gateway to add it to your inventory.
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
                    <SelectItem value="cisco">Cisco</SelectItem>
                    <SelectItem value="dell">Dell</SelectItem>
                    <SelectItem value="hp">HP</SelectItem>
                    <SelectItem value="ibm">IBM</SelectItem>
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
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Edge Gateway</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Edge Gateways</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeGateways.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeGateways.filter((g) => g.status === "available").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeGateways.filter((g) => g.status === "assigned").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <XCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeGateways.filter((g) => g.status === "maintenance").length}</div>
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
              placeholder="Search gateways..."
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
                    {filteredGateways.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No edge gateways found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell className="font-medium">{gateway.serialNumber}</TableCell>
                          <TableCell>{gateway.manufacturer}</TableCell>
                          <TableCell>{gateway.model}</TableCell>
                          <TableCell>{getStatusBadge(gateway.status)}</TableCell>
                          <TableCell>
                            {gateway.assigned ? (
                              <Badge variant="outline" className="bg-primary/10">
                                {gateway.assignedTo}
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
                                <DropdownMenuItem onClick={() => handleEdit(gateway)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(gateway)}>
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
            <DialogTitle>Edit Edge Gateway</DialogTitle>
            <DialogDescription>Update the details of the selected edge gateway.</DialogDescription>
          </DialogHeader>
          {selectedGateway && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-serialNumber">Serial Number</Label>
                <Input id="edit-serialNumber" defaultValue={selectedGateway.serialNumber} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Select defaultValue={selectedGateway.manufacturer.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cisco">Cisco</SelectItem>
                    <SelectItem value="dell">Dell</SelectItem>
                    <SelectItem value="hp">HP</SelectItem>
                    <SelectItem value="ibm">IBM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input id="edit-model" defaultValue={selectedGateway.model} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedGateway.status}>
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
            <DialogTitle>Delete Edge Gateway</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this edge gateway? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedGateway && (
            <div className="py-4">
              <p className="mb-2">You are about to delete the following edge gateway:</p>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>Serial Number:</strong> {selectedGateway.serialNumber}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {selectedGateway.manufacturer}
                </p>
                <p>
                  <strong>Model:</strong> {selectedGateway.model}
                </p>
                {selectedGateway.assigned && (
                  <p className="mt-2 text-destructive">
                    Warning: This edge gateway is currently assigned. Deleting it will remove the assignment.
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

