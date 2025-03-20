"use client"

import { useState, useEffect } from "react"
import { CircuitBoard, Plus, Search, MoreHorizontal, CheckCircle, XCircle, Pencil, Trash2, Loader2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { smartMetersAPI, deviceModelsAPI } from "@/lib/api"

export default function SmartMetersPage() {
  const { toast } = useToast()
  const [smartMeters, setSmartMeters] = useState([])
  const [deviceModels, setDeviceModels] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [modelsByManufacturer, setModelsByManufacturer] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [manufacturerFilter, setManufacturerFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState(null)

  // Form state for adding/editing a smart meter
  const [formData, setFormData] = useState({
    serial_number: "",
    manufacturer: "",
    model_id: "",
    mac_address: "",
    firmware_version: "",
    notes: "",
  })

  // Fetch smart meters from the API
  const fetchSmartMeters = async () => {
    try {
      setLoading(true)
      // Prepare filter parameters
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== "all") params.status = statusFilter
      if (manufacturerFilter !== "all") params.manufacturer = manufacturerFilter

      // Call the API
      const response = await smartMetersAPI.getAll(params)
      setSmartMeters(response.data)
    } catch (error) {
      console.error("Error fetching smart meters:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch smart meters. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch device models from the API
  const fetchDeviceModels = async () => {
    try {
      // Call the API to get device models for smart meters
      const response = await deviceModelsAPI.getAll({ device_type: "smart_meter" })
      const models = response.data
      setDeviceModels(models)

      // Extract unique manufacturers
      const uniqueManufacturers = [...new Set(models.map((model) => model.manufacturer))]
      setManufacturers(uniqueManufacturers)

      // Group models by manufacturer
      const modelsByMfr = {}
      models.forEach((model) => {
        if (!modelsByMfr[model.manufacturer]) {
          modelsByMfr[model.manufacturer] = []
        }
        modelsByMfr[model.manufacturer].push(model)
      })
      setModelsByManufacturer(modelsByMfr)
    } catch (error) {
      console.error("Error fetching device models:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch device models. Please try again.",
      })
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchSmartMeters()
    fetchDeviceModels()
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    fetchSmartMeters()
  }, [statusFilter, manufacturerFilter])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    fetchSmartMeters()
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle manufacturer change
  const handleManufacturerChange = (value) => {
    setFormData({
      ...formData,
      manufacturer: value,
      model_id: "", // Reset model when manufacturer changes
    })
  }

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle add smart meter
  const handleAddMeter = async () => {
    try {
      // Validate form
      if (!formData.serial_number || !formData.model_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Serial number and model are required.",
        })
        return
      }

      // Call the API to create a new smart meter
      await smartMetersAPI.create(formData)

      // Close dialog and reset form
      setIsAddDialogOpen(false)
      setFormData({
        serial_number: "",
        manufacturer: "",
        model_id: "",
        mac_address: "",
        firmware_version: "",
        notes: "",
      })

      // Refresh the data
      fetchSmartMeters()

      toast({
        title: "Success",
        description: "Smart meter added successfully.",
      })
    } catch (error) {
      console.error("Error adding smart meter:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add smart meter. Please try again.",
      })
    }
  }

  // Handle edit smart meter
  const handleEditMeter = async () => {
    try {
      // Validate form
      if (!formData.serial_number || !formData.model_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Serial number and model are required.",
        })
        return
      }

      // Call the API to update the smart meter
      await smartMetersAPI.update(selectedMeter.id, formData)

      // Close dialog and reset selection
      setIsEditDialogOpen(false)
      setSelectedMeter(null)

      // Refresh the data
      fetchSmartMeters()

      toast({
        title: "Success",
        description: "Smart meter updated successfully.",
      })
    } catch (error) {
      console.error("Error updating smart meter:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update smart meter. Please try again.",
      })
    }
  }

  // Handle delete smart meter
  const handleDeleteMeter = async () => {
    try {
      // Call the API to delete the smart meter
      await smartMetersAPI.delete(selectedMeter.id)

      // Close dialog and reset selection
      setIsDeleteDialogOpen(false)
      setSelectedMeter(null)

      // Refresh the data
      fetchSmartMeters()

      toast({
        title: "Success",
        description: "Smart meter deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting smart meter:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete smart meter. Please try again.",
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (meter) => {
    // Find the model to get the manufacturer
    const model = deviceModels.find((m) => m.id === meter.model_id)

    setSelectedMeter(meter)
    setFormData({
      serial_number: meter.serial_number,
      manufacturer: model?.manufacturer || "",
      model_id: meter.model_id.toString(),
      mac_address: meter.mac_address || "",
      firmware_version: meter.firmware_version || "",
      notes: meter.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (meter) => {
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
                <Input
                  id="serialNumber"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Select value={formData.manufacturer} onValueChange={(value) => handleManufacturerChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model_id}
                  onValueChange={(value) => handleSelectChange("model_id", value)}
                  disabled={!formData.manufacturer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.manufacturer ? "Select model" : "Select manufacturer first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.manufacturer &&
                      modelsByManufacturer[formData.manufacturer]?.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.model_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mac_address">MAC Address (Optional)</Label>
                <Input
                  id="mac_address"
                  name="mac_address"
                  value={formData.mac_address}
                  onChange={handleInputChange}
                  placeholder="Enter MAC address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firmware_version">Firmware Version (Optional)</Label>
                <Input
                  id="firmware_version"
                  name="firmware_version"
                  value={formData.firmware_version}
                  onChange={handleInputChange}
                  placeholder="Enter firmware version"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeter}>Add Smart Meter</Button>
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
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {manufacturers.map((manufacturer) => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : smartMeters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No smart meters found.
                </TableCell>
              </TableRow>
            ) : (
              smartMeters.map((meter) => (
                <TableRow key={meter.id}>
                  <TableCell className="font-medium">{meter.serial_number}</TableCell>
                  <TableCell>{meter.model?.manufacturer || "Unknown"}</TableCell>
                  <TableCell>{meter.model?.model_name || "Unknown"}</TableCell>
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
                  <TableCell>{meter.last_seen ? new Date(meter.last_seen).toLocaleString() : "Never"}</TableCell>
                  <TableCell>
                    {meter.assigned_to ? (
                      <Badge variant="outline" className="bg-primary/10">
                        {meter.assigned_to.company?.name || "Unknown"}
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
                        <DropdownMenuItem onClick={() => openEditDialog(meter)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(meter)}>
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
              ))
            )}
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
                <Input
                  id="edit-serialNumber"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Select value={formData.manufacturer} onValueChange={(value) => handleManufacturerChange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Select
                  value={formData.model_id}
                  onValueChange={(value) => handleSelectChange("model_id", value)}
                  disabled={!formData.manufacturer}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.manufacturer &&
                      modelsByManufacturer[formData.manufacturer]?.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.model_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mac_address">MAC Address</Label>
                <Input
                  id="edit-mac_address"
                  name="mac_address"
                  value={formData.mac_address}
                  onChange={handleInputChange}
                  placeholder="Enter MAC address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-firmware_version">Firmware Version</Label>
                <Input
                  id="edit-firmware_version"
                  name="firmware_version"
                  value={formData.firmware_version}
                  onChange={handleInputChange}
                  placeholder="Enter firmware version"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMeter}>Save Changes</Button>
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
                  <strong>Serial Number:</strong> {selectedMeter.serial_number}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {selectedMeter.model?.manufacturer || "Unknown"}
                </p>
                <p>
                  <strong>Model:</strong> {selectedMeter.model?.model_name || "Unknown"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMeter}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
