"use client"

import { useState, useEffect } from "react"
import {
  Network,
  Plus,
  Search,
  CircuitBoard,
  Server,
  User,
  Building,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { assignmentApi, userApi, edgeGatewayApi, smartMeterApi } from "@/services/api"

export default function AssignmentsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedEdgeGateway, setSelectedEdgeGateway] = useState(null)
  const [isAssignEdgeGatewayOpen, setIsAssignEdgeGatewayOpen] = useState(false)
  const [isAssignSmartMeterOpen, setIsAssignSmartMeterOpen] = useState(false)
  const [selectedSmartMeters, setSelectedSmartMeters] = useState([])
  const [assignments, setAssignments] = useState([])
  const [expandedUsers, setExpandedUsers] = useState([])
  const [expandedGateways, setExpandedGateways] = useState([])
  const [users, setUsers] = useState([])
  const [availableEdgeGateways, setAvailableEdgeGateways] = useState([])
  const [availableSmartMeters, setAvailableSmartMeters] = useState([])

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll()
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
    }
  }

  // Fetch available edge gateways from the API
  const fetchAvailableEdgeGateways = async () => {
    try {
      const response = await edgeGatewayApi.getAll({ status: "available" })
      setAvailableEdgeGateways(response.data)
    } catch (error) {
      console.error("Error fetching available edge gateways:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available edge gateways. Please try again.",
      })
    }
  }

  // Fetch available smart meters from the API
  const fetchAvailableSmartMeters = async () => {
    try {
      const response = await smartMeterApi.getAll({ status: "available" })
      setAvailableSmartMeters(response.data)
    } catch (error) {
      console.error("Error fetching available smart meters:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available smart meters. Please try again.",
      })
    }
  }

  // Fetch assignments from the API
  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await assignmentApi.getAll()
      setAssignments(response.data)
    } catch (error) {
      console.error("Error fetching assignments:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assignments. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchAvailableEdgeGateways(), fetchAssignments()])
    }
    fetchData()
  }, [])

  // Toggle user expansion
  const toggleUserExpansion = (userId) => {
    if (expandedUsers.includes(userId)) {
      setExpandedUsers(expandedUsers.filter((id) => id !== userId))
    } else {
      setExpandedUsers([...expandedUsers, userId])
    }
  }

  // Toggle gateway expansion
  const toggleGatewayExpansion = (gatewayId) => {
    if (expandedGateways.includes(gatewayId)) {
      setExpandedGateways(expandedGateways.filter((id) => id !== gatewayId))
    } else {
      setExpandedGateways([...expandedGateways, gatewayId])
      // Fetch available smart meters when expanding a gateway
      fetchAvailableSmartMeters()
    }
  }

  // Handle assigning edge gateway to user
  const handleAssignEdgeGateway = async () => {
    try {
      if (!selectedUser || !selectedEdgeGateway) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a user and an edge gateway.",
        })
        return
      }

      // Call the API to assign the edge gateway
      await assignmentApi.assignEdgeGateway(selectedUser, selectedEdgeGateway)

      // Refresh the data
      fetchAssignments()
      fetchAvailableEdgeGateways()

      // Reset selection and close dialog
      setSelectedEdgeGateway(null)
      setIsAssignEdgeGatewayOpen(false)

      toast({
        title: "Success",
        description: "Edge gateway assigned successfully.",
      })
    } catch (error) {
      console.error("Error assigning edge gateway:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign edge gateway. Please try again.",
      })
    }
  }

  // Handle assigning smart meters to edge gateway
  const handleAssignSmartMeters = async () => {
    try {
      if (!selectedUser || !selectedEdgeGateway || selectedSmartMeters.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a user, an edge gateway, and at least one smart meter.",
        })
        return
      }

      // Call the API to assign the smart meters
      await assignmentApi.assignSmartMeters(selectedEdgeGateway, selectedSmartMeters)

      // Refresh the data
      fetchAssignments()
      fetchAvailableSmartMeters()

      // Reset selection and close dialog
      setSelectedSmartMeters([])
      setIsAssignSmartMeterOpen(false)

      toast({
        title: "Success",
        description: "Smart meters assigned successfully.",
      })
    } catch (error) {
      console.error("Error assigning smart meters:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign smart meters. Please try again.",
      })
    }
  }

  // Handle smart meter checkbox change
  const handleSmartMeterChange = (meterId) => {
    if (selectedSmartMeters.includes(meterId)) {
      setSelectedSmartMeters(selectedSmartMeters.filter((id) => id !== meterId))
    } else {
      setSelectedSmartMeters([...selectedSmartMeters, meterId])
    }
  }

  // Handle removing edge gateway assignment
  const handleRemoveEdgeGateway = async (userId, gatewayId) => {
    try {
      // Call the API to remove the edge gateway assignment
      await assignmentApi.removeEdgeGateway(userId, gatewayId)

      // Refresh the data
      fetchAssignments()
      fetchAvailableEdgeGateways()

      toast({
        title: "Success",
        description: "Edge gateway assignment removed successfully.",
      })
    } catch (error) {
      console.error("Error removing edge gateway assignment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove edge gateway assignment. Please try again.",
      })
    }
  }

  // Handle removing smart meter assignment
  const handleRemoveSmartMeter = async (gatewayId, meterId) => {
    try {
      // Call the API to remove the smart meter assignment
      await assignmentApi.removeSmartMeter(gatewayId, meterId)

      // Refresh the data
      fetchAssignments()
      fetchAvailableSmartMeters()

      toast({
        title: "Success",
        description: "Smart meter assignment removed successfully.",
      })
    } catch (error) {
      console.error("Error removing smart meter assignment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove smart meter assignment. Please try again.",
      })
    }
  }

  // Get total counts
  const totalAssignedEdgeGateways = assignments.reduce((total, user) => total + user.edge_gateways?.length || 0, 0)

  const totalAssignedSmartMeters = assignments.reduce(
    (total, user) =>
      total +
        user.edge_gateways?.reduce((gatewayTotal, gateway) => gatewayTotal + gateway.smart_meters?.length || 0, 0) || 0,
    0,
  )

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Assignments</h1>
          <p className="text-muted-foreground">Manage device assignments to users, edge gateways, and smart meters</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">With assigned devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edge Gateways</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignedEdgeGateways}</div>
            <p className="text-xs text-muted-foreground">{availableEdgeGateways.length} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Meters</CardTitle>
            <CircuitBoard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignedSmartMeters}</div>
            <p className="text-xs text-muted-foreground">{availableSmartMeters.length} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(assignments.map((a) => a.company?.id)).size}</div>
            <p className="text-xs text-muted-foreground">With active devices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* User Selection Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between rounded-md border p-3 cursor-pointer transition-colors ${
                        selectedUser === user.id ? "bg-primary/10 border-primary/20" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <span className="text-xs text-muted-foreground">{user.company?.name}</span>
                      </div>
                      {selectedUser === user.id && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Assignment Actions Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Device Assignments</CardTitle>
            <div className="flex space-x-2">
              <Dialog open={isAssignEdgeGatewayOpen} onOpenChange={setIsAssignEdgeGatewayOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedUser}>
                    <Server className="mr-2 h-4 w-4" />
                    Assign Edge Gateway
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Edge Gateway</DialogTitle>
                    <DialogDescription>Select an edge gateway to assign to the selected user.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label className="mb-2 block">Available Edge Gateways</Label>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <div className="p-4 space-y-2">
                        {availableEdgeGateways.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">No available edge gateways</p>
                        ) : (
                          availableEdgeGateways.map((gateway) => (
                            <div
                              key={gateway.id}
                              className={`flex items-center justify-between rounded-md border p-3 cursor-pointer transition-colors ${
                                selectedEdgeGateway === gateway.id
                                  ? "bg-primary/10 border-primary/20"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setSelectedEdgeGateway(gateway.id)}
                            >
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <Server className="mr-2 h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{gateway.model?.model_name || "Unknown"}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Serial: {gateway.serial_number}</span>
                              </div>
                              {selectedEdgeGateway === gateway.id && <CheckCircle className="h-5 w-5 text-primary" />}
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignEdgeGatewayOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignEdgeGateway} disabled={!selectedEdgeGateway}>
                      Assign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isAssignSmartMeterOpen} onOpenChange={setIsAssignSmartMeterOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Smart Meters</DialogTitle>
                    <DialogDescription>Select smart meters to assign to the selected edge gateway.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label className="mb-2 block">Available Smart Meters</Label>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <div className="p-4 space-y-2">
                        {availableSmartMeters.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">No available smart meters</p>
                        ) : (
                          availableSmartMeters.map((meter) => (
                            <div key={meter.id} className="flex items-center justify-between rounded-md border p-3">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`meter-${meter.id}`}
                                  checked={selectedSmartMeters.includes(meter.id)}
                                  onCheckedChange={() => handleSmartMeterChange(meter.id)}
                                />
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                    <Label htmlFor={`meter-${meter.id}`} className="font-medium">
                                      {meter.model?.model_name || "Unknown"}
                                    </Label>
                                  </div>
                                  <span className="text-sm text-muted-foreground">Serial: {meter.serial_number}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignSmartMeterOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignSmartMeters} disabled={selectedSmartMeters.length === 0}>
                      Assign Selected ({selectedSmartMeters.length})
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : assignments.length === 0 ? (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center text-center">
                  <Network className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Assignments</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Select a user and assign devices to get started.</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Collapsible
                      key={assignment.user_id}
                      open={expandedUsers.includes(assignment.user_id)}
                      className={`rounded-md border ${selectedUser === assignment.user_id ? "border-primary/50" : ""}`}
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <CollapsibleTrigger
                            onClick={() => toggleUserExpansion(assignment.user_id)}
                            className="flex items-center"
                          >
                            {expandedUsers.includes(assignment.user_id) ? (
                              <ChevronDown className="mr-2 h-4 w-4" />
                            ) : (
                              <ChevronRight className="mr-2 h-4 w-4" />
                            )}
                            <User className="mr-2 h-4 w-4" />
                            <div>
                              <span className="font-medium">{assignment.user?.name}</span>
                              <span className="ml-2 text-sm text-muted-foreground">({assignment.company?.name})</span>
                            </div>
                          </CollapsibleTrigger>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="ml-2">
                            {assignment.edge_gateways?.length || 0} Gateways
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {assignment.edge_gateways?.reduce(
                              (total, gateway) => total + gateway.smart_meters?.length || 0,
                              0,
                            ) || 0}{" "}
                            Meters
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(assignment.user_id)
                              setIsAssignEdgeGatewayOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="space-y-2 p-4 pt-0">
                          {!assignment.edge_gateways || assignment.edge_gateways.length === 0 ? (
                            <div className="rounded-md border border-dashed p-4 text-center">
                              <p className="text-sm text-muted-foreground">No edge gateways assigned</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setSelectedUser(assignment.user_id)
                                  setIsAssignEdgeGatewayOpen(true)
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Assign Edge Gateway
                              </Button>
                            </div>
                          ) : (
                            assignment.edge_gateways.map((gateway) => (
                              <Collapsible
                                key={gateway.id}
                                open={expandedGateways.includes(gateway.id)}
                                className="rounded-md border"
                              >
                                <div className="flex items-center justify-between p-3">
                                  <div className="flex items-center">
                                    <CollapsibleTrigger
                                      onClick={() => toggleGatewayExpansion(gateway.id)}
                                      className="flex items-center"
                                    >
                                      {expandedGateways.includes(gateway.id) ? (
                                        <ChevronDown className="mr-2 h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                      )}
                                      <Server className="mr-2 h-4 w-4 text-blue-500" />
                                      <div>
                                        <span className="font-medium">{gateway.model?.model_name || "Unknown"}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">
                                          ({gateway.serial_number})
                                        </span>
                                      </div>
                                    </CollapsibleTrigger>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{gateway.smart_meters?.length || 0} Meters</Badge>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUser(assignment.user_id)
                                        setSelectedEdgeGateway(gateway.id)
                                        setIsAssignSmartMeterOpen(true)
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => handleRemoveEdgeGateway(assignment.user_id, gateway.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <CollapsibleContent>
                                  <div className="space-y-2 p-3 pt-0">
                                    {!gateway.smart_meters || gateway.smart_meters.length === 0 ? (
                                      <div className="rounded-md border border-dashed p-3 text-center">
                                        <p className="text-sm text-muted-foreground">No smart meters assigned</p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => {
                                            setSelectedUser(assignment.user_id)
                                            setSelectedEdgeGateway(gateway.id)
                                            setIsAssignSmartMeterOpen(true)
                                          }}
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Assign Smart Meters
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="rounded-md border">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Smart Meter</TableHead>
                                              <TableHead>Serial Number</TableHead>
                                              <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {gateway.smart_meters.map((meter) => (
                                              <TableRow key={meter.id}>
                                                <TableCell>
                                                  <div className="flex items-center">
                                                    <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                                    <span>{meter.model?.model_name || "Unknown"}</span>
                                                  </div>
                                                </TableCell>
                                                <TableCell>{meter.serial_number}</TableCell>
                                                <TableCell className="text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveSmartMeter(gateway.id, meter.id)}
                                                  >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Edge Gateways</TableHead>
                  <TableHead>Smart Meters</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.user_id}>
                      <TableCell className="font-medium">{assignment.user?.name}</TableCell>
                      <TableCell>{assignment.company?.name}</TableCell>
                      <TableCell>{assignment.edge_gateways?.length || 0}</TableCell>
                      <TableCell>
                        {assignment.edge_gateways?.reduce(
                          (total, gateway) => total + gateway.smart_meters?.length || 0,
                          0,
                        ) || 0}
                      </TableCell>
                      <TableCell>
                        {assignment.edge_gateways?.length > 0 ? (
                          <Badge variant="default" className="bg-green-500">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

