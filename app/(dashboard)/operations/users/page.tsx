"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  Pencil,
  Trash2,
  InfoIcon,
  UserCog,
  Building,
  Building2,
  LayoutGrid,
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

// Sample data for companies with facilities and departments
const companiesData = [
  {
    id: "C001",
    name: "Acme Corporation",
    facilities: [
      {
        id: "F001",
        name: "Headquarters",
        departments: [
          { id: "D001", name: "Executive" },
          { id: "D002", name: "HR" },
          { id: "D003", name: "IT" },
          { id: "D004", name: "Finance" },
        ],
      },
      {
        id: "F002",
        name: "Manufacturing Plant",
        departments: [
          { id: "D005", name: "Production" },
          { id: "D006", name: "Quality Control" },
          { id: "D007", name: "Warehouse" },
        ],
      },
    ],
  },
  {
    id: "C002",
    name: "TechCorp",
    facilities: [
      {
        id: "F003",
        name: "Main Office",
        departments: [
          { id: "D008", name: "Engineering" },
          { id: "D009", name: "Product" },
          { id: "D010", name: "Marketing" },
        ],
      },
    ],
  },
  {
    id: "C003",
    name: "GlobalTech Industries",
    facilities: [
      {
        id: "F004",
        name: "Headquarters",
        departments: [
          { id: "D011", name: "Management" },
          { id: "D012", name: "Finance" },
        ],
      },
      {
        id: "F005",
        name: "Research Center",
        departments: [
          { id: "D013", name: "R&D" },
          { id: "D014", name: "Testing" },
        ],
      },
      {
        id: "F006",
        name: "Manufacturing",
        departments: [
          { id: "D015", name: "Assembly" },
          { id: "D016", name: "Quality Assurance" },
          { id: "D017", name: "Logistics" },
        ],
      },
    ],
  },
  {
    id: "C005",
    name: "Future Energy",
    facilities: [
      {
        id: "F007",
        name: "Main Office",
        departments: [
          { id: "D018", name: "Administration" },
          { id: "D019", name: "Sales" },
          { id: "D020", name: "Support" },
        ],
      },
    ],
  },
]

// Sample data for users
const users = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    role: "admin",
    company: {
      id: "C001",
      name: "Acme Corporation",
    },
    facility: {
      id: "F001",
      name: "Headquarters",
    },
    department: {
      id: "D003",
      name: "IT",
    },
    status: "active",
    lastLogin: "2023-03-01T12:35:00Z",
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane.smith@techcorp.com",
    role: "manager",
    company: {
      id: "C002",
      name: "TechCorp",
    },
    facility: {
      id: "F003",
      name: "Main Office",
    },
    department: {
      id: "D009",
      name: "Product",
    },
    status: "active",
    lastLogin: "2023-03-01T10:15:00Z",
  },
  {
    id: "U003",
    name: "Robert Johnson",
    email: "robert.johnson@globaltech.com",
    role: "viewer",
    company: {
      id: "C003",
      name: "GlobalTech Industries",
    },
    facility: {
      id: "F006",
      name: "Manufacturing",
    },
    department: {
      id: "D015",
      name: "Assembly",
    },
    status: "active",
    lastLogin: "2023-02-28T14:45:00Z",
  },
  {
    id: "U004",
    name: "Sarah Williams",
    email: "sarah.williams@acmecorp.com",
    role: "manager",
    company: {
      id: "C001",
      name: "Acme Corporation",
    },
    facility: {
      id: "F002",
      name: "Manufacturing Plant",
    },
    department: {
      id: "D006",
      name: "Quality Control",
    },
    status: "inactive",
    lastLogin: "2023-02-15T09:20:00Z",
  },
  {
    id: "U005",
    name: "Michael Brown",
    email: "michael.brown@future-energy.com",
    role: "admin",
    company: {
      id: "C005",
      name: "Future Energy",
    },
    facility: {
      id: "F007",
      name: "Main Office",
    },
    department: {
      id: "D018",
      name: "Administration",
    },
    status: "active",
    lastLogin: "2023-03-01T08:30:00Z",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  // State for cascading dropdowns
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("")
  const [availableFacilities, setAvailableFacilities] = useState<any[]>([])
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([])

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer",
    status: "active",
    companyId: "",
    facilityId: "",
    departmentId: "",
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen) {
      setNewUser({
        name: "",
        email: "",
        role: "viewer",
        status: "active",
        companyId: "",
        facilityId: "",
        departmentId: "",
      })
      setSelectedCompanyId("")
      setSelectedFacilityId("")
      setAvailableFacilities([])
      setAvailableDepartments([])
    }
  }, [isAddDialogOpen])

  // Update available facilities when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      const company = companiesData.find((c) => c.id === selectedCompanyId)
      if (company) {
        setAvailableFacilities(company.facilities)
        setSelectedFacilityId("")
        setAvailableDepartments([])

        // Update new user form
        setNewUser({
          ...newUser,
          companyId: selectedCompanyId,
          facilityId: "",
          departmentId: "",
        })
      }
    } else {
      setAvailableFacilities([])
      setSelectedFacilityId("")
      setAvailableDepartments([])
    }
  }, [selectedCompanyId])

  // Update available departments when facility changes
  useEffect(() => {
    if (selectedFacilityId && selectedCompanyId) {
      const company = companiesData.find((c) => c.id === selectedCompanyId)
      if (company) {
        const facility = company.facilities.find((f) => f.id === selectedFacilityId)
        if (facility) {
          setAvailableDepartments(facility.departments)

          // Update new user form
          setNewUser({
            ...newUser,
            facilityId: selectedFacilityId,
            departmentId: "",
          })
        }
      }
    } else {
      setAvailableDepartments([])
    }
  }, [selectedFacilityId, selectedCompanyId])

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewUser({
      ...newUser,
      [field]: value,
    })
  }

  // Handle department selection
  const handleDepartmentChange = (departmentId: string) => {
    setNewUser({
      ...newUser,
      departmentId,
    })
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && user.status === "active") ||
      (activeTab === "inactive" && user.status === "inactive")

    return matchesSearch && matchesTab
  })

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)

    // Set up cascading dropdowns for edit
    setSelectedCompanyId(user.company.id)
    setSelectedFacilityId(user.facility.id)

    // Find available facilities for this company
    const company = companiesData.find((c) => c.id === user.company.id)
    if (company) {
      setAvailableFacilities(company.facilities)

      // Find available departments for this facility
      const facility = company.facilities.find((f) => f.id === user.facility.id)
      if (facility) {
        setAvailableDepartments(facility.departments)
      }
    }
  }

  const handleDelete = (user: any) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "viewer":
        return <Badge className="bg-green-500">Viewer</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Enter the details of the new user to create their account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newUser.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cascading dropdowns for company structure */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company" className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    Company
                  </Label>
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companiesData.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="facility" className="flex items-center">
                    <Building2 className="mr-1 h-4 w-4" />
                    Facility
                  </Label>
                  <Select
                    value={selectedFacilityId}
                    onValueChange={setSelectedFacilityId}
                    disabled={!selectedCompanyId || availableFacilities.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedCompanyId
                            ? "Select a company first"
                            : availableFacilities.length === 0
                              ? "No facilities available"
                              : "Select facility"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department" className="flex items-center">
                    <LayoutGrid className="mr-1 h-4 w-4" />
                    Department
                  </Label>
                  <Select
                    value={newUser.departmentId}
                    onValueChange={handleDepartmentChange}
                    disabled={!selectedFacilityId || availableDepartments.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedFacilityId
                            ? "Select a facility first"
                            : availableDepartments.length === 0
                              ? "No departments available"
                              : "Select department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(false)}
                disabled={!newUser.name || !newUser.email || !newUser.departmentId}
              >
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <UserCog className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(users.map((u) => u.company.id)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <div className="relative w-64">
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

        <TabsContent value="all" className="mt-0">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0 pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.company.name}</TableCell>
                          <TableCell>{user.facility.name}</TableCell>
                          <TableCell>{user.department.name}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(user)}>
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
        <TabsContent value="active" className="mt-0">
          {/* Content for active tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="inactive" className="mt-0">
          {/* Content for inactive tab - the base content will show filtered results */}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the details of the selected user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cascading dropdowns for company structure */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-company" className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    Company
                  </Label>
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companiesData.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-facility" className="flex items-center">
                    <Building2 className="mr-1 h-4 w-4" />
                    Facility
                  </Label>
                  <Select
                    value={selectedFacilityId}
                    onValueChange={setSelectedFacilityId}
                    disabled={!selectedCompanyId || availableFacilities.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedCompanyId
                            ? "Select a company first"
                            : availableFacilities.length === 0
                              ? "No facilities available"
                              : "Select facility"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-department" className="flex items-center">
                    <LayoutGrid className="mr-1 h-4 w-4" />
                    Department
                  </Label>
                  <Select
                    defaultValue={selectedUser.department?.id}
                    disabled={!selectedFacilityId || availableDepartments.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedFacilityId
                            ? "Select a facility first"
                            : availableDepartments.length === 0
                              ? "No departments available"
                              : "Select department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="mb-2">You are about to delete the following user:</p>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Company:</strong> {selectedUser.company.name}
                </p>
                <p>
                  <strong>Facility:</strong> {selectedUser.facility.name}
                </p>
                <p>
                  <strong>Department:</strong> {selectedUser.department.name}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
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

