"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus, Search, Trash2, Edit, RotateCw, Network, Cpu, Terminal } from "lucide-react"
import { edgeGatewaysAPI, deviceModelsAPI, manufacturersAPI } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function EdgeGatewaysPage() {
  const { toast } = useToast()
  const [edgeGateways, setEdgeGateways] = useState([])
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
    search: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isIpDialogOpen, setIsIpDialogOpen] = useState(false)
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false)
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [currentGateway, setCurrentGateway] = useState(null)
  const [ipAddresses, setIpAddresses] = useState([])
  const [newIpAddress, setNewIpAddress] = useState({ ip_address: "", port: "" })
  const [formData, setFormData] = useState({
    serial_number: "",
    manufacturer: "",
    model_id: "",
    mac_address: "",
    firmware_version: "",
    notes: "",
  })
  const [specsData, setSpecsData] = useState({
    os: "",
    os_version: "",
    cpu: "",
    memory: "",
    storage: "",
    connectivity: [],
    additional_specs: "",
  })
  const [connectionData, setConnectionData] = useState({
    ssh_username: "",
    ssh_password: "",
    ssh_key: "",
    web_interface_url: "",
    web_username: "",
    web_password: "",
    api_key: "",
    notes: "",
  })

  // Fetch edge gateways
  const fetchEdgeGateways = async () => {
    try {
      setLoading(true)
      const response = await edgeGatewaysAPI.getAll({
        limit: pagination.limit,
        offset: pagination.offset,
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search,
      })

      setEdgeGateways(response.data)
      setPagination(response.pagination)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch edge gateways")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch edge gateways",
      })
      console.error("Error fetching edge gateways:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch manufacturers
  const fetchManufacturers = async () => {
    try {
      const response = await manufacturersAPI.getAll()
      setManufacturers(response.data || [])
    } catch (err) {
      console.error("Error fetching manufacturers:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch manufacturers",
      })
    }
  }

  // Fetch device models
  const fetchDeviceModels = async () => {
    try {
      const response = await deviceModelsAPI.getAll({
        device_type: "edge_gateway",
      })

      const models = response.data
      setDeviceModels(models)

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

  // Fetch IP addresses for a gateway
  const fetchIpAddresses = async (gatewayId) => {
    try {
      const response = await edgeGatewaysAPI.getIpAddresses(gatewayId)
      setIpAddresses(response.data)
    } catch (err) {
      console.error("Error fetching IP addresses:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch IP addresses",
      })
    }
  }

  // Fetch specifications for a gateway
  const fetchSpecifications = async (gatewayId) => {
    try {
      const response = await edgeGatewaysAPI.getSpecifications(gatewayId)
      setSpecsData(
        response.data || {
          os: "",
          os_version: "",
          cpu: "",
          memory: "",
          storage: "",
          connectivity: [],
          additional_specs: "",
        },
      )
    } catch (err) {
      console.error("Error fetching specifications:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch specifications",
      })
    }
  }

  // Fetch connection details for a gateway
  const fetchConnectionDetails = async (gatewayId) => {
    try {
      const response = await edgeGatewaysAPI.getConnectionDetails(gatewayId)
      setConnectionData(
        response.data || {
          ssh_username: "",
          ssh_password: "",
          ssh_key: "",
          web_interface_url: "",
          web_username: "",
          web_password: "",
          api_key: "",
          notes: "",
        },
      )
    } catch (err) {
      console.error("Error fetching connection details:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection details",
      })
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchEdgeGateways()
    fetchManufacturers()
    fetchDeviceModels()
  }, [pagination.offset, pagination.limit, filters.status])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    // Reset pagination when searching
    setPagination((prev) => ({ ...prev, offset: 0 }))
    fetchEdgeGateways()
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

  // Handle specs input change
  const handleSpecsInputChange = (e) => {
    const { name, value } = e.target
    setSpecsData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle connectivity change
  const handleConnectivityChange = (value) => {
    setSpecsData((prev) => {
      const connectivity = [...prev.connectivity]

      if (connectivity.includes(value)) {
        return {
          ...prev,
          connectivity: connectivity.filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          connectivity: [...connectivity, value],
        }
      }
    })
  }

  // Handle connection input change
  const handleConnectionInputChange = (e) => {
    const { name, value } = e.target
    setConnectionData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle IP form input change
  const handleIpInputChange = (e) => {
    const { name, value } = e.target
    setNewIpAddress((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle add edge gateway
  const handleAddGateway = async () => {
    try {
      await edgeGatewaysAPI.create(formData)
      setIsAddDialogOpen(false)
      setFormData({
        serial_number: "",
        manufacturer: "",
        model_id: "",
        mac_address: "",
        firmware_version: "",
        notes: "",
      })
      fetchEdgeGateways()
      toast({
        title: "Success",
        description: "Edge gateway added successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add edge gateway",
      })
      console.error("Error adding edge gateway:", err)
    }
  }

  // Handle edit edge gateway
  const handleEditGateway = async () => {
    try {
      await edgeGatewaysAPI.update(currentGateway.id, formData)
      setIsEditDialogOpen(false)
      setCurrentGateway(null)
      fetchEdgeGateways()
      toast({
        title: "Success",
        description: "Edge gateway updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update edge gateway",
      })
      console.error("Error updating edge gateway:", err)
    }
  }

  // Handle update specifications
  const handleUpdateSpecs = async () => {
    try {
      await edgeGatewaysAPI.updateSpecifications(currentGateway.id, specsData)
      setIsSpecsDialogOpen(false)
      toast({
        title: "Success",
        description: "Specifications updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update specifications",
      })
      console.error("Error updating specifications:", err)
    }
  }

  // Handle update connection details
  const handleUpdateConnection = async () => {
    try {
      await edgeGatewaysAPI.updateConnectionDetails(currentGateway.id, connectionData)
      setIsConnectionDialogOpen(false)
      toast({
        title: "Success",
        description: "Connection details updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update connection details",
      })
      console.error("Error updating connection details:", err)
    }
  }

  // Handle delete edge gateway
  const handleDeleteGateway = async () => {
    try {
      await edgeGatewaysAPI.delete(currentGateway.id)
      setIsDeleteDialogOpen(false)
      setCurrentGateway(null)
      fetchEdgeGateways()
      toast({
        title: "Success",
        description: "Edge gateway deleted successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete edge gateway",
      })
      console.error("Error deleting edge gateway:", err)
    }
  }

  // Handle add IP address
  const handleAddIpAddress = async () => {
    try {
      await edgeGatewaysAPI.addIpAddress(currentGateway.id, {
        ip_address: newIpAddress.ip_address,
        port: Number.parseInt(newIpAddress.port),
      })
      setNewIpAddress({ ip_address: "", port: "" })
      fetchIpAddresses(currentGateway.id)
      toast({
        title: "Success",
        description: "IP address added successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add IP address",
      })
      console.error("Error adding IP address:", err)
    }
  }

  // Handle remove IP address
  const handleRemoveIpAddress = async (ipId) => {
    try {
      await edgeGatewaysAPI.removeIpAddress(currentGateway.id, ipId)
      fetchIpAddresses(currentGateway.id)
      toast({
        title: "Success",
        description: "IP address removed successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to remove IP address",
      })
      console.error("Error removing IP address:", err)
    }
  }

  // Open edit dialog
  const openEditDialog = (gateway) => {
    const model = deviceModels.find((m) => m.id === gateway.model_id)

    setCurrentGateway(gateway)
    setFormData({
      serial_number: gateway.serial_number,
      manufacturer: model?.manufacturer || "",
      model_id: gateway.model_id.toString(),
      mac_address: gateway.mac_address || "",
      firmware_version: gateway.firmware_version || "",
      notes: gateway.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (gateway) => {
    setCurrentGateway(gateway)
    setIsDeleteDialogOpen(true)
  }

  // Open IP addresses dialog
  const openIpDialog = (gateway) => {
    setCurrentGateway(gateway)
    fetchIpAddresses(gateway.id)
    setIsIpDialogOpen(true)
  }

  // Open specifications dialog
  const openSpecsDialog = (gateway) => {
    setCurrentGateway(gateway)
    fetchSpecifications(gateway.id)
    setIsSpecsDialogOpen(true)
  }

  // Open connection details dialog
  const openConnectionDialog = (gateway) => {
    setCurrentGateway(gateway)
    fetchConnectionDetails(gateway.id)
    setIsConnectionDialogOpen(true)
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
        <h1 className="text-3xl font-bold">Edge Gateways</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Edge Gateway
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edge Gateways Inventory</CardTitle>
          <CardDescription>
            Manage your edge gateways inventory, view status, and configure network settings.
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
                      <TableHead>MAC Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Firmware</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {edgeGateways.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          No edge gateways found
                        </TableCell>
                      </TableRow>
                    ) : (
                      edgeGateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell className="font-medium">{gateway.serial_number}</TableCell>
                          <TableCell>
                            {gateway.model?.manufacturer} {gateway.model?.model_name}
                          </TableCell>
                          <TableCell>{gateway.mac_address || "N/A"}</TableCell>
                          <TableCell>{getStatusBadge(gateway.status)}</TableCell>
                          <TableCell>{gateway.firmware_version || "N/A"}</TableCell>
                          <TableCell>
                            {gateway.last_seen ? new Date(gateway.last_seen).toLocaleString() : "Never"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openIpDialog(gateway)}
                                title="IP Addresses"
                              >
                                <Network className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openSpecsDialog(gateway)}
                                title="Specifications"
                              >
                                <Cpu className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openConnectionDialog(gateway)}
                                title="Connection Details"
                              >
                                <Terminal className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditDialog(gateway)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openDeleteDialog(gateway)}
                                title="Delete"
                              >
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

      {/* Add Edge Gateway Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Edge Gateway</DialogTitle>
            <DialogDescription>
              Enter the details of the new edge gateway to add it to your inventory.
            </DialogDescription>
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
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
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
              <Label htmlFor="mac_address" className="text-right">
                MAC Address
              </Label>
              <Input
                id="mac_address"
                name="mac_address"
                value={formData.mac_address}
                onChange={handleInputChange}
                placeholder="XX:XX:XX:XX:XX:XX"
                className="col-span-3"
              />
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
            <Button onClick={handleAddGateway} disabled={!formData.serial_number || !formData.model_id}>
              Add Edge Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Edge Gateway Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Edge Gateway</DialogTitle>
            <DialogDescription>Update the details of the selected edge gateway.</DialogDescription>
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
              <Label htmlFor="edit_mac_address" className="text-right">
                MAC Address
              </Label>
              <Input
                id="edit_mac_address"
                name="mac_address"
                value={formData.mac_address}
                onChange={handleInputChange}
                placeholder="XX:XX:XX:XX:XX:XX"
                className="col-span-3"
              />
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
            <Button onClick={handleEditGateway} disabled={!formData.serial_number || !formData.model_id}>
              Update Edge Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Edge Gateway Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this edge gateway? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentGateway && (
            <div className="py-4">
              <p>
                <strong>Serial Number:</strong> {currentGateway.serial_number}
              </p>
              <p>
                <strong>Model:</strong> {currentGateway.model?.manufacturer} {currentGateway.model?.model_name}
              </p>
              <p>
                <strong>MAC Address:</strong> {currentGateway.mac_address || "N/A"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGateway}>
              Delete Edge Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IP Addresses Dialog */}
      <Dialog open={isIpDialogOpen} onOpenChange={setIsIpDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>IP Addresses Configuration</DialogTitle>
            <DialogDescription>Manage IP addresses for the selected edge gateway.</DialogDescription>
          </DialogHeader>
          {currentGateway && (
            <div className="py-4">
              <div className="mb-4">
                <p>
                  <strong>Gateway:</strong> {currentGateway.serial_number}
                </p>
                <p>
                  <strong>Model:</strong> {currentGateway.model?.manufacturer} {currentGateway.model?.model_name}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current IP Addresses</h3>
                {ipAddresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No IP addresses configured</p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Port</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ipAddresses.map((ip) => (
                          <TableRow key={ip.id}>
                            <TableCell>{ip.ip_address}</TableCell>
                            <TableCell>{ip.port}</TableCell>
                            <TableCell>
                              {ip.is_active ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="icon" onClick={() => handleRemoveIpAddress(ip.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Add New IP Address</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="ip_address">IP Address</Label>
                      <Input
                        id="ip_address"
                        name="ip_address"
                        value={newIpAddress.ip_address}
                        onChange={handleIpInputChange}
                        placeholder="192.168.1.100"
                        className="mt-1"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor="port">Port</Label>
                      <Input
                        id="port"
                        name="port"
                        type="number"
                        value={newIpAddress.port}
                        onChange={handleIpInputChange}
                        placeholder="8080"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddIpAddress} disabled={!newIpAddress.ip_address || !newIpAddress.port}>
                        Add IP
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsIpDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Technical Specifications Dialog */}
      <Dialog open={isSpecsDialogOpen} onOpenChange={setIsSpecsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Technical Specifications</DialogTitle>
            <DialogDescription>Manage technical specifications for the selected edge gateway.</DialogDescription>
          </DialogHeader>
          {currentGateway && (
            <div className="py-4">
              <div className="mb-4">
                <p>
                  <strong>Gateway:</strong> {currentGateway.serial_number}
                </p>
                <p>
                  <strong>Model:</strong> {currentGateway.model?.manufacturer} {currentGateway.model?.model_name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="os">Operating System</Label>
                    <Input
                      id="os"
                      name="os"
                      value={specsData.os}
                      onChange={handleSpecsInputChange}
                      placeholder="e.g., Linux, Windows IoT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="os_version">OS Version</Label>
                    <Input
                      id="os_version"
                      name="os_version"
                      value={specsData.os_version}
                      onChange={handleSpecsInputChange}
                      placeholder="e.g., Ubuntu 20.04, Windows 10 IoT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpu">CPU</Label>
                    <Input
                      id="cpu"
                      name="cpu"
                      value={specsData.cpu}
                      onChange={handleSpecsInputChange}
                      placeholder="e.g., Intel Atom x7-E3950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memory">Memory</Label>
                    <Input
                      id="memory"
                      name="memory"
                      value={specsData.memory}
                      onChange={handleSpecsInputChange}
                      placeholder="e.g., 8GB DDR4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    name="storage"
                    value={specsData.storage}
                    onChange={handleSpecsInputChange}
                    placeholder="e.g., 128GB SSD"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Connectivity</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ethernet"
                        checked={specsData.connectivity?.includes("Ethernet")}
                        onChange={() => handleConnectivityChange("Ethernet")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="ethernet" className="font-normal">
                        Ethernet
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="wifi"
                        checked={specsData.connectivity?.includes("WiFi")}
                        onChange={() => handleConnectivityChange("WiFi")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="wifi" className="font-normal">
                        WiFi
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="bluetooth"
                        checked={specsData.connectivity?.includes("Bluetooth")}
                        onChange={() => handleConnectivityChange("Bluetooth")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="bluetooth" className="font-normal">
                        Bluetooth
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="cellular"
                        checked={specsData.connectivity?.includes("Cellular")}
                        onChange={() => handleConnectivityChange("Cellular")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="cellular" className="font-normal">
                        Cellular (4G/5G)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="zigbee"
                        checked={specsData.connectivity?.includes("Zigbee")}
                        onChange={() => handleConnectivityChange("Zigbee")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="zigbee" className="font-normal">
                        Zigbee
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="zwave"
                        checked={specsData.connectivity?.includes("Z-Wave")}
                        onChange={() => handleConnectivityChange("Z-Wave")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="zwave" className="font-normal">
                        Z-Wave
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_specs">Additional Specifications</Label>
                  <Textarea
                    id="additional_specs"
                    name="additional_specs"
                    value={specsData.additional_specs}
                    onChange={handleSpecsInputChange}
                    placeholder="Enter any additional specifications or notes"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSpecsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSpecs}>Save Specifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Details Dialog */}
      <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>Manage connection details for the selected edge gateway.</DialogDescription>
          </DialogHeader>
          {currentGateway && (
            <div className="py-4">
              <div className="mb-4">
                <p>
                  <strong>Gateway:</strong> {currentGateway.serial_number}
                </p>
                <p>
                  <strong>Model:</strong> {currentGateway.model?.manufacturer} {currentGateway.model?.model_name}
                </p>
              </div>

              <Tabs defaultValue="ssh" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ssh">SSH Access</TabsTrigger>
                  <TabsTrigger value="web">Web Interface</TabsTrigger>
                  <TabsTrigger value="api">API Access</TabsTrigger>
                </TabsList>

                <TabsContent value="ssh" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssh_username">SSH Username</Label>
                    <Input
                      id="ssh_username"
                      name="ssh_username"
                      value={connectionData.ssh_username}
                      onChange={handleConnectionInputChange}
                      placeholder="e.g., admin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssh_password">SSH Password</Label>
                    <Input
                      id="ssh_password"
                      name="ssh_password"
                      type="password"
                      value={connectionData.ssh_password}
                      onChange={handleConnectionInputChange}
                      placeholder="Enter SSH password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssh_key">SSH Key</Label>
                    <Textarea
                      id="ssh_key"
                      name="ssh_key"
                      value={connectionData.ssh_key}
                      onChange={handleConnectionInputChange}
                      placeholder="Paste SSH key here"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="web" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="web_interface_url">Web Interface URL</Label>
                    <Input
                      id="web_interface_url"
                      name="web_interface_url"
                      value={connectionData.web_interface_url}
                      onChange={handleConnectionInputChange}
                      placeholder="e.g., https://192.168.1.100:8443"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="web_username">Web Username</Label>
                    <Input
                      id="web_username"
                      name="web_username"
                      value={connectionData.web_username}
                      onChange={handleConnectionInputChange}
                      placeholder="e.g., admin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="web_password">Web Password</Label>
                    <Input
                      id="web_password"
                      name="web_password"
                      type="password"
                      value={connectionData.web_password}
                      onChange={handleConnectionInputChange}
                      placeholder="Enter web interface password"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      name="api_key"
                      value={connectionData.api_key}
                      onChange={handleConnectionInputChange}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Connection Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={connectionData.notes}
                      onChange={handleConnectionInputChange}
                      placeholder="Enter any additional connection notes or instructions"
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-800 text-sm">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Connection credentials are stored securely and encrypted in the database.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateConnection}>Save Connection Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

