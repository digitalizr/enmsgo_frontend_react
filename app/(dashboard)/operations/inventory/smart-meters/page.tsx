"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { smartMetersAPI, manufacturersAPI } from "@/services/api"
import { PlusCircle, Search, RefreshCw, Edit, Trash2 } from "lucide-react"
import { API_BASE_URL, authHeader } from "@/services/apiConfig"

export default function SmartMetersPage() {
  const router = useRouter()
  const [smartMeters, setSmartMeters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [manufacturers, setManufacturers] = useState([])
  const [models, setModels] = useState([])
  const [selectedManufacturer, setSelectedManufacturer] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSmartMeter, setCurrentSmartMeter] = useState(null)
  const [formData, setFormData] = useState({
    serial_number: "",
    manufacturer_id: "",
    model_id: "",
    firmware_version: "",
    communication_protocol: "",
    status: "available",
  })

  // Fetch smart meters
  const fetchSmartMeters = async () => {
    try {
      setLoading(true)
      const params = {}

      // Only add parameters if they have valid values
      if (statusFilter !== "all") params.status = statusFilter
      if (selectedManufacturer !== "all") params.manufacturer = selectedManufacturer
      if (searchQuery) params.search = searchQuery

      console.log("Fetching smart meters with params:", params)
      const response = await smartMetersAPI.getAll(params)
      console.log("Smart meters response:", response)

      setSmartMeters(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching smart meters:", err)
      setError("Failed to load smart meters. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch manufacturers
  const fetchManufacturers = async () => {
    try {
      setLoading(true)
      const response = await manufacturersAPI.getAll()
      console.log("Manufacturers response:", response)

      // Handle both response formats - either direct array or {data: [...]}
      if (Array.isArray(response)) {
        setManufacturers(response)
      } else if (response && response.data) {
        setManufacturers(response.data)
      } else {
        console.error("Invalid manufacturers response format:", response)
        setManufacturers([])
      }
    } catch (err) {
      console.error("Error fetching manufacturers:", err)
      setManufacturers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch models for a specific manufacturer
  const fetchModels = async (manufacturerId) => {
    if (!manufacturerId || manufacturerId === "all") {
      console.log("No manufacturer ID provided or 'all' selected, clearing models")
      setModels([])
      return
    }

    try {
      setLoading(true)
      console.log(`Fetching models for manufacturer ID: ${manufacturerId}`)

      // Verify that manufacturersAPI.getModels exists
      if (typeof manufacturersAPI.getModels !== "function") {
        console.error("manufacturersAPI.getModels is not a function!")
        console.log("Available methods on manufacturersAPI:", Object.keys(manufacturersAPI))
        throw new Error("getModels function not available")
      }

      const response = await manufacturersAPI.getModels(manufacturerId)
      console.log("Models response:", response)

      // Handle both response formats - either direct array or {data: [...]}
      if (Array.isArray(response)) {
        console.log(`Setting ${response.length} models from array response`)
        setModels(response)
      } else if (response && response.data) {
        console.log(`Setting ${response.data.length} models from data property`)
        setModels(response.data)
      } else {
        console.error("Invalid models response format:", response)
        setModels([])
      }
    } catch (err) {
      console.error("Error fetching models:", err)
      setModels([])
      // Show error message to user
      setError(`Failed to load models: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Add this function after the fetchModels function:

  // Fallback method to get models if API call fails
  const getModelsDirectly = async (manufacturerId) => {
    try {
      console.log(`Attempting direct fetch for models of manufacturer ${manufacturerId}`)
      const response = await fetch(`${API_BASE_URL}/manufacturers/${manufacturerId}/models`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log("Direct fetch models response:", data)
      return data
    } catch (error) {
      console.error("Error in direct fetch for models:", error)
      throw error
    }
  }

  // Update the handleManufacturerChange function to use the fallback if needed:
  const handleManufacturerChange = async (value) => {
    setFormData((prev) => ({ ...prev, manufacturer_id: value, model_id: "" }))

    try {
      await fetchModels(value)
    } catch (err) {
      console.log("Primary fetchModels failed, trying fallback method")
      try {
        const directModels = await getModelsDirectly(value)
        if (Array.isArray(directModels)) {
          setModels(directModels)
        } else if (directModels && directModels.data) {
          setModels(directModels.data)
        }
      } catch (fallbackErr) {
        console.error("Fallback method also failed:", fallbackErr)
        setError("Failed to load models. Please try again or contact support.")
      }
    }
  }

  const handleModelChange = (value) => {
    setFormData((prev) => ({ ...prev, model_id: value }))
  }

  // Initial data fetch
  useEffect(() => {
    fetchManufacturers()
    fetchSmartMeters()
  }, [])

  // Fetch smart meters when filters change
  useEffect(() => {
    fetchSmartMeters()
  }, [statusFilter, selectedManufacturer, searchQuery])

  // Add this useEffect to load manufacturers when the dialog opens
  useEffect(() => {
    if (isAddDialogOpen || isEditDialogOpen) {
      fetchManufacturers()
    }
  }, [isAddDialogOpen, isEditDialogOpen])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle status selection
  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  // Reset form data
  const resetFormData = () => {
    setFormData({
      serial_number: "",
      manufacturer_id: "",
      model_id: "",
      firmware_version: "",
      communication_protocol: "",
      status: "available",
    })
    setModels([])
  }

  // Handle add smart meter
  const handleAddSmartMeter = async (e) => {
    e.preventDefault()

    try {
      console.log("Adding smart meter with data:", formData)
      await smartMetersAPI.create(formData)
      setIsAddDialogOpen(false)
      resetFormData()
      fetchSmartMeters()
    } catch (err) {
      console.error("Error adding smart meter:", err)
      setError("Failed to add smart meter. Please try again.")
    }
  }

  // Handle edit smart meter
  const handleEditSmartMeter = async (e) => {
    e.preventDefault()

    try {
      console.log("Updating smart meter with data:", formData)
      await smartMetersAPI.update(currentSmartMeter.id, formData)
      setIsEditDialogOpen(false)
      resetFormData()
      fetchSmartMeters()
    } catch (err) {
      console.error("Error updating smart meter:", err)
      setError("Failed to update smart meter. Please try again.")
    }
  }

  // Handle delete smart meter
  const handleDeleteSmartMeter = async () => {
    try {
      console.log("Deleting smart meter with ID:", currentSmartMeter.id)
      await smartMetersAPI.delete(currentSmartMeter.id)
      setIsDeleteDialogOpen(false)
      fetchSmartMeters()
    } catch (err) {
      console.error("Error deleting smart meter:", err)
      setError("Failed to delete smart meter. Please try again.")
    }
  }

  // Open edit dialog
  const openEditDialog = (smartMeter) => {
    setCurrentSmartMeter(smartMeter)
    setFormData({
      serial_number: smartMeter.serial_number,
      manufacturer_id: smartMeter.manufacturer_id,
      model_id: smartMeter.model_id,
      firmware_version: smartMeter.firmware_version || "",
      communication_protocol: smartMeter.communication_protocol || "",
      status: smartMeter.status || "available",
    })
    fetchModels(smartMeter.manufacturer_id)
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (smartMeter) => {
    setCurrentSmartMeter(smartMeter)
    setIsDeleteDialogOpen(true)
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "assigned":
        return "bg-blue-500"
      case "maintenance":
        return "bg-yellow-500"
      case "decommissioned":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smart Meters</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Smart Meter
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by serial number or model..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                <SelectTrigger id="manufacturer">
                  <SelectValue placeholder="Filter by manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Manufacturers</SelectItem>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchSmartMeters} className="h-10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-4">Loading smart meters...</div>
          ) : smartMeters.length === 0 ? (
            <div className="text-center py-4">No smart meters found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Firmware Version</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smartMeters.map((meter) => (
                    <TableRow key={meter.id}>
                      <TableCell className="font-medium">{meter.serial_number}</TableCell>
                      <TableCell>{meter.model?.manufacturer || "N/A"}</TableCell>
                      <TableCell>{meter.model?.model_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(meter.status)}>{meter.status}</Badge>
                      </TableCell>
                      <TableCell>{meter.firmware_version || "N/A"}</TableCell>
                      <TableCell>{meter.assignedTo || "Not Assigned"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(meter)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(meter)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Smart Meter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Smart Meter</DialogTitle>
            <DialogDescription>Enter the details of the new smart meter.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSmartMeter}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serial_number" className="text-right">
                  Serial Number
                </Label>
                <Input
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manufacturer_id" className="text-right">
                  Manufacturer
                </Label>
                <div className="col-span-3">
                  <Select value={formData.manufacturer_id} onValueChange={handleManufacturerChange} required>
                    <SelectTrigger id="manufacturer_id">
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.length > 0 ? (
                        manufacturers.map((manufacturer) => (
                          <SelectItem key={manufacturer.id} value={manufacturer.id}>
                            {manufacturer.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-manufacturers" disabled>
                          No manufacturers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 mt-1">{manufacturers.length} manufacturers available</div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model_id" className="text-right">
                  Model
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.model_id}
                    onValueChange={handleModelChange}
                    disabled={!formData.manufacturer_id || formData.manufacturer_id === "all"}
                    required
                  >
                    <SelectTrigger id="model_id">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.length > 0 ? (
                        models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.model_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-models" disabled>
                          {formData.manufacturer_id ? "No models available" : "Select a manufacturer first"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 mt-1">{models.length} models available</div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firmware_version" className="text-right">
                  Firmware Version
                </Label>
                <Input
                  id="firmware_version"
                  name="firmware_version"
                  value={formData.firmware_version}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="communication_protocol" className="text-right">
                  Protocol
                </Label>
                <Input
                  id="communication_protocol"
                  name="communication_protocol"
                  value={formData.communication_protocol}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Smart Meter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Smart Meter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Smart Meter</DialogTitle>
            <DialogDescription>Update the details of the smart meter.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSmartMeter}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_serial_number" className="text-right">
                  Serial Number
                </Label>
                <Input
                  id="edit_serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_manufacturer_id" className="text-right">
                  Manufacturer
                </Label>
                <Select value={formData.manufacturer_id} onValueChange={handleManufacturerChange} required>
                  <SelectTrigger id="edit_manufacturer_id" className="col-span-3">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_model_id" className="text-right">
                  Model
                </Label>
                <Select
                  value={formData.model_id}
                  onValueChange={handleModelChange}
                  disabled={!formData.manufacturer_id}
                  required
                >
                  <SelectTrigger id="edit_model_id" className="col-span-3">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.model_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_firmware_version" className="text-right">
                  Firmware Version
                </Label>
                <Input
                  id="edit_firmware_version"
                  name="firmware_version"
                  value={formData.firmware_version}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_communication_protocol" className="text-right">
                  Protocol
                </Label>
                <Input
                  id="edit_communication_protocol"
                  name="communication_protocol"
                  value={formData.communication_protocol}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="edit_status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Smart Meter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Smart Meter Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this smart meter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSmartMeter}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

