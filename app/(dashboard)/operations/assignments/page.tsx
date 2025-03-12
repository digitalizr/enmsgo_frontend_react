"use client"

import { useState } from "react"
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

// Sample data
const users = [
  { id: "U001", name: "John Smith", email: "john.smith@acmecorp.com", company: "Acme Corporation" },
  { id: "U002", name: "Jane Doe", email: "jane.doe@techcorp.com", company: "TechCorp" },
  { id: "U003", name: "Robert Johnson", email: "robert@globaltech.com", company: "GlobalTech Industries" },
  { id: "U004", name: "Sarah Williams", email: "sarah@futuretech.com", company: "Future Energy" },
]

const edgeGateways = [
  { id: "EG001", name: "EdgeConnect Pro", serial: "EGDC-12345", status: "available" },
  { id: "EG002", name: "EdgeConnect Pro", serial: "EGDC-23456", status: "assigned" },
  { id: "EG003", name: "IoT Gateway 500", serial: "EGIOT-34567", status: "available" },
  { id: "EG004", name: "IoT Gateway 500", serial: "EGIOT-45678", status: "available" },
  { id: "EG005", name: "EdgeConnect Pro", serial: "EGDC-56789", status: "available" },
]

const smartMeters = [
  { id: "SM001", name: "EM6400NG", serial: "EM6400-12345", status: "available" },
  { id: "SM002", name: "EM6400NG", serial: "EM6400-23456", status: "assigned" },
  { id: "SM003", name: "DTSU666-H", serial: "DTSU666-34567", status: "available" },
  { id: "SM004", name: "DTSU666-H", serial: "DTSU666-45678", status: "assigned" },
  { id: "SM005", name: "EM6400NG", serial: "EM6400-56789", status: "available" },
  { id: "SM006", name: "EM6400NG", serial: "EM6400-67890", status: "available" },
  { id: "SM007", name: "DTSU666-H", serial: "DTSU666-78901", status: "available" },
  { id: "SM008", name: "DTSU666-H", serial: "DTSU666-89012", status: "available" },
]

const existingAssignments = [
  {
    userId: "U001",
    userName: "John Smith",
    company: "Acme Corporation",
    edgeGateways: [
      {
        id: "EG002",
        name: "EdgeConnect Pro",
        serial: "EGDC-23456",
        smartMeters: [
          { id: "SM002", name: "EM6400NG", serial: "EM6400-23456" },
          { id: "SM004", name: "DTSU666-H", serial: "DTSU666-45678" },
        ],
      },
    ],
  },
  {
    userId: "U003",
    userName: "Robert Johnson",
    company: "GlobalTech Industries",
    edgeGateways: [],
  },
]

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedEdgeGateway, setSelectedEdgeGateway] = useState<string | null>(null)
  const [isAssignEdgeGatewayOpen, setIsAssignEdgeGatewayOpen] = useState(false)
  const [isAssignSmartMeterOpen, setIsAssignSmartMeterOpen] = useState(false)
  const [selectedSmartMeters, setSelectedSmartMeters] = useState<string[]>([])
  const [assignments, setAssignments] = useState(existingAssignments)
  const [expandedUsers, setExpandedUsers] = useState<string[]>([])
  const [expandedGateways, setExpandedGateways] = useState<string[]>([])

  // Filter available edge gateways (status = available)
  const availableEdgeGateways = edgeGateways.filter((gateway) => gateway.status === "available")

  // Filter available smart meters (status = available)
  const availableSmartMeters = smartMeters.filter((meter) => meter.status === "available")

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  // Get edge gateway by ID
  const getEdgeGatewayById = (gatewayId: string) => {
    return edgeGateways.find((gateway) => gateway.id === gatewayId)
  }

  // Get smart meter by ID
  const getSmartMeterById = (meterId: string) => {
    return smartMeters.find((meter) => meter.id === meterId)
  }

  // Toggle user expansion
  const toggleUserExpansion = (userId: string) => {
    if (expandedUsers.includes(userId)) {
      setExpandedUsers(expandedUsers.filter((id) => id !== userId))
    } else {
      setExpandedUsers([...expandedUsers, userId])
    }
  }

  // Toggle gateway expansion
  const toggleGatewayExpansion = (gatewayId: string) => {
    if (expandedGateways.includes(gatewayId)) {
      setExpandedGateways(expandedGateways.filter((id) => id !== gatewayId))
    } else {
      setExpandedGateways([...expandedGateways, gatewayId])
    }
  }

  // Handle assigning edge gateway to user
  const handleAssignEdgeGateway = () => {
    if (!selectedUser || !selectedEdgeGateway) return

    // Find the user in assignments
    const userIndex = assignments.findIndex((assignment) => assignment.userId === selectedUser)

    if (userIndex === -1) {
      // User not found, create new assignment
      const user = getUserById(selectedUser)
      const gateway = getEdgeGatewayById(selectedEdgeGateway)

      if (user && gateway) {
        setAssignments([
          ...assignments,
          {
            userId: user.id,
            userName: user.name,
            company: user.company,
            edgeGateways: [
              {
                id: gateway.id,
                name: gateway.name,
                serial: gateway.serial,
                smartMeters: [],
              },
            ],
          },
        ])
      }
    } else {
      // User found, add edge gateway
      const gateway = getEdgeGatewayById(selectedEdgeGateway)

      if (gateway) {
        const updatedAssignments = [...assignments]
        updatedAssignments[userIndex].edgeGateways.push({
          id: gateway.id,
          name: gateway.name,
          serial: gateway.serial,
          smartMeters: [],
        })

        setAssignments(updatedAssignments)
      }
    }

    // Reset selection and close dialog
    setSelectedEdgeGateway(null)
    setIsAssignEdgeGatewayOpen(false)
  }

  // Handle assigning smart meters to edge gateway
  const handleAssignSmartMeters = () => {
    if (!selectedUser || !selectedEdgeGateway || selectedSmartMeters.length === 0) return

    // Find the user in assignments
    const userIndex = assignments.findIndex((assignment) => assignment.userId === selectedUser)

    if (userIndex !== -1) {
      // Find the edge gateway
      const gatewayIndex = assignments[userIndex].edgeGateways.findIndex(
        (gateway) => gateway.id === selectedEdgeGateway,
      )

      if (gatewayIndex !== -1) {
        // Add selected smart meters
        const updatedAssignments = [...assignments]
        const newSmartMeters = selectedSmartMeters
          .map((meterId) => {
            const meter = getSmartMeterById(meterId)
            return meter ? { id: meter.id, name: meter.name, serial: meter.serial } : null
          })
          .filter(Boolean)

        updatedAssignments[userIndex].edgeGateways[gatewayIndex].smartMeters = [
          ...updatedAssignments[userIndex].edgeGateways[gatewayIndex].smartMeters,
          ...newSmartMeters,
        ]

        setAssignments(updatedAssignments)
      }
    }

    // Reset selection and close dialog
    setSelectedSmartMeters([])
    setIsAssignSmartMeterOpen(false)
  }

  // Handle smart meter checkbox change
  const handleSmartMeterChange = (meterId: string) => {
    if (selectedSmartMeters.includes(meterId)) {
      setSelectedSmartMeters(selectedSmartMeters.filter((id) => id !== meterId))
    } else {
      setSelectedSmartMeters([...selectedSmartMeters, meterId])
    }
  }

  // Get total counts
  const totalAssignedEdgeGateways = assignments.reduce((total, user) => total + user.edgeGateways.length, 0)

  const totalAssignedSmartMeters = assignments.reduce(
    (total, user) =>
      total + user.edgeGateways.reduce((gatewayTotal, gateway) => gatewayTotal + gateway.smartMeters.length, 0),
    0,
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
            <div className="text-2xl font-bold">{new Set(assignments.map((a) => a.company)).size}</div>
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
              <div className="space-y-2">
                {users
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.company.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((user) => (
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
                        <span className="text-xs text-muted-foreground">{user.company}</span>
                      </div>
                      {selectedUser === user.id && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                  ))}
              </div>
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
                                  <span className="font-medium">{gateway.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Serial: {gateway.serial}</span>
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
            </div>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
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
                      key={assignment.userId}
                      open={expandedUsers.includes(assignment.userId)}
                      className={`rounded-md border ${selectedUser === assignment.userId ? "border-primary/50" : ""}`}
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <CollapsibleTrigger
                            onClick={() => toggleUserExpansion(assignment.userId)}
                            className="flex items-center"
                          >
                            {expandedUsers.includes(assignment.userId) ? (
                              <ChevronDown className="mr-2 h-4 w-4" />
                            ) : (
                              <ChevronRight className="mr-2 h-4 w-4" />
                            )}
                            <User className="mr-2 h-4 w-4" />
                            <div>
                              <span className="font-medium">{assignment.userName}</span>
                              <span className="ml-2 text-sm text-muted-foreground">({assignment.company})</span>
                            </div>
                          </CollapsibleTrigger>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="ml-2">
                            {assignment.edgeGateways.length} Gateways
                          </Badge>
                          <Badge variant="outline" className="ml-2">
                            {assignment.edgeGateways.reduce((total, gateway) => total + gateway.smartMeters.length, 0)}{" "}
                            Meters
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(assignment.userId)
                              setIsAssignEdgeGatewayOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="space-y-2 p-4 pt-0">
                          {assignment.edgeGateways.length === 0 ? (
                            <div className="rounded-md border border-dashed p-4 text-center">
                              <p className="text-sm text-muted-foreground">No edge gateways assigned</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setSelectedUser(assignment.userId)
                                  setIsAssignEdgeGatewayOpen(true)
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Assign Edge Gateway
                              </Button>
                            </div>
                          ) : (
                            assignment.edgeGateways.map((gateway) => (
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
                                        <span className="font-medium">{gateway.name}</span>
                                        <span className="ml-2 text-sm text-muted-foreground">({gateway.serial})</span>
                                      </div>
                                    </CollapsibleTrigger>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{gateway.smartMeters.length} Meters</Badge>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUser(assignment.userId)
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
                                      onClick={() => {
                                        // Remove this gateway from the user's assignments
                                        const updatedAssignments = [...assignments]
                                        const userIndex = updatedAssignments.findIndex(
                                          (a) => a.userId === assignment.userId,
                                        )
                                        if (userIndex !== -1) {
                                          updatedAssignments[userIndex].edgeGateways = updatedAssignments[
                                            userIndex
                                          ].edgeGateways.filter((g) => g.id !== gateway.id)
                                          setAssignments(updatedAssignments)
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <CollapsibleContent>
                                  <div className="space-y-2 p-3 pt-0">
                                    {gateway.smartMeters.length === 0 ? (
                                      <div className="rounded-md border border-dashed p-3 text-center">
                                        <p className="text-sm text-muted-foreground">No smart meters assigned</p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => {
                                            setSelectedUser(assignment.userId)
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
                                            {gateway.smartMeters.map((meter) => (
                                              <TableRow key={meter.id}>
                                                <TableCell>
                                                  <div className="flex items-center">
                                                    <CircuitBoard className="mr-2 h-4 w-4 text-green-500" />
                                                    <span>{meter.name}</span>
                                                  </div>
                                                </TableCell>
                                                <TableCell>{meter.serial}</TableCell>
                                                <TableCell className="text-right">
                                                  <Button variant="ghost" size="icon">
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

      {/* Assignment Visualization */}
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
                {assignments.map((assignment) => (
                  <TableRow key={assignment.userId}>
                    <TableCell className="font-medium">{assignment.userName}</TableCell>
                    <TableCell>{assignment.company}</TableCell>
                    <TableCell>{assignment.edgeGateways.length}</TableCell>
                    <TableCell>
                      {assignment.edgeGateways.reduce((total, gateway) => total + gateway.smartMeters.length, 0)}
                    </TableCell>
                    <TableCell>
                      {assignment.edgeGateways.length > 0 ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

