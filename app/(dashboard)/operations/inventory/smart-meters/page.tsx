"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertCircle, Plus, Search, Trash2, Edit, RotateCw } from "lucide-react"
import { smartMetersAPI, deviceModelsAPI } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function SmartMetersPage() {
  const { toast } = useToast()
  const [smartMeters, setSmartMeters] = useState([])
  const [deviceModels, setDeviceModels] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [modelsByManufacturer, setModelsByManufacturer] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    status: "all",
    meter_type: "all",
    search: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSmartMeter, setCurrentSmartMeter] = useState(null)
  const [formData, setFormData] = useState({
    serial_number: "",
    manufacturer: "",
    model_id: "",
    meter_type: "electricity",
    installation_date: "",
    notes: "",
  })

  // Fetch smart meters
  const fetchSmartMeters = async () => {
    try {
      setLoading(true)
      const response = await smartMetersAPI.getAll({
        limit: pagination.limit,
        offset: pagination.offset,
        status: filters.status !== "all" ? filters.status : undefined,
        meter_type: filters.meter_type !== "all" ? filters.meter_type : undefined,
        search: filters.search,
      })

      setSmartMeters(response.data.data)
      setPagination(response.data.pagination)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch smart meters")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch smart meters",
      })
      console.error("Error fetching smart meters:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch device models
  const fetchDeviceModels = async () => {
    try {
      const response = await deviceModelsAPI.getAll({
        device_type: "smart_meter",
      })

      const models = response.data.data
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
    } catch (err) {
      console.error("Error fetching device models:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch device models",
      })
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSmartMeters()
    fetchDeviceModels()
  }, [pagination.offset, pagination.limit, filters.status, filters.meter_type])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    // Reset pagination when searching
    setPagination((prev) => ({ ...prev, offset: 0 }))
    fetchSmartMeters()
  }

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle manufacturer change
  const handleManufacturerChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      manufacturer: value,
      model_id: "", // Reset model when manufacturer changes
    }))
  }

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle add smart meter
  const handleAddSmartMeter = async () => {
    try {
      await smartMetersAPI.create(formData)
      setIsAddDialogOpen(false)
      setFormData({
        serial_number: "",
        manufacturer: "",
        model_id: "",
        meter_type: "electricity",
        installation_date: "",
        notes: "",
      })
      fetchSmartMeters()
      toast({
        title: "Success",
        description: "Smart meter added successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to add smart meter",
      })
      console.error("Error adding smart meter:", err)
    }
  }

  // Handle edit smart meter
  const handleEditSmartMeter = async () => {
    try {
      await smartMetersAPI.update(currentSmartMeter.id, formData)
      setIsEditDialogOpen(false)
      setCurrentSmartMeter(null)
      fetchSmartMeters()
      toast({
        title: "Success",
        description: "Smart meter updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update smart meter",
      })
      console.error("Error updating smart meter:", err)
    }
  }

  // Handle delete smart meter
  const handleDeleteSmartMeter = async () => {
    try {
      await smartMetersAPI.delete(currentSmartMeter.id)
      setIsDeleteDialogOpen(false)
      setCurrentSmartMeter(null)
      fetchSmartMeters()
      toast({
        title: "Success",
        description: "Smart meter deleted successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete smart meter",
      })
      console.error("Error deleting smart meter:", err)
    }
  }

  // Open edit dialog
  const openEditDialog = (smartMeter) => {
    const model = deviceModels.find((m) => m.id === smartMeter.model_id)

    setCurrentSmartMeter(smartMeter)
    setFormData({
      serial_number: smartMeter.serial_number,
      manufacturer: model?.manufacturer || "",
      model_id: smartMeter.model_id.toString(),
      meter_type: smartMeter.meter_type,
      installation_date: smartMeter.installation_date || "",
      notes: smartMeter.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (smartMeter) => {
    setCurrentSmartMeter(smartMeter)
    setIsDeleteDialogOpen(true)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Available
          </Badge>
        )
      case "assigned":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Assigned
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Maintenance
          </Badge>
        )
      case "decommissioned":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Decommissioned
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Smart Meters</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Smart Meter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart Meters Inventory</CardTitle>
          <CardDescription>
            Manage your smart meters inventory, view status, and perform maintenance operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search by serial number..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </form>
            </div>
            <div className="flex flex-row gap-2">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-[180px]">
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

              <Select value={filters.meter_type} onValueChange={(value) => handleFilterChange("meter_type", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="heat">Heat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RotateCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Installation Date</TableHead>
                      <TableHead>Last Calibration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smartMeters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          No smart meters found
                        </TableCell>
                      </TableRow>
                    ) : (
                      smartMeters.map((meter) => (
                        <TableRow key={meter.id}>
                          <TableCell className="font-medium">{meter.serial_number}</TableCell>
                          <TableCell>
                            {meter.model?.manufacturer} {meter.model?.model_name}
                          </TableCell>
                          <TableCell className="capitalize">{meter.meter_type}</TableCell>
                          <TableCell>{getStatusBadge(meter.status)}</TableCell>
                          <TableCell>{meter.installation_date || "N/A"}</TableCell>
                          <TableCell>
                            {meter.last_calibration_date || "N/A"}
                            {meter.calibration_due_date && new Date(meter.calibration_due_date) < new Date() && (
                              <Badge variant="destructive" className="ml-2">
                                Overdue
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" onClick={() => openEditDialog(meter)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => openDeleteDialog(meter)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            offset: Math.max(0, prev.offset - prev.limit),
                          }))
                        }
                        disabled={pagination.offset === 0}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNumber = Math.min(
                        Math.max(1, Math.floor(pagination.offset / pagination.limit) + 1 - 2) + i,
                        pagination.pages,
                      )
                      const offset = (pageNumber - 1) * pagination.limit

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={pagination.offset === offset}
                            onClick={() => setPagination((prev) => ({ ...prev, offset }))}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    {pagination.pages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            offset: Math.min((pagination.pages - 1) * pagination.limit, prev.offset + prev.limit),
                          }))
                        }
                        disabled={pagination.offset + pagination.limit >= pagination.total}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Smart Meter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Smart Meter</DialogTitle>
            <DialogDescription>Enter the details of the new smart meter to add it to your inventory.</DialogDescription>
          </DialogHeader>
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
              <Label htmlFor="manufacturer" className="text-right">
                Manufacturer
              </Label>
              <Select value={formData.manufacturer} onValueChange={handleManufacturerChange}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model_id" className="text-right">
                Model
              </Label>
              <Select
                value={formData.model_id}
                onValueChange={(value) => handleSelectChange("model_id", value)}
                disabled={!formData.manufacturer}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meter_type" className="text-right">
                Meter Type
              </Label>
              <Select value={formData.meter_type} onValueChange={(value) => handleSelectChange("meter_type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="heat">Heat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="installation_date" className="text-right">
                Installation Date
              </Label>
              <Input
                id="installation_date"
                name="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSmartMeter} disabled={!formData.serial_number || !formData.model_id}>
              Add Smart Meter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Smart Meter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Smart Meter</DialogTitle>
            <DialogDescription>Update the details of the selected smart meter.</DialogDescription>
          </DialogHeader>
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
              <Label htmlFor="edit_manufacturer" className="text-right">
                Manufacturer
              </Label>
              <Select value={formData.manufacturer} onValueChange={handleManufacturerChange}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_model_id" className="text-right">
                Model
              </Label>
              <Select
                value={formData.model_id}
                onValueChange={(value) => handleSelectChange("model_id", value)}
                disabled={!formData.manufacturer}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_meter_type" className="text-right">
                Meter Type
              </Label>
              <Select value={formData.meter_type} onValueChange={(value) => handleSelectChange("meter_type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="heat">Heat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_installation_date" className="text-right">
                Installation Date
              </Label>
              <Input
                id="edit_installation_date"
                name="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_notes" className="text-right">
                Notes
              </Label>
              <Input
                id="edit_notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSmartMeter} disabled={!formData.serial_number || !formData.model_id}>
              Update Smart Meter
            </Button>
          </DialogFooter>
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
          {currentSmartMeter && (
            <div className="py-4">
              <p>
                <strong>Serial Number:</strong> {currentSmartMeter.serial_number}
              </p>
              <p>
                <strong>Model:</strong> {currentSmartMeter.model?.manufacturer} {currentSmartMeter.model?.model_name}
              </p>
              <p>
                <strong>Type:</strong> {currentSmartMeter.meter_type}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSmartMeter}>
              Delete Smart Meter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

