"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  CircuitBoard,
  Server,
  User,
  Building,
  Trash2,
  CheckCircle,
  Loader2,
  UserCircle,
  Building2,
  LayoutGrid,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { assignmentsAPI, usersAPI, edgeGatewaysAPI, smartMetersAPI } from "@/services/api"

export default function AssignmentsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedEdgeGateway, setSelectedEdgeGateway] = useState(null)
  const [selectedSmartMeter, setSelectedSmartMeter] = useState(null)
  const [isAssignEdgeGatewayOpen, setIsAssignEdgeGatewayOpen] = useState(false)
  const [isAssignSmartMeterOpen, setIsAssignSmartMeterOpen] = useState(false)
  const [isAssignSmartMeterDirectOpen, setIsAssignSmartMeterDirectOpen] = useState(false)
  const [selectedSmartMeters, setSelectedSmartMeters] = useState([])
  const [assignments, setAssignments] = useState([])
  const [expandedUsers, setExpandedUsers] = useState([])
  const [expandedGateways, setExpandedGateways] = useState([])
  const [users, setUsers] = useState([])
  const [userCompanies, setUserCompanies] = useState({})
  const [availableEdgeGateways, setAvailableEdgeGateways] = useState([])
  const [availableSmartMeters, setAvailableSmartMeters] = useState([])
  const [activeTab, setActiveTab] = useState("users")

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll()
      setUsers(response.data)

      // Pre-fetch company relationships for all users
      for (const user of response.data) {
        fetchUserCompanies(user.id)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
    }
  }

  // Fetch user companies
  const fetchUserCompanies = async (userId) => {
    try {
      console.log(`Fetching company information for user: ${userId}`)
      const response = await usersAPI.getUserCompanyRelationships(userId)
      console.log(`Company data for user ${userId}:`, response.data)

      if (!response.data || response.data.length === 0) {
        console.warn(`No company relationships found for user ${userId}`)
      }

      setUserCompanies((prev) => ({
        ...prev,
        [userId]: response.data,
      }))
    } catch (error) {
      console.error(`Error fetching companies for user ${userId}:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user's company information.",
      })
    }
  }

  // Fetch available edge gateways from the API
  const fetchAvailableEdgeGateways = async () => {
    try {
      const response = await edgeGatewaysAPI.getAll({ status: "available" })
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
      const response = await smartMetersAPI.getAll({ status: "available" })
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
      const response = await assignmentsAPI.getAll()
      // Make sure we're setting an array even if the API returns null or undefined
      setAssignments(response?.data || [])
    } catch (error) {
      console.error("Error fetching assignments:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assignments. Please try again.",
      })
      // Set empty array on error
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchAvailableEdgeGateways(), fetchAssignments(), fetchAvailableSmartMeters()])
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

  // Get primary company for a user
  const getPrimaryCompanyForUser = (userId) => {
    if (!userCompanies[userId] || !userCompanies[userId].length) return null

    // Find primary company or use the first one
    const primaryCompany = userCompanies[userId].find((rel) => rel.is_primary) || userCompanies[userId][0]
    return primaryCompany
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

      // Log the selected user and gateway for debugging
      console.log(`Assigning edge gateway ${selectedEdgeGateway} to user ${selectedUser}`)

      // Check if we have company information for this user
      if (!userCompanies[selectedUser] || userCompanies[selectedUser].length === 0) {
        console.log("No company information found for user, fetching now...")
        await fetchUserCompanies(selectedUser)

        // Check again after fetching
        if (!userCompanies[selectedUser] || userCompanies[selectedUser].length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "User is not associated with any company. Please assign a company to this user first.",
          })
          return
        }
      }

      const userCompany = getPrimaryCompanyForUser(selectedUser)
      console.log("User company information:", userCompany)

      if (!userCompany || !userCompany.company || !userCompany.company.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not determine user's company. Please ensure the user is associated with a company.",
        })
        return
      }

      // Call the API to assign the edge gateway
      console.log("Calling API with parameters:", {
        companyId: userCompany.company.id,
        facilityId: userCompany.facility?.id || null,
        departmentId: userCompany.department?.id || null,
        gatewayId: selectedEdgeGateway,
      })

      await assignmentsAPI.assignEdgeGateway(selectedUser, selectedEdgeGateway)

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableEdgeGateways()])

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
      if (!selectedEdgeGateway || selectedSmartMeters.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an edge gateway and at least one smart meter.",
        })
        return
      }

      // Call the API to assign the smart meters
      await assignmentsAPI.assignSmartMeters(selectedEdgeGateway, selectedSmartMeters)

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableSmartMeters()])

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

  // Handle assigning smart meter directly to user
  const handleAssignSmartMeterDirect = async () => {
    try {
      if (!selectedUser || !selectedSmartMeter) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a user and a smart meter.",
        })
        return
      }

      const userCompany = getPrimaryCompanyForUser(selectedUser)

      if (!userCompany) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not associated with any company.",
        })
        return
      }

      // Create a new assignment for the smart meter
      const assignmentResponse = await assignmentsAPI.create({
        company_id: userCompany.company.id,
        facility_id: userCompany.facility?.id || null,
        department_id: userCompany.department?.id || null,
        smart_meter_id: selectedSmartMeter,
      })

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableSmartMeters()])

      // Reset selection and close dialog
      setSelectedSmartMeter(null)
      setIsAssignSmartMeterDirectOpen(false)

      toast({
        title: "Success",
        description: "Smart meter assigned successfully.",
      })
    } catch (error) {
      console.error("Error assigning smart meter:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign smart meter. Please try again.",
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
  const handleRemoveEdgeGateway = async (companyId, gatewayId) => {
    try {
      // Make sure we have a selected user
      if (!selectedUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user selected. Please select a user first.",
        })
        return
      }

      // Log the parameters for debugging
      console.log("Removing edge gateway with params:", {
        userId: selectedUser,
        gatewayId: gatewayId,
      })

      // Call the API with both userId and gatewayId
      await assignmentsAPI.removeEdgeGateway(selectedUser, gatewayId)

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableEdgeGateways()])

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
      await assignmentsAPI.removeSmartMeter(gatewayId, meterId)

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableSmartMeters()])

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

  // Handle removing directly assigned smart meter
  const handleRemoveDirectSmartMeter = async (assignmentId, meterId) => {
    try {
      // Call the API to delete the assignment
      await assignmentsAPI.delete(assignmentId)

      // Refresh the data
      await Promise.all([fetchAssignments(), fetchAvailableSmartMeters()])

      toast({
        title: "Success",
        description: "Smart meter assignment removed successfully.",
      })
    } catch (error) {
      console.error("Error removing direct smart meter assignment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove smart meter assignment. Please try again.",
      })
    }
  }

  // Get total counts
  const totalAssignedEdgeGateways =
    assignments?.reduce((total, assignment) => total + (assignment.edge_gateway_id ? 1 : 0), 0) || 0

  const totalAssignedSmartMeters =
    assignments?.reduce((total, assignment) => total + (assignment.smart_meters?.length || 0), 0) || 0

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User"
  }

  // Get company name by ID
  const getCompanyName = (companyId) => {
    // Find any assignment with this company ID
    const assignment = assignments.find((a) => a.company_id === companyId)
    return assignment ? assignment.company_name : "Unknown Company"
  }

  // Get assignments for a user
  const getAssignmentsForUser = (userId) => {
    // If no user is selected, return empty array
    if (!userId) return []

    const userCompany = getPrimaryCompanyForUser(userId)
    if (!userCompany || !userCompany.company) return []

    // Only return assignments that actually belong to this user's company
    return assignments.filter((a) => a.company_id === userCompany.company.id)
  }

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
            <div className="text-2xl font-bold">{users.length}</div>
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
            <div className="text-2xl font-bold">{new Set(assignments?.map((a) => a?.company_id) || []).size}</div>
            <p className="text-xs text-muted-foreground">With active devices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">
            <UserCircle className="mr-2 h-4 w-4" />
            User View
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building2 className="mr-2 h-4 w-4" />
            Company View
          </TabsTrigger>
          <TabsTrigger value="devices">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Device View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
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
                            <span className="font-medium">
                              {user.first_name} {user.last_name}
                            </span>
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
                <CardTitle>User Devices</CardTitle>
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
                                      <span className="font-medium">{gateway.model_name || "Unknown"}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      Serial: {gateway.serial_number}
                                    </span>
                                  </div>
                                  {selectedEdgeGateway === gateway.id && (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  )}
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

                  <Dialog open={isAssignSmartMeterDirectOpen} onOpenChange={setIsAssignSmartMeterDirectOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={!selectedUser} variant="outline">
                        <CircuitBoard className="mr-2 h-4 w-4" />
                        Assign Smart Meter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Smart Meter</DialogTitle>
                        <DialogDescription>Select a smart meter to assign directly to the user.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label className="mb-2 block">Available Smart Meters</Label>
                        <ScrollArea className="h-[300px] rounded-md border">
                          <div className="p-4 space-y-2">
                            {availableSmartMeters.length === 0 ? (
                              <p className="text-center text-muted-foreground py-4">No available smart meters</p>
                            ) : (
                              availableSmartMeters.map((meter) => (
                                <div
                                  key={meter.id}
                                  className={`flex items-center justify-between rounded-md border p-3 cursor-pointer transition-colors ${
                                    selectedSmartMeter === meter.id
                                      ? "bg-primary/10 border-primary/20"
                                      : "hover:bg-muted"
                                  }`}
                                  onClick={() => setSelectedSmartMeter(meter.id)}
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center">
                                      <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                      <span className="font-medium">{meter.model?.model_name || "Unknown"}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">Serial: {meter.serial_number}</span>
                                  </div>
                                  {selectedSmartMeter === meter.id && <CheckCircle className="h-5 w-5 text-primary" />}
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignSmartMeterDirectOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAssignSmartMeterDirect} disabled={!selectedSmartMeter}>
                          Assign
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
                ) : !selectedUser ? (
                  <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center text-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No User Selected</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a user to view and manage their devices.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {/* User info */}
                      <div className="rounded-md border p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <UserCircle className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {users.find((u) => u.id === selectedUser)?.first_name}{" "}
                              {users.find((u) => u.id === selectedUser)?.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {users.find((u) => u.id === selectedUser)?.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="rounded-md border p-3">
                            <h4 className="font-medium text-sm mb-1">Company</h4>
                            <p>{getPrimaryCompanyForUser(selectedUser)?.company?.name || "No company assigned"}</p>
                          </div>
                          <div className="rounded-md border p-3">
                            <h4 className="font-medium text-sm mb-1">Facility</h4>
                            <p>{getPrimaryCompanyForUser(selectedUser)?.facility?.name || "No facility assigned"}</p>
                          </div>
                        </div>
                      </div>

                      {/* User's devices */}
                      <div className="rounded-md border p-4">
                        <h3 className="font-semibold mb-3">Assigned Devices</h3>

                        {getAssignmentsForUser(selectedUser).length === 0 ? (
                          <div className="rounded-md border border-dashed p-4 text-center">
                            <p className="text-sm text-muted-foreground">No devices assigned to this user</p>
                            <div className="flex justify-center gap-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => setIsAssignEdgeGatewayOpen(true)}>
                                <Server className="mr-2 h-4 w-4" />
                                Assign Edge Gateway
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setIsAssignSmartMeterDirectOpen(true)}>
                                <CircuitBoard className="mr-2 h-4 w-4" />
                                Assign Smart Meter
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Group assignments by edge gateway */}
                            {/* First, show edge gateways */}
                            {getAssignmentsForUser(selectedUser)
                              .filter((assignment) => assignment.edge_gateway_id)
                              .map((assignment) => (
                                <div key={assignment.edge_gateway_id} className="rounded-md border">
                                  <div className="flex items-center justify-between p-3 bg-muted/30">
                                    <div className="flex items-center">
                                      <Server className="mr-2 h-5 w-5 text-blue-500" />
                                      <div>
                                        <span className="font-medium">
                                          Edge Gateway: {assignment.edge_gateway_serial || "Unknown"}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                          {assignment.smart_meters?.length || 0} connected smart meters
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedEdgeGateway(assignment.edge_gateway_id)
                                          setIsAssignSmartMeterOpen(true)
                                        }}
                                      >
                                        <Plus className="mr-1 h-3 w-3" />
                                        Add Meter
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        onClick={() =>
                                          handleRemoveEdgeGateway(assignment.company_id, assignment.edge_gateway_id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Show connected smart meters indented */}
                                  {assignment.smart_meters && assignment.smart_meters.length > 0 && (
                                    <div className="border-t p-2 pl-6">
                                      <div className="space-y-2">
                                        {assignment.smart_meters.map((meter) => (
                                          <div
                                            key={meter.id}
                                            className="flex items-center justify-between rounded-md border p-2 bg-background"
                                          >
                                            <div className="flex items-center">
                                              <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                              <div>
                                                <span className="font-medium">{meter.serial_number}</span>
                                                <div className="text-xs text-muted-foreground">
                                                  {meter.model?.model_name || "Unknown model"}
                                                </div>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                              onClick={() =>
                                                handleRemoveSmartMeter(assignment.edge_gateway_id, meter.id)
                                              }
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                            {/* Then, show directly assigned smart meters (not connected to any edge gateway) */}
                            {getAssignmentsForUser(selectedUser)
                              .filter(
                                (assignment) =>
                                  !assignment.edge_gateway_id &&
                                  assignment.smart_meters &&
                                  assignment.smart_meters.length > 0,
                              )
                              .map((assignment) => (
                                <div key={assignment.id} className="rounded-md border">
                                  <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center">
                                      <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                      <div>
                                        <span className="font-medium">
                                          Direct Smart Meter: {assignment.smart_meters[0]?.serial_number || "Unknown"}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                          {assignment.smart_meters[0]?.model?.model_name || "Unknown model"}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() =>
                                        handleRemoveDirectSmartMeter(assignment.id, assignment.smart_meters[0].id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {/* Add buttons for assigning new devices */}
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" onClick={() => setIsAssignEdgeGatewayOpen(true)}>
                                <Server className="mr-2 h-4 w-4" />
                                Assign Edge Gateway
                              </Button>
                              <Button variant="outline" onClick={() => setIsAssignSmartMeterDirectOpen(true)}>
                                <CircuitBoard className="mr-2 h-4 w-4" />
                                Assign Smart Meter
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Edge Gateways</TableHead>
                      <TableHead>Smart Meters</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No assignments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Group assignments by company
                      Object.entries(
                        assignments.reduce((acc, assignment) => {
                          if (!acc[assignment.company_id]) {
                            acc[assignment.company_id] = {
                              company_id: assignment.company_id,
                              company_name: assignment.company_name,
                              edge_gateways: 0,
                              smart_meters: 0,
                            }
                          }

                          if (assignment.edge_gateway_id) {
                            acc[assignment.company_id].edge_gateways++
                          }

                          acc[assignment.company_id].smart_meters += assignment.smart_meters?.length || 0

                          return acc
                        }, {}),
                      ).map(([companyId, data]) => (
                        <TableRow key={companyId}>
                          <TableCell className="font-medium">{data.company_name}</TableCell>
                          <TableCell>{data.edge_gateways}</TableCell>
                          <TableCell>{data.smart_meters}</TableCell>
                          <TableCell>
                            {data.edge_gateways > 0 || data.smart_meters > 0 ? (
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
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Edge Gateways</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : assignments.filter((a) => a.edge_gateway_id).length === 0 ? (
                      <div className="rounded-md border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">No edge gateways assigned</p>
                      </div>
                    ) : (
                      assignments
                        .filter((a) => a.edge_gateway_id)
                        .map((assignment) => (
                          <div key={assignment.edge_gateway_id} className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Server className="mr-2 h-4 w-4 text-blue-500" />
                                <span className="font-medium">{assignment.edge_gateway_serial || "Unknown"}</span>
                              </div>
                              <Badge variant="outline">{assignment.company_name}</Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {assignment.smart_meters?.length || 0} connected smart meters
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Meters</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : assignments.filter((a) => a.smart_meters?.length > 0).length === 0 ? (
                      <div className="rounded-md border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">No smart meters assigned</p>
                      </div>
                    ) : (
                      assignments
                        .flatMap((assignment) =>
                          (assignment.smart_meters || []).map((meter) => ({
                            ...meter,
                            company_name: assignment.company_name,
                            edge_gateway_id: assignment.edge_gateway_id,
                            edge_gateway_serial: assignment.edge_gateway_serial,
                          })),
                        )
                        .map((meter) => (
                          <div key={meter.id} className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                <span className="font-medium">{meter.serial_number}</span>
                              </div>
                              <Badge variant="outline">{meter.company_name}</Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {meter.edge_gateway_id ? (
                                <span>Connected to gateway: {meter.edge_gateway_serial}</span>
                              ) : (
                                <span>Directly assigned</span>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Assign Smart Meters to Edge Gateway Dialog */}
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
  )
}

