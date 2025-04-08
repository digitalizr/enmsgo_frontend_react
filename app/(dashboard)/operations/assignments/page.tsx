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
  InfoIcon,
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
import { usersAPI, edgeGatewaysAPI, smartMetersAPI } from "@/services/api"
import { userDeviceAPI } from "@/services/user-device-api" // Import the new API service

// Add this helper function at the top of your component
const chunkArray = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

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
  const [userEdgeGateways, setUserEdgeGateways] = useState([]) // New state for user edge gateways
  const [userSmartMeters, setUserSmartMeters] = useState([]) // New state for user smart meters
  const [expandedUsers, setExpandedUsers] = useState([])
  const [expandedGateways, setExpandedGateways] = useState([])
  const [users, setUsers] = useState([])
  const [userCompanies, setUserCompanies] = useState({})
  const [availableEdgeGateways, setAvailableEdgeGateways] = useState([])
  const [availableSmartMeters, setAvailableSmartMeters] = useState([])
  const [activeTab, setActiveTab] = useState("users")

  // Update the fetchUserCompanies function to handle errors better
  const fetchUserCompanies = async (userId) => {
    try {
      console.log(`Fetching company information for user: ${userId}`)
      const response = await usersAPI.getUserCompanyRelationships(userId)

      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        console.log(`Company data for user ${userId}:`, response.data)

        if (response.data.length === 0) {
          console.warn(`No company relationships found for user ${userId}`)
        }

        setUserCompanies((prev) => ({
          ...prev,
          [userId]: response.data,
        }))
      } else {
        console.warn(`Invalid response format for user ${userId}:`, response)
        // Set empty array for this user to prevent further API calls
        setUserCompanies((prev) => ({
          ...prev,
          [userId]: [],
        }))
      }
    } catch (error) {
      console.error(`Error fetching companies for user ${userId}:`, error)
      // Set empty array for this user to prevent further API calls
      setUserCompanies((prev) => ({
        ...prev,
        [userId]: [],
      }))
      // Don't show toast for every user to avoid spamming the UI
    } finally {
      // Make sure loading state is updated even if there's an error
      if (loading) {
        setLoading(false)
      }
    }
  }

  // Update the fetchUsers function to handle errors better
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll()

      if (response && response.data && Array.isArray(response.data)) {
        setUsers(response.data)

        // Pre-fetch company relationships for all users, but limit to avoid overwhelming the API
        const userBatches = chunkArray(response.data, 5) // Process 5 users at a time

        for (const batch of userBatches) {
          await Promise.all(batch.map((user) => fetchUserCompanies(user.id)))
        }
      } else {
        console.error("Invalid response format from usersAPI.getAll:", response)
        setUsers([])
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users. Invalid response format.",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
    } finally {
      setLoading(false)
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

  // Fetch user edge gateways
  const fetchUserEdgeGateways = async (userId) => {
    try {
      if (!userId) return

      setLoading(true)
      const response = await userDeviceAPI.getUserEdgeGateways(userId)
      setUserEdgeGateways(response.data || [])
    } catch (error) {
      console.error(`Error fetching edge gateways for user ${userId}:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user's edge gateways.",
      })
      setUserEdgeGateways([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch user smart meters
  const fetchUserSmartMeters = async (userId) => {
    try {
      if (!userId) return

      setLoading(true)
      const response = await userDeviceAPI.getUserSmartMeters(userId)
      setUserSmartMeters(response.data || [])
    } catch (error) {
      console.error(`Error fetching smart meters for user ${userId}:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user's smart meters.",
      })
      setUserSmartMeters([])
    } finally {
      setLoading(false)
    }
  }

  // Update the useEffect to handle errors better
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch users first
        await fetchUsers()

        // Then fetch available devices
        await Promise.all([fetchAvailableEdgeGateways(), fetchAvailableSmartMeters()])
      } catch (error) {
        console.error("Error in initial data fetch:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load initial data. Please refresh the page.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch user devices when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserEdgeGateways(selectedUser)
      fetchUserSmartMeters(selectedUser)
    } else {
      setUserEdgeGateways([])
      setUserSmartMeters([])
    }
  }, [selectedUser])

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

  // Update the getPrimaryCompanyForUser function to be more defensive
  const getPrimaryCompanyForUser = (userId) => {
    if (
      !userId ||
      !userCompanies[userId] ||
      !Array.isArray(userCompanies[userId]) ||
      userCompanies[userId].length === 0
    ) {
      return null
    }

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

      // Call the API to assign the edge gateway to the user
      await userDeviceAPI.assignEdgeGatewayToUser(selectedUser, {
        edge_gateway_id: selectedEdgeGateway,
        company_id: userCompany.company.id,
        facility_id: userCompany.facility?.id || null,
        department_id: userCompany.department?.id || null,
      })

      // Refresh the data
      await Promise.all([fetchUserEdgeGateways(selectedUser), fetchAvailableEdgeGateways()])

      // Reset selection and close dialog
      setSelectedEdgeGateway(null)
      setIsAssignEdgeGatewayOpen(false)

      toast({
        title: "Success",
        description: "Edge gateway assigned successfully to user.",
      })
    } catch (error) {
      console.error("Error assigning edge gateway to user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign edge gateway to user. Please try again.",
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

      const userCompany = getPrimaryCompanyForUser(selectedUser)
      if (!userCompany || !userCompany.company) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not associated with any company.",
        })
        return
      }

      // Assign each smart meter to the user with the edge gateway reference
      const assignmentPromises = selectedSmartMeters.map((meterId) =>
        userDeviceAPI.assignSmartMeterToUser(selectedUser, {
          smart_meter_id: meterId,
          edge_gateway_id: selectedEdgeGateway,
          company_id: userCompany.company.id,
          facility_id: userCompany.facility?.id || null,
          department_id: userCompany.department?.id || null,
        }),
      )

      await Promise.all(assignmentPromises)

      // Refresh the data
      await Promise.all([
        fetchUserEdgeGateways(selectedUser),
        fetchUserSmartMeters(selectedUser),
        fetchAvailableSmartMeters(),
      ])

      // Reset selection and close dialog
      setSelectedSmartMeters([])
      setIsAssignSmartMeterOpen(false)

      toast({
        title: "Success",
        description: "Smart meters assigned successfully to user.",
      })
    } catch (error) {
      console.error("Error assigning smart meters to user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign smart meters to user. Please try again.",
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
      if (!userCompany || !userCompany.company) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not associated with any company.",
        })
        return
      }

      // Assign the smart meter directly to the user (without edge gateway)
      await userDeviceAPI.assignSmartMeterToUser(selectedUser, {
        smart_meter_id: selectedSmartMeter,
        company_id: userCompany.company.id,
        facility_id: userCompany.facility?.id || null,
        department_id: userCompany.department?.id || null,
      })

      // Refresh the data
      await Promise.all([fetchUserSmartMeters(selectedUser), fetchAvailableSmartMeters()])

      // Reset selection and close dialog
      setSelectedSmartMeter(null)
      setIsAssignSmartMeterDirectOpen(false)

      toast({
        title: "Success",
        description: "Smart meter assigned successfully to user.",
      })
    } catch (error) {
      console.error("Error assigning smart meter to user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign smart meter to user. Please try again.",
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

  // Handle removing edge gateway assignment from user
  const handleRemoveEdgeGateway = async (gatewayId) => {
    try {
      if (!selectedUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user selected. Please select a user first.",
        })
        return
      }

      // Call the API to remove the edge gateway from the user
      await userDeviceAPI.removeEdgeGatewayFromUser(selectedUser, gatewayId)

      // Refresh the data
      await Promise.all([
        fetchUserEdgeGateways(selectedUser),
        fetchUserSmartMeters(selectedUser),
        fetchAvailableEdgeGateways(),
      ])

      toast({
        title: "Success",
        description: "Edge gateway removed successfully from user.",
      })
    } catch (error) {
      console.error("Error removing edge gateway from user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove edge gateway from user. Please try again.",
      })
    }
  }

  // Handle removing smart meter assignment from user
  const handleRemoveSmartMeter = async (meterId) => {
    try {
      if (!selectedUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user selected. Please select a user first.",
        })
        return
      }

      // Call the API to remove the smart meter from the user
      await userDeviceAPI.removeSmartMeterFromUser(selectedUser, meterId)

      // Refresh the data
      await Promise.all([fetchUserSmartMeters(selectedUser), fetchAvailableSmartMeters()])

      toast({
        title: "Success",
        description: "Smart meter removed successfully from user.",
      })
    } catch (error) {
      console.error("Error removing smart meter from user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove smart meter from user. Please try again.",
      })
    }
  }

  // Get total counts
  const totalAssignedEdgeGateways = userEdgeGateways.length
  const totalAssignedSmartMeters = userSmartMeters.length

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase()
    const email = (user.email || "").toLowerCase()
    const companyName = (user.company?.name || "").toLowerCase()
    const searchTermLower = searchTerm.toLowerCase()

    return (
      fullName.includes(searchTermLower) || email.includes(searchTermLower) || companyName.includes(searchTermLower)
    )
  })

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User"
  }

  // Get company name by ID
  const getCompanyName = (companyId) => {
    // Find any user with this company ID
    const user = users.find((u) => {
      const company = getPrimaryCompanyForUser(u.id)
      return company && company.company && company.company.id === companyId
    })

    if (user) {
      const company = getPrimaryCompanyForUser(user.id)
      return company.company.name
    }

    return "Unknown Company"
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Device Assignments</h1>
          <p className="text-muted-foreground">Manage device assignments directly to users</p>
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
            <div className="text-2xl font-bold">{Object.keys(userCompanies).length}</div>
            <p className="text-xs text-muted-foreground">With active users</p>
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
                  ) : users.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center p-4">
                      <User className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No users found. Please check your connection or try again later.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchUsers()}>
                        Retry
                      </Button>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center p-4">
                      <Search className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No users match your search. Try a different search term.</p>
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
                              {user.first_name || ""} {user.last_name || ""}
                            </span>
                            <span className="text-sm text-muted-foreground">{user.email || "No email"}</span>
                            <span className="text-xs text-muted-foreground">{user.company?.name || "No company"}</span>
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

                      <div className="mb-4 rounded-md bg-blue-50 p-3 text-blue-800 text-sm">
                        <p className="flex items-center">
                          <InfoIcon className="h-4 w-4 mr-2" />
                          Devices are now assigned directly to users, giving them personal ownership and responsibility.
                        </p>
                      </div>

                      {/* User's devices */}
                      <div className="rounded-md border p-4">
                        <h3 className="font-semibold mb-3">Assigned Devices</h3>

                        {userEdgeGateways.length === 0 && userSmartMeters.length === 0 ? (
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
                            {/* Show edge gateways */}
                            {userEdgeGateways.map((gateway) => (
                              <div key={gateway.id} className="rounded-md border">
                                <div className="flex items-center justify-between p-3 bg-muted/30">
                                  <div className="flex items-center">
                                    <Server className="mr-2 h-5 w-5 text-blue-500" />
                                    <div>
                                      <span className="font-medium">
                                        Edge Gateway: {gateway.serial_number || "Unknown"}
                                      </span>
                                      <div className="text-xs text-muted-foreground">
                                        {
                                          userSmartMeters.filter((m) => m.edge_gateway_id === gateway.edge_gateway_id)
                                            .length
                                        }{" "}
                                        connected smart meters
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedEdgeGateway(gateway.edge_gateway_id)
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
                                      onClick={() => handleRemoveEdgeGateway(gateway.edge_gateway_id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Show connected smart meters indented */}
                                {userSmartMeters.filter((m) => m.edge_gateway_id === gateway.edge_gateway_id).length >
                                  0 && (
                                  <div className="border-t p-2 pl-6">
                                    <div className="space-y-2">
                                      {userSmartMeters
                                        .filter((m) => m.edge_gateway_id === gateway.edge_gateway_id)
                                        .map((meter) => (
                                          <div
                                            key={meter.id}
                                            className="flex items-center justify-between rounded-md border p-2 bg-background"
                                          >
                                            <div className="flex items-center">
                                              <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                              <div>
                                                <span className="font-medium">{meter.serial_number}</span>
                                                <div className="text-xs text-muted-foreground">
                                                  {meter.model_name || "Unknown model"}
                                                </div>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                              onClick={() => handleRemoveSmartMeter(meter.smart_meter_id)}
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

                            {/* Show directly assigned smart meters (not connected to any edge gateway) */}
                            {userSmartMeters
                              .filter((meter) => !meter.edge_gateway_id)
                              .map((meter) => (
                                <div key={meter.id} className="rounded-md border">
                                  <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center">
                                      <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                      <div>
                                        <span className="font-medium">
                                          Direct Smart Meter: {meter.serial_number || "Unknown"}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                          {meter.model_name || "Unknown model"}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => handleRemoveSmartMeter(meter.smart_meter_id)}
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
              <CardTitle>Company Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Edge Gateways</TableHead>
                      <TableHead>Smart Meters</TableHead>
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
                    ) : (
                      // Group by company
                      Object.entries(
                        users.reduce((acc, user) => {
                          const company = getPrimaryCompanyForUser(user.id)
                          if (!company || !company.company) return acc

                          const companyId = company.company.id
                          if (!acc[companyId]) {
                            acc[companyId] = {
                              id: companyId,
                              name: company.company.name,
                              users: 0,
                              edge_gateways: 0,
                              smart_meters: 0,
                            }
                          }

                          acc[companyId].users++
                          return acc
                        }, {}),
                      ).map(([companyId, data]) => (
                        <TableRow key={companyId}>
                          <TableCell className="font-medium">{data.name}</TableCell>
                          <TableCell>{data.users}</TableCell>
                          <TableCell>{userEdgeGateways.filter((g) => g.company_id === companyId).length}</TableCell>
                          <TableCell>{userSmartMeters.filter((m) => m.company_id === companyId).length}</TableCell>
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
                    ) : userEdgeGateways.length === 0 ? (
                      <div className="rounded-md border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">No edge gateways assigned</p>
                      </div>
                    ) : (
                      userEdgeGateways.map((gateway) => (
                        <div key={gateway.id} className="rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Server className="mr-2 h-4 w-4 text-blue-500" />
                              <span className="font-medium">{gateway.serial_number || "Unknown"}</span>
                            </div>
                            <Badge variant="outline">{gateway.company_name}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Assigned to: {users.find((u) => u.id === gateway.user_id)?.first_name}{" "}
                            {users.find((u) => u.id === gateway.user_id)?.last_name}
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
                    ) : userSmartMeters.length === 0 ? (
                      <div className="rounded-md border border-dashed p-4 text-center">
                        <p className="text-sm text-muted-foreground">No smart meters assigned</p>
                      </div>
                    ) : (
                      userSmartMeters.map((meter) => (
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
                          <div className="mt-1 text-xs text-muted-foreground">
                            Assigned to: {users.find((u) => u.id === meter.user_id)?.first_name}{" "}
                            {users.find((u) => u.id === meter.user_id)?.last_name}
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
