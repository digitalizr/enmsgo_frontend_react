"use client"

import type React from "react"

import { useState } from "react"
import {
  Building,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  MapPin,
  Users,
  ChevronDown,
  FolderTree,
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample data
const companies = [
  {
    id: "C001",
    name: "Acme Corporation",
    address: "123 Main St, New York, NY 10001",
    contactPerson: "John Doe",
    email: "john.doe@acme.com",
    phone: "+1 (555) 123-4567",
    status: "contracted",
    facilities: [
      {
        id: "F001",
        name: "Headquarters",
        address: "123 Main St, New York, NY 10001",
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
        address: "456 Industry Ave, Chicago, IL 60607",
        departments: [
          { id: "D005", name: "Production" },
          { id: "D006", name: "Quality Control" },
          { id: "D007", name: "Warehouse" },
        ],
      },
    ],
    totalFacilities: 2,
    totalDepartments: 7,
    users: 12,
    edgeGateways: 4,
    smartMeters: 15,
  },
  {
    id: "C002",
    name: "TechCorp",
    address: "456 Tech Ave, San Francisco, CA 94107",
    contactPerson: "Jane Smith",
    email: "jane.smith@techcorp.com",
    phone: "+1 (555) 987-6543",
    status: "engaged",
    facilities: [
      {
        id: "F003",
        name: "Main Office",
        address: "456 Tech Ave, San Francisco, CA 94107",
        departments: [
          { id: "D008", name: "Engineering" },
          { id: "D009", name: "Product" },
          { id: "D010", name: "Marketing" },
        ],
      },
    ],
    totalFacilities: 1,
    totalDepartments: 3,
    users: 8,
    edgeGateways: 3,
    smartMeters: 10,
  },
  {
    id: "C003",
    name: "GlobalTech Industries",
    address: "789 Industry Blvd, Chicago, IL 60607",
    contactPerson: "Robert Johnson",
    email: "robert.johnson@globaltech.com",
    phone: "+1 (555) 456-7890",
    status: "contracted",
    facilities: [
      {
        id: "F004",
        name: "Headquarters",
        address: "789 Industry Blvd, Chicago, IL 60607",
        departments: [
          { id: "D011", name: "Management" },
          { id: "D012", name: "Finance" },
        ],
      },
      {
        id: "F005",
        name: "Research Center",
        address: "101 Innovation Dr, Boston, MA 02210",
        departments: [
          { id: "D013", name: "R&D" },
          { id: "D014", name: "Testing" },
        ],
      },
      {
        id: "F006",
        name: "Manufacturing",
        address: "202 Factory Ln, Detroit, MI 48127",
        departments: [
          { id: "D015", name: "Assembly" },
          { id: "D016", name: "Quality Assurance" },
          { id: "D017", name: "Logistics" },
        ],
      },
    ],
    totalFacilities: 3,
    totalDepartments: 7,
    users: 20,
    edgeGateways: 8,
    smartMeters: 25,
  },
  {
    id: "C004",
    name: "Innovative Solutions",
    address: "321 Innovation Dr, Austin, TX 78701",
    contactPerson: "Sarah Williams",
    email: "sarah.williams@innovative.com",
    phone: "+1 (555) 234-5678",
    status: "lead",
    facilities: [],
    totalFacilities: 0,
    totalDepartments: 0,
    users: 1,
    edgeGateways: 0,
    smartMeters: 0,
  },
  {
    id: "C005",
    name: "Future Energy",
    address: "654 Power Lane, Seattle, WA 98101",
    contactPerson: "Michael Brown",
    email: "michael.brown@future-energy.com",
    phone: "+1 (555) 876-5432",
    status: "contracted",
    facilities: [
      {
        id: "F007",
        name: "Main Office",
        address: "654 Power Lane, Seattle, WA 98101",
        departments: [
          { id: "D018", name: "Administration" },
          { id: "D019", name: "Sales" },
          { id: "D020", name: "Support" },
        ],
      },
    ],
    totalFacilities: 1,
    totalDepartments: 3,
    users: 5,
    edgeGateways: 2,
    smartMeters: 7,
  },
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewStructureDialogOpen, setIsViewStructureDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  // State for company structure modeling
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "lead",
    facilities: [
      {
        name: "",
        address: "",
        departments: [{ name: "" }],
      },
    ],
  })

  const addFacility = () => {
    setNewCompany({
      ...newCompany,
      facilities: [...newCompany.facilities, { name: "", address: "", departments: [{ name: "" }] }],
    })
  }

  const updateFacility = (index: number, field: string, value: string) => {
    const updatedFacilities = [...newCompany.facilities]
    updatedFacilities[index] = {
      ...updatedFacilities[index],
      [field]: value,
    }
    setNewCompany({
      ...newCompany,
      facilities: updatedFacilities,
    })
  }

  const addDepartment = (facilityIndex: number) => {
    const updatedFacilities = [...newCompany.facilities]
    updatedFacilities[facilityIndex].departments.push({ name: "" })
    setNewCompany({
      ...newCompany,
      facilities: updatedFacilities,
    })
  }

  const updateDepartment = (facilityIndex: number, deptIndex: number, value: string) => {
    const updatedFacilities = [...newCompany.facilities]
    updatedFacilities[facilityIndex].departments[deptIndex].name = value
    setNewCompany({
      ...newCompany,
      facilities: updatedFacilities,
    })
  }

  const removeFacility = (index: number) => {
    const updatedFacilities = [...newCompany.facilities]
    updatedFacilities.splice(index, 1)
    setNewCompany({
      ...newCompany,
      facilities: updatedFacilities.length
        ? updatedFacilities
        : [{ name: "", address: "", departments: [{ name: "" }] }],
    })
  }

  const removeDepartment = (facilityIndex: number, deptIndex: number) => {
    const updatedFacilities = [...newCompany.facilities]
    updatedFacilities[facilityIndex].departments.splice(deptIndex, 1)
    if (updatedFacilities[facilityIndex].departments.length === 0) {
      updatedFacilities[facilityIndex].departments.push({ name: "" })
    }
    setNewCompany({
      ...newCompany,
      facilities: updatedFacilities,
    })
  }

  const handleCompanyInputChange = (field: string, value: string) => {
    setNewCompany({
      ...newCompany,
      [field]: value,
    })
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || company.status === activeTab

    return matchesSearch && matchesTab
  })

  const handleEdit = (company: any) => {
    setSelectedCompany(company)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (company: any) => {
    setSelectedCompany(company)
    setIsDeleteDialogOpen(true)
  }

  const handleViewStructure = (company: any) => {
    setSelectedCompany(company)
    setIsViewStructureDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "contracted":
        return <Badge className="bg-green-500">Contracted</Badge>
      case "engaged":
        return <Badge className="bg-blue-500">Engaged</Badge>
      case "lead":
        return <Badge className="bg-amber-500">Lead</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const resetNewCompany = () => {
    setNewCompany({
      name: "",
      address: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "lead",
      facilities: [
        {
          name: "",
          address: "",
          departments: [{ name: "" }],
        },
      ],
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your client companies and their structure</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) resetNewCompany()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Enter the details of the new client company and model its structure.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="company-info" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="company-info">Company Information</TabsTrigger>
                <TabsTrigger value="structure">Company Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="company-info" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter company name"
                      value={newCompany.name}
                      onChange={(e) => handleCompanyInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter company address"
                      value={newCompany.address}
                      onChange={(e) => handleCompanyInputChange("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        placeholder="Enter contact name"
                        value={newCompany.contactPerson}
                        onChange={(e) => handleCompanyInputChange("contactPerson", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newCompany.email}
                        onChange={(e) => handleCompanyInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={newCompany.phone}
                        onChange={(e) => handleCompanyInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Relationship Status</Label>
                      <Select
                        value={newCompany.status}
                        onValueChange={(value) => handleCompanyInputChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="engaged">Engaged</SelectItem>
                          <SelectItem value="contracted">Contracted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4 mt-4">
                <div className="flex flex-col gap-6">
                  {newCompany.facilities.map((facility, facilityIndex) => (
                    <div key={facilityIndex} className="border rounded-lg p-4 relative">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFacility(facilityIndex)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Facility {facilityIndex + 1}</h3>
                      </div>

                      <div className="grid gap-4 mb-6">
                        <div className="grid gap-2">
                          <Label htmlFor={`facility-name-${facilityIndex}`}>Facility Name</Label>
                          <Input
                            id={`facility-name-${facilityIndex}`}
                            placeholder="Enter facility name"
                            value={facility.name}
                            onChange={(e) => updateFacility(facilityIndex, "name", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`facility-address-${facilityIndex}`}>Facility Address</Label>
                          <Textarea
                            id={`facility-address-${facilityIndex}`}
                            placeholder="Enter facility address"
                            value={facility.address}
                            onChange={(e) => updateFacility(facilityIndex, "address", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-base">Departments</Label>
                          <Button variant="outline" size="sm" onClick={() => addDepartment(facilityIndex)}>
                            <Plus className="mr-1 h-3 w-3" />
                            Add Department
                          </Button>
                        </div>

                        <div className="space-y-3 pl-4 border-l-2 border-muted">
                          {facility.departments.map((dept, deptIndex) => (
                            <div key={deptIndex} className="flex items-center gap-2">
                              <Input
                                placeholder="Department name"
                                value={dept.name}
                                onChange={(e) => updateDepartment(facilityIndex, deptIndex, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDepartment(facilityIndex, deptIndex)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addFacility} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Facility
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Company</Button>
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
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracted</CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.filter((c) => c.status === "contracted").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engaged</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.filter((c) => c.status === "engaged").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Building className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.filter((c) => c.status === "lead").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contracted">Contracted</TabsTrigger>
            <TabsTrigger value="engaged">Engaged</TabsTrigger>
            <TabsTrigger value="lead">Leads</TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies..."
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
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Facilities</TableHead>
                      <TableHead>Departments</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No companies found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.contactPerson}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{getStatusBadge(company.status)}</TableCell>
                          <TableCell>{company.totalFacilities}</TableCell>
                          <TableCell>{company.totalDepartments}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEdit(company)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Company
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewStructure(company)}>
                                  <FolderTree className="mr-2 h-4 w-4" />
                                  View Structure
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Manage Facilities
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  Manage Users
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(company)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
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
        <TabsContent value="engaged" className="mt-0">
          {/* Content for engaged tab - the base content will show filtered results */}
        </TabsContent>
        <TabsContent value="lead" className="mt-0">
          {/* Content for lead tab - the base content will show filtered results */}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the details of the selected company.</DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Company Name</Label>
                <Input id="edit-name" defaultValue={selectedCompany.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea id="edit-address" defaultValue={selectedCompany.address} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                  <Input id="edit-contactPerson" defaultValue={selectedCompany.contactPerson} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedCompany.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedCompany.phone} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Relationship Status</Label>
                  <Select defaultValue={selectedCompany.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="engaged">Engaged</SelectItem>
                      <SelectItem value="contracted">Contracted</SelectItem>
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

      {/* View Structure Dialog */}
      <Dialog open={isViewStructureDialogOpen} onOpenChange={setIsViewStructureDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Structure</DialogTitle>
            <DialogDescription>
              {selectedCompany
                ? `View the organizational structure of ${selectedCompany.name}`
                : "Company structure details"}
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  {selectedCompany.name}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedCompany.address}</p>
              </div>

              {selectedCompany.facilities.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Facilities and Departments</h4>
                  <div className="pl-4 border-l-2 border-muted space-y-4">
                    {selectedCompany.facilities.map((facility: any, index: number) => (
                      <Collapsible key={facility.id} className="border rounded-md p-3">
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium">{facility.name}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                          <p className="text-sm text-muted-foreground mb-2">{facility.address}</p>

                          <div className="mt-3 space-y-2">
                            <h5 className="text-sm font-medium">Departments</h5>
                            <div className="pl-4 border-l border-muted space-y-2">
                              {facility.departments.map((dept: any) => (
                                <div key={dept.id} className="flex items-center">
                                  <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{dept.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No facilities or departments defined for this company.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewStructureDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="py-4">
              <p className="mb-2">You are about to delete the following company:</p>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>Company Name:</strong> {selectedCompany.name}
                </p>
                <p>
                  <strong>Contact Person:</strong> {selectedCompany.contactPerson}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCompany.email}
                </p>
                {(selectedCompany.totalFacilities > 0 ||
                  selectedCompany.users > 0 ||
                  selectedCompany.edgeGateways > 0 ||
                  selectedCompany.smartMeters > 0) && (
                  <div className="mt-2 text-destructive">
                    <p className="font-semibold">Warning:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedCompany.totalFacilities > 0 && (
                        <li>This company has {selectedCompany.totalFacilities} facilities</li>
                      )}
                      {selectedCompany.totalDepartments > 0 && (
                        <li>This company has {selectedCompany.totalDepartments} departments</li>
                      )}
                      {selectedCompany.users > 0 && <li>This company has {selectedCompany.users} users</li>}
                      {selectedCompany.edgeGateways > 0 && (
                        <li>This company has {selectedCompany.edgeGateways} assigned edge gateways</li>
                      )}
                      {selectedCompany.smartMeters > 0 && (
                        <li>This company has {selectedCompany.smartMeters} assigned smart meters</li>
                      )}
                    </ul>
                    <p className="mt-2">Deleting this company will also delete all associated data.</p>
                  </div>
                )}
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

function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  return <a {...props} className="flex items-center" />
}

