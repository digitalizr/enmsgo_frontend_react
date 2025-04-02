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
  KeyRound,
  Mail,
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { usersAPI, companiesAPI } from "@/services/api"
import { Checkbox } from "@/components/ui/checkbox"

// Helper function to get auth header
const authHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [isManualResetDialogOpen, setIsManualResetDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [manualPassword, setManualPassword] = useState("")

  // State for cascading dropdowns
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [selectedFacilityId, setSelectedFacilityId] = useState("")
  const [availableFacilities, setAvailableFacilities] = useState([])
  const [availableDepartments, setAvailableDepartments] = useState([])

  // New user form state
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    is_active: true,
    company_id: "",
    facility_id: "",
    department_id: "",
  })

  // Add a new state for selected users and a function to handle bulk deletion
  // Add this after the other state declarations (around line 50)

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log("Fetching users...")
      const response = await usersAPI.getAll()
      console.log("Users API response:", response)

      if (response && response.data) {
        // Process users to ensure they have company/facility/department info
        const processedUsers = await Promise.all(
          response.data.map(async (user) => {
            // If user already has company info, return as is
            if (user.company) {
              return user
            }

            try {
              // Fetch user-company relationships
              const relationshipsResponse = await fetch(`${API_BASE_URL}/user-companies/${user.id}`, {
                method: "GET",
                headers: { ...authHeader(), "Content-Type": "application/json" },
              })

              if (relationshipsResponse.ok) {
                const relationships = await relationshipsResponse.json()
                console.log(`Relationships for user ${user.id}:`, relationships)

                // If we have relationships, add company, facility, and department info
                if (relationships && relationships.data && relationships.data.length > 0) {
                  const primaryRelationship = relationships.data.find((r) => r.is_primary) || relationships.data[0]

                  return {
                    ...user,
                    company: primaryRelationship.company,
                    facility: primaryRelationship.facility,
                    department: primaryRelationship.department,
                  }
                }
              }

              return user
            } catch (error) {
              console.error(`Error fetching relationships for user ${user.id}:`, error)
              return user
            }
          }),
        )

        setUsers(processedUsers)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
      setUsers([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Fetch roles
  const fetchRoles = async () => {
    try {
      console.log("Fetching roles...")
      const response = await usersAPI.getRoles()
      console.log("Roles API response:", response)
      setRoles(response.data || [])
    } catch (error) {
      console.error("Error fetching roles:", error)
      setRoles([]) // Set to empty array on error
    }
  }

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      console.log("Fetching companies...")
      const response = await companiesAPI.getAll()
      console.log("Companies API response:", response)

      // Handle different response formats
      let companiesData = []
      if (Array.isArray(response)) {
        companiesData = response
      } else if (response && Array.isArray(response.data)) {
        companiesData = response.data
      } else if (response) {
        companiesData = [response]
      }

      console.log("Processed companies data:", companiesData)
      setCompanies(companiesData || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch companies. Please try again.",
      })
      setCompanies([]) // Set to empty array on error
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchUsers()
    fetchRoles()
    fetchCompanies()
  }, [])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen) {
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role_id: "",
        is_active: true,
        company_id: "",
        facility_id: "",
        department_id: "",
      })
      setSelectedCompanyId("")
      setSelectedFacilityId("")
      setAvailableFacilities([])
      setAvailableDepartments([])
      setGeneratedPassword("")
    }
  }, [isAddDialogOpen])

  // Update available facilities when company changes
  useEffect(() => {
    if (selectedCompanyId) {
      // Use a timeout to debounce the API call
      const timeoutId = setTimeout(async () => {
        try {
          console.log(`Fetching facilities for company ID: ${selectedCompanyId}`)
          const response = await companiesAPI.getFacilities(selectedCompanyId)
          console.log("Facilities API response:", response)

          // Handle different response formats
          let facilitiesData = []
          if (Array.isArray(response)) {
            facilitiesData = response
          } else if (response && Array.isArray(response.data)) {
            facilitiesData = response.data
          } else if (response) {
            facilitiesData = [response]
          }

          console.log("Processed facilities data:", facilitiesData)
          setAvailableFacilities(facilitiesData || [])
          setSelectedFacilityId("")
          setAvailableDepartments([])

          // Update new user form
          setNewUser((prev) => ({
            ...prev,
            company_id: selectedCompanyId,
            facility_id: "",
            department_id: "",
          }))
        } catch (error) {
          console.error("Error fetching facilities:", error)
          setAvailableFacilities([]) // Set to empty array on error
        }
      }, 300) // 300ms debounce

      return () => clearTimeout(timeoutId)
    } else {
      setAvailableFacilities([])
      setSelectedFacilityId("")
      setAvailableDepartments([])
    }
  }, [selectedCompanyId])

  // Update available departments when facility changes
  useEffect(() => {
    if (selectedFacilityId) {
      // Use a timeout to debounce the API call
      const timeoutId = setTimeout(async () => {
        try {
          console.log(`Fetching departments for facility ID: ${selectedFacilityId}`)
          const response = await companiesAPI.getDepartments(selectedFacilityId)
          console.log("Departments API response:", response)

          // Handle different response formats
          let departmentsData = []
          if (Array.isArray(response)) {
            departmentsData = response
          } else if (response && Array.isArray(response.data)) {
            departmentsData = response.data
          } else if (response) {
            departmentsData = [response]
          }

          console.log("Processed departments data:", departmentsData)
          setAvailableDepartments(departmentsData || [])

          // Update new user form
          setNewUser((prev) => ({
            ...prev,
            facility_id: selectedFacilityId,
            department_id: "",
          }))
        } catch (error) {
          console.error("Error fetching departments:", error)
          setAvailableDepartments([]) // Set to empty array on error
        }
      }, 300) // 300ms debounce

      return () => clearTimeout(timeoutId)
    } else {
      setAvailableDepartments([])
    }
  }, [selectedFacilityId])

  // Generate a random password
  const generateRandomPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?"
    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value,
    })
  }

  // Handle department selection
  const handleDepartmentChange = (departmentId) => {
    setNewUser((prev) => ({
      ...prev,
      department_id: departmentId,
    }))
  }

  // Handle add user
  const handleAddUser = async () => {
    try {
      // Generate a random password if not already generated
      if (!generatedPassword) {
        const password = generateRandomPassword()
        setGeneratedPassword(password)
      }

      // Create user data
      const userData = {
        ...newUser,
        password: generatedPassword,
        require_password_change: true,
      }

      console.log("Sending user data:", userData)

      // Add the user
      const response = await usersAPI.create(userData)
      console.log("User created:", response)

      // If user was created successfully and has company info, create user-company relationship
      if (response && response.id && newUser.company_id) {
        try {
          console.log("Creating user-company relationship")
          await usersAPI.createUserCompanyRelationship({
            user_id: response.id,
            company_id: newUser.company_id,
            facility_id: newUser.facility_id || null,
            department_id: newUser.department_id || null,
            is_primary: true,
          })
        } catch (relationError) {
          console.error("Error creating user-company relationship:", relationError)
          // Continue anyway since the user was created
        }
      }

      toast({
        title: "Success",
        description: "User created successfully. A welcome email has been sent with login instructions.",
      })

      fetchUsers()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add user: ${error.message || "Unknown error"}`,
      })
    }
  }

  // Handle edit user
  const handleSaveChanges = async () => {
    try {
      // Get values from form
      const firstName = document.getElementById("edit-first-name").value
      const lastName = document.getElementById("edit-last-name").value
      const email = document.getElementById("edit-email").value
      const phone = document.getElementById("edit-phone").value

      // Get role_id from select - fix the selector to get the value properly
      const roleSelect = document.getElementById("edit-role")
      const roleId = roleSelect ? roleSelect.value : selectedUser.role_id

      // Get status from select - fix the selector to get the value properly
      const statusSelect = document.getElementById("edit-status")
      const isActive = statusSelect ? statusSelect.value === "active" : selectedUser.is_active

      console.log("Form values collected:", {
        firstName,
        lastName,
        email,
        phone,
        roleId,
        isActive,
        selectedCompanyId,
        selectedFacilityId,
      })

      // Create update data
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        role_id: roleId,
        is_active: isActive,
      }

      console.log("Updating user with data:", updateData)
      console.log("User ID:", selectedUser.id)

      // Update user
      const updatedUser = await usersAPI.update(selectedUser.id, updateData)
      console.log("Updated user:", updatedUser)

      // Update user-company relationship if company/facility/department changed
      if (selectedCompanyId) {
        try {
          console.log("Updating user-company relationship")
          console.log("Selected company:", selectedCompanyId)
          console.log("Selected facility:", selectedFacilityId)

          // Get department_id from select
          const departmentSelect = document.getElementById("edit-department")
          const departmentId = departmentSelect ? departmentSelect.value : null
          console.log("Selected department:", departmentId)

          // First delete existing relationships
          await fetch(`${API_BASE_URL}/user-companies/${selectedUser.id}`, {
            method: "DELETE",
            headers: { ...authHeader(), "Content-Type": "application/json" },
          })

          // Then create new relationship
          await fetch(`${API_BASE_URL}/user-companies`, {
            method: "POST",
            headers: { ...authHeader(), "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: selectedUser.id,
              company_id: selectedCompanyId,
              facility_id: selectedFacilityId || null,
              department_id: departmentId || null,
              is_primary: true,
            }),
          })
        } catch (relationError) {
          console.error("Error updating user-company relationship:", relationError)
          // Continue anyway since the user was updated
        }
      }

      toast({
        title: "Success",
        description: "User updated successfully.",
      })

      fetchUsers()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update user: ${error.message || "Unknown error"}`,
      })
    }
  }

  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      await usersAPI.resetPassword(selectedUser.id)
      toast({
        title: "Success",
        description: "Password reset email has been sent to the user.",
      })
      setIsResetPasswordDialogOpen(false)
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset password. Please try again.",
      })
    }
  }

  // Handle manual password reset
  const handleManualPasswordReset = async () => {
    try {
      await usersAPI.manualResetPassword(selectedUser.id, manualPassword)
      toast({
        title: "Success",
        description: "Password has been reset successfully.",
      })
      setIsManualResetDialogOpen(false)
      setManualPassword("")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset password. Please try again.",
      })
    }
  }

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      await usersAPI.delete(selectedUser.id)
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
      fetchUsers()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      })
    }
  }

  // Add a function to handle bulk deletion
  // Add this after the other handler functions (around line 300)

  const handleBulkDelete = async () => {
    try {
      // Create an array of promises for each user deletion
      const deletePromises = selectedUsers.map((userId) => usersAPI.delete(userId))

      // Execute all delete operations in parallel
      await Promise.all(deletePromises)

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedUsers.length} users.`,
      })

      // Refresh the user list
      fetchUsers()

      // Clear selection and close dialog
      setSelectedUsers([])
      setIsBulkDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error performing bulk delete:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete some users. Please try again.",
      })
    }
  }

  // Add a function to toggle selection of a user
  // Add this after the handleBulkDelete function

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Add a function to toggle selection of all users
  // Add this after the toggleUserSelection function

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // If all are selected, deselect all
      setSelectedUsers([])
    } else {
      // Otherwise, select all
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" || (activeTab === "active" && user.is_active) || (activeTab === "inactive" && !user.is_active)

    return matchesSearch && matchesTab
  })

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)

    // Set up cascading dropdowns for edit
    setSelectedCompanyId(user.company?.id || "")
    setSelectedFacilityId(user.facility?.id || "")

    // Find available facilities for this company
    if (user.company?.id) {
      const fetchFacilities = async () => {
        try {
          const response = await companiesAPI.getFacilities(user.company.id)
          setAvailableFacilities(response.data || [])

          // Find available departments for this facility
          if (user.facility?.id) {
            const deptResponse = await companiesAPI.getDepartments(user.facility.id)
            setAvailableDepartments(deptResponse.data || [])
          }
        } catch (error) {
          console.error("Error fetching facilities:", error)
        }
      }
      fetchFacilities()
    }
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleResetPassword = (user) => {
    setSelectedUser(user)
    setIsResetPasswordDialogOpen(true)
  }

  const handleManualReset = (user) => {
    setSelectedUser(user)
    setIsManualResetDialogOpen(true)
  }

  // Get role badge based on role name
  const getRoleBadge = (role) => {
    if (!role) return <Badge variant="outline">Unknown</Badge>

    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "operator":
        return <Badge className="bg-green-500">Operator</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "customer":
        return <Badge className="bg-purple-500">Customer</Badge>
      case "technician":
        return <Badge className="bg-orange-500">Technician</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (isActive) => {
    // Handle both boolean and string status values
    const active = typeof isActive === "boolean" ? isActive : isActive === "active"
    return active ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="secondary">Inactive</Badge>
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
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
            <div className="text-2xl font-bold">{users.filter((u) => u.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operators</CardTitle>
            <UserCog className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "operator").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies ? companies.length : 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            {selectedUsers.length > 0 && (
              <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedUsers.length})
              </Button>
            )}
          </div>

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
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all users"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => toggleUserSelection(user.id)}
                              aria-label={`Select ${user.first_name} ${user.last_name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.company?.name || "-"}</TableCell>
                          <TableCell>{user.facility?.name || "-"}</TableCell>
                          <TableCell>{user.department?.name || "-"}</TableCell>
                          <TableCell>{getStatusBadge(user.is_active)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Reset Password Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleManualReset(user)}>
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Manual Password Reset
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Enter the details of the new user to create their account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={newUser.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={newUser.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newUser.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role_id">Role</Label>
                <Select value={newUser.role_id} onValueChange={(value) => handleInputChange("role_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                    {/* Fallback options if API failed */}
                    {roles.length === 0 && (
                      <>
                        <SelectItem value="615b2efa-ea1b-44b5-8753-04dc5cf29b84">Admin</SelectItem>
                        <SelectItem value="7c5d3e2f-1a2b-3c4d-5e6f-7a8b9c0d1e2f">Operator</SelectItem>
                        <SelectItem value="9e8d7c6b-5a4b-3c2d-1e0f-9a8b7c6d5e4f">Manager</SelectItem>
                        <SelectItem value="1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d">Customer</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="is_active">Status</Label>
                <Select
                  value={newUser.is_active ? "active" : "inactive"}
                  onValueChange={(value) => handleInputChange("is_active", value === "active")}
                >
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
                    {companies &&
                      companies.map((company) => (
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
                  value={newUser.department_id}
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

            {/* Generated Password Section */}
            <div className="mt-4 p-4 border rounded-md bg-muted/50">
              <div className="flex justify-between items-center mb-2">
                <Label>Generated Password</Label>
                <Button variant="outline" size="sm" onClick={() => setGeneratedPassword(generateRandomPassword())}>
                  Generate New
                </Button>
              </div>
              <div className="flex gap-2">
                <Input value={generatedPassword || generateRandomPassword()} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPassword)
                    toast({
                      title: "Copied",
                      description: "Password copied to clipboard",
                    })
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This password will be sent to the user. They will be required to change it on first login.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.role_id}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
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
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input id="edit-first-name" defaultValue={selectedUser.first_name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input id="edit-last-name" defaultValue={selectedUser.last_name} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedUser.phone || ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select id="edit-role" defaultValue={selectedUser.role_id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                      {/* Fallback options if API failed */}
                      {roles.length === 0 && (
                        <>
                          <SelectItem value="615b2efa-ea1b-44b5-8753-04dc5cf29b84">Admin</SelectItem>
                          <SelectItem value="7c5d3e2f-1a2b-3c4d-5e6f-7a8b9c0d1e2f">Operator</SelectItem>
                          <SelectItem value="9e8d7c6b-5a4b-3c2d-1e0f-9a8b7c6d5e4f">Manager</SelectItem>
                          <SelectItem value="1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d">Customer</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select id="edit-status" defaultValue={selectedUser.is_active ? "active" : "inactive"}>
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
                      {companies &&
                        companies.map((company) => (
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
                    id="edit-department"
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
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
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
                  <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Company:</strong> {selectedUser.company?.name || "N/A"}
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
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to the user. They will receive a link to set a new password.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p>A password reset email will be sent to:</p>
              <p className="font-medium mt-2">{selectedUser.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordReset}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Password Reset Dialog */}
      <Dialog open={isManualResetDialogOpen} onOpenChange={setIsManualResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Password Reset</DialogTitle>
            <DialogDescription>
              Manually reset the user's password. You will need to communicate the new password to them securely.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div>
                <p>Resetting password for:</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-password"
                    type="text"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={() => setManualPassword(generateRandomPassword())}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-amber-50 p-3 text-amber-800 text-sm">
                <p className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  The user will be required to change this password on their next login.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleManualPasswordReset} disabled={!manualPassword}>
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Delete Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              This will permanently remove the selected users from the system.
            </p>
            <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-sm">
              <p className="flex items-center">
                <InfoIcon className="h-4 w-4 mr-2" />
                Warning: Any assignments or data associated with these users will also be affected.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedUsers.length} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

