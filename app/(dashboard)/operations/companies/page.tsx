"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import {
  Building,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Building2,
  LayoutGrid,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { companyApi } from "@/lib/api"

export default function CompaniesPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [expandedCompanies, setExpandedCompanies] = useState([])
  const [expandedFacilities, setExpandedFacilities] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  // New company form state
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    status: "lead",
  })

  // New facility form state
  const [newFacility, setNewFacility] = useState({
    name: "",
    location: "",
  })

  // New department form state
  const [newDepartment, setNewDepartment] = useState({
    name: "",
  })

  // Fetch companies from the API
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      // Prepare filter parameters
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (activeTab !== "all") params.status = activeTab

      // Call the API
      const response = await companyApi.getAll(params)
      console.log("API Response:", response) // Debug log

      // Check if response has data property or is an array directly
      const companiesData = response.data || response || []
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error fetching companies:", error)
      setCompanies([]) // Set to empty array on error
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch companies. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchCompanies()
  }, [])

  // Fetch data when tab changes
  useEffect(() => {
    fetchCompanies()
  }, [activeTab])

  // Toggle company expansion
  const toggleCompanyExpansion = (companyId) => {
    if (expandedCompanies.includes(companyId)) {
      setExpandedCompanies(expandedCompanies.filter((id) => id !== companyId))
    } else {
      setExpandedCompanies([...expandedCompanies, companyId])
    }
  }

  // Toggle facility expansion
  const toggleFacilityExpansion = (facilityId) => {
    if (expandedFacilities.includes(facilityId)) {
      setExpandedFacilities(expandedFacilities.filter((id) => id !== facilityId))
    } else {
      setExpandedFacilities([...expandedFacilities, facilityId])
    }
  }

  // Handle company input changes
  const handleCompanyInputChange = (field, value) => {
    setNewCompany({
      ...newCompany,
      [field]: value,
    })
  }

  // Handle facility input changes
  const handleFacilityInputChange = (field, value) => {
    setNewFacility({
      ...newFacility,
      [field]: value,
    })
  }

  // Handle department input changes
  const handleDepartmentInputChange = (field, value) => {
    setNewDepartment({
      ...newDepartment,
      [field]: value,
    })
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    fetchCompanies()
  }

  // Handle add company
  const handleAddCompany = async () => {
    try {
      // Validate form
      if (!newCompany.name || !newCompany.contact_name || !newCompany.contact_email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company name, contact name, and contact email are required.",
        })
        return
      }

      // Log the current user for debugging
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      console.log("Current user:", user)
      console.log("Submitting company data:", newCompany)

      // Simplify the data being sent to ensure only required fields are included
      const companyData = {
        name: newCompany.name,
        contact_name: newCompany.contact_name,
        contact_email: newCompany.contact_email,
        contact_phone: newCompany.contact_phone || "",
        status: newCompany.status || "lead",
        address: newCompany.address || "",
      }

      // Call the API to create a new company
      const result = await companyApi.create(companyData)
      console.log("Company creation result:", result)

      // Close dialog and reset form
      setIsAddCompanyOpen(false)
      setNewCompany({
        name: "",
        address: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        status: "lead",
      })

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Company added successfully.",
      })
    } catch (error) {
      console.error("Error adding company:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add company. Please try again.",
      })
    }
  }

  // Handle add facility
  const handleAddFacility = async () => {
    try {
      // Validate form
      if (!newFacility.name || !newFacility.location) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Facility name and location are required.",
        })
        return
      }

      // Log the data being sent
      console.log("Adding facility to company:", selectedCompany)
      console.log("Facility data:", newFacility)
      console.log("Company ID:", selectedCompany.id)

      // Simplify the data being sent
      const facilityData = {
        name: newFacility.name,
        location: newFacility.location,
      }

      // Call the API to create a new facility
      await companyApi.createFacility(selectedCompany.id, facilityData)

      // Close dialog and reset form
      setIsAddFacilityOpen(false)
      setNewFacility({
        name: "",
        location: "",
      })

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Facility added successfully.",
      })
    } catch (error) {
      console.error("Error adding facility:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add facility. Please try again.",
      })
    }
  }

  // Handle add department
  const handleAddDepartment = async () => {
    try {
      // Validate form
      if (!newDepartment.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Department name is required.",
        })
        return
      }

      // Log the data being sent
      console.log("Adding department to facility:", selectedFacility)
      console.log("Department data:", newDepartment)

      // Simplify the data being sent
      const departmentData = {
        name: newDepartment.name,
      }

      // Call the API to create a new department
      await companyApi.createDepartment(selectedFacility.id, departmentData)

      // Close dialog and reset form
      setIsAddDepartmentOpen(false)
      setNewDepartment({
        name: "",
      })

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Department added successfully.",
      })
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add department. Please try again.",
      })
    }
  }

  // Count total facilities and departments - with safety checks
  const totalFacilities = Array.isArray(companies)
    ? companies.reduce((total, company) => total + (company.facilities?.length || 0), 0)
    : 0

  const totalDepartments = Array.isArray(companies)
    ? companies.reduce(
        (total, company) =>
          total +
          (company.facilities?.reduce(
            (facilityTotal, facility) => facilityTotal + (facility.departments?.length || 0),
            0,
          ) || 0),
        0,
      )
    : 0

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "contracted":
        return <Badge className="bg-green-500">Contracted</Badge>
      case "proposal":
        return <Badge className="bg-blue-500">Proposal</Badge>
      case "contacted":
        return <Badge className="bg-yellow-500">Contacted</Badge>
      case "lead":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-700">
            Lead
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Management</h1>
          <p className="text-muted-foreground">Manage companies, facilities, and departments</p>
        </div>
        <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>Enter the details of the new company.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={newCompany.name}
                  onChange={(e) => handleCompanyInputChange("name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  placeholder="Enter company address"
                  value={newCompany.address}
                  onChange={(e) => handleCompanyInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">Contact Person</Label>
                  <Input
                    id="contact-name"
                    placeholder="Enter contact name"
                    value={newCompany.contact_name}
                    onChange={(e) => handleCompanyInputChange("contact_name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Enter contact email"
                    value={newCompany.contact_email}
                    onChange={(e) => handleCompanyInputChange("contact_email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    placeholder="Enter contact phone"
                    value={newCompany.contact_phone}
                    onChange={(e) => handleCompanyInputChange("contact_phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-status">Status</Label>
                  <select
                    id="company-status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCompany.status}
                    onChange={(e) => handleCompanyInputChange("status", e.target.value)}
                  >
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal">Proposal</option>
                    <option value="contracted">Contracted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCompanyOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddCompany}
                disabled={!newCompany.name || !newCompany.contact_name || !newCompany.contact_email}
              >
                Add Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(companies) ? companies.filter((c) => c.status === "contracted").length : 0} contracted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <LayoutGrid className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Across all facilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Departments</CardTitle>
            <LayoutGrid className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFacilities > 0 ? (totalDepartments / totalFacilities).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Per facility</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="contracted">Contracted</TabsTrigger>
            <TabsTrigger value="proposal">Proposal</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="lead">Lead</TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
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
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Email</TableHead>
                      <TableHead>Facilities</TableHead>
                      <TableHead>Departments</TableHead>
                      <TableHead>Status</TableHead>
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
                    ) : !Array.isArray(companies) || companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No companies found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.contact_name}</TableCell>
                          <TableCell>{company.contact_email}</TableCell>
                          <TableCell>{company.facilities?.length || 0}</TableCell>
                          <TableCell>
                            {company.facilities?.reduce(
                              (total, facility) => total + (facility.departments?.length || 0),
                              0,
                            ) || 0}
                          </TableCell>
                          <TableCell>{getStatusBadge(company.status)}</TableCell>
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
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
        <TabsContent value="contracted" className="mt-0">
          {/* Content for contracted tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="proposal" className="mt-0">
          {/* Content for proposal tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="contacted" className="mt-0">
          {/* Content for contacted tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="lead" className="mt-0">
          {/* Content for lead tab - the base content will show filtered results */}
        </TabsContent>
      </Tabs>

      {/* Company Structure Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between">
            <p className="text-muted-foreground">Manage company facilities and departments</p>
            <div className="flex gap-2">
              <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!selectedCompany}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Facility</DialogTitle>
                    <DialogDescription>
                      Add a new facility to {selectedCompany?.name || "the selected company"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="facility-name">Facility Name</Label>
                      <Input
                        id="facility-name"
                        placeholder="Enter facility name"
                        value={newFacility.name}
                        onChange={(e) => handleFacilityInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="facility-location">Location</Label>
                      <Input
                        id="facility-location"
                        placeholder="Enter facility location"
                        value={newFacility.location}
                        onChange={(e) => handleFacilityInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFacility} disabled={!newFacility.name || !newFacility.location}>
                      Add Facility
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!selectedFacility}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                      Add a new department to {selectedFacility?.name || "the selected facility"}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="department-name">Department Name</Label>
                      <Input
                        id="department-name"
                        placeholder="Enter department name"
                        value={newDepartment.name}
                        onChange={(e) => handleDepartmentInputChange("name", e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDepartment} disabled={!newDepartment.name}>
                      Add Department
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !Array.isArray(companies) || companies.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center text-center">
                    <Building className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Companies</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Add a company to get started.</p>
                  </div>
                </div>
              ) : (
                companies.map((company) => (
                  <Collapsible
                    key={company.id}
                    open={expandedCompanies.includes(company.id)}
                    className="rounded-md border"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <CollapsibleTrigger
                          onClick={() => toggleCompanyExpansion(company.id)}
                          className="flex items-center"
                        >
                          {expandedCompanies.includes(company.id) ? (
                            <ChevronDown className="mr-2 h-4 w-4" />
                          ) : (
                            <ChevronRight className="mr-2 h-4 w-4" />
                          )}
                          <Building className="mr-2 h-4 w-4" />
                          <div>
                            <span className="font-medium">{company.name}</span>
                            {company.status === "inactive" && (
                              <Badge variant="outline" className="ml-2">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </CollapsibleTrigger>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="ml-2">
                          {company.facilities?.length || 0} Facilities
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          {company.facilities?.reduce(
                            (total, facility) => total + (facility.departments?.length || 0),
                            0,
                          ) || 0}{" "}
                          Departments
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCompany(company)
                            setIsAddFacilityOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="space-y-2 p-4 pt-0">
                        <div className="mb-2 rounded-md bg-muted p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Address:</span>
                              </div>
                              <p>{company.address}</p>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Contact:</span>
                              </div>
                              <p>{company.contact_name}</p>
                              <div className="flex items-center mt-1">
                                <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{company.contact_email}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{company.contact_phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {!company.facilities || company.facilities.length === 0 ? (
                          <div className="rounded-md border border-dashed p-4 text-center">
                            <p className="text-sm text-muted-foreground">No facilities added</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setSelectedCompany(company)
                                setIsAddFacilityOpen(true)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Facility
                            </Button>
                          </div>
                        ) : (
                          company.facilities.map((facility) => (
                            <Collapsible
                              key={facility.id}
                              open={expandedFacilities.includes(facility.id)}
                              className="rounded-md border"
                            >
                              <div className="flex items-center justify-between p-3">
                                <div className="flex items-center">
                                  <CollapsibleTrigger
                                    onClick={() => toggleFacilityExpansion(facility.id)}
                                    className="flex items-center"
                                  >
                                    {expandedFacilities.includes(facility.id) ? (
                                      <ChevronDown className="mr-2 h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="mr-2 h-4 w-4" />
                                    )}
                                    <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                                    <div>
                                      <span className="font-medium">{facility.name}</span>
                                      <span className="ml-2 text-sm text-muted-foreground">({facility.location})</span>
                                    </div>
                                  </CollapsibleTrigger>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{facility.departments?.length || 0} Departments</Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedCompany(company)
                                      setSelectedFacility(facility)
                                      setIsAddDepartmentOpen(true)
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <CollapsibleContent>
                                <div className="space-y-2 p-3 pt-0">
                                  {!facility.departments || facility.departments.length === 0 ? (
                                    <div className="rounded-md border border-dashed p-3 text-center">
                                      <p className="text-sm text-muted-foreground">No departments added</p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => {
                                          setSelectedCompany(company)
                                          setSelectedFacility(facility)
                                          setIsAddDepartmentOpen(true)
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Department
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="rounded-md border">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Department Name</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {facility.departments.map((department) => (
                                            <TableRow key={department.id}>
                                              <TableCell>
                                                <div className="flex items-center">
                                                  <LayoutGrid className="mr-2 h-4 w-4 text-green-500" />
                                                  <span>{department.name}</span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                  <Pencil className="h-4 w-4" />
                                                </Button>
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
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

