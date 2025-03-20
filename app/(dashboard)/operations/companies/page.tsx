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
  AlertTriangle,
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
import { companiesAPI } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CompaniesPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false)
  const [isEditFacilityOpen, setIsEditFacilityOpen] = useState(false)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [expandedCompanies, setExpandedCompanies] = useState([])
  const [expandedFacilities, setExpandedFacilities] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [isDeleteCompanyDialogOpen, setIsDeleteCompanyDialogOpen] = useState(false)
  const [isDeleteFacilityDialogOpen, setIsDeleteFacilityDialogOpen] = useState(false)
  const [isDeleteDepartmentDialogOpen, setIsDeleteDepartmentDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // New company form state
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    status: "lead",
  })

  // Edit company form state
  const [editCompany, setEditCompany] = useState({
    id: "",
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
    address: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
  })

  // Edit facility form state
  const [editFacility, setEditFacility] = useState({
    id: "",
    name: "",
    location: "",
    address: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
  })

  // New department form state
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    notes: "",
  })

  // Edit department form state
  const [editDepartment, setEditDepartment] = useState({
    id: "",
    name: "",
    notes: "",
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
      const response = await companiesAPI.getAll(params)
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

  // Handle edit company input changes
  const handleEditCompanyInputChange = (field, value) => {
    setEditCompany({
      ...editCompany,
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

  // Handle edit facility input changes
  const handleEditFacilityInputChange = (field, value) => {
    setEditFacility({
      ...editFacility,
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

  // Handle edit department input changes
  const handleEditDepartmentInputChange = (field, value) => {
    setEditDepartment({
      ...editDepartment,
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
      const result = await companiesAPI.create(companyData)
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

  // Handle edit company
  const handleEditCompany = async () => {
    try {
      // Validate form
      if (!editCompany.name || !editCompany.contact_name || !editCompany.contact_email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company name, contact name, and contact email are required.",
        })
        return
      }

      console.log("Updating company:", editCompany)

      // Prepare data for update
      const companyData = {
        name: editCompany.name,
        contact_name: editCompany.contact_name,
        contact_email: editCompany.contact_email,
        contact_phone: editCompany.contact_phone || "",
        status: editCompany.status,
        address: editCompany.address || "",
      }

      // Call the API to update the company
      await companiesAPI.update(editCompany.id, companyData)

      // Close dialog and reset form
      setIsEditCompanyOpen(false)
      setEditCompany({
        id: "",
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
        description: "Company updated successfully.",
      })
    } catch (error) {
      console.error("Error updating company:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update company. Please try again.",
      })
    }
  }

  // Handle delete company
  const handleDeleteCompany = async () => {
    try {
      setDeleteLoading(true)
      console.log("Deleting company:", selectedCompany.id)

      // Call the API to delete the company
      await companiesAPI.delete(selectedCompany.id)

      // Close dialog and reset selected company
      setIsDeleteCompanyDialogOpen(false)
      setSelectedCompany(null)

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Company deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting company:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete company. Please try again.",
      })
    } finally {
      setDeleteLoading(false)
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

      // Prepare data for API
      const facilityData = {
        name: newFacility.name,
        location: newFacility.location,
        address: newFacility.address || null,
        contact_name: newFacility.contact_name || null,
        contact_email: newFacility.contact_email || null,
        contact_phone: newFacility.contact_phone || null,
      }

      // Call the API to create a new facility
      await companiesAPI.createFacility(selectedCompany.id, facilityData)

      // Close dialog and reset form
      setIsAddFacilityOpen(false)
      setNewFacility({
        name: "",
        location: "",
        address: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
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

  // Handle edit facility
  const handleEditFacility = async () => {
    try {
      // Validate form
      if (!editFacility.name || !editFacility.location) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Facility name and location are required.",
        })
        return
      }

      console.log("Updating facility:", editFacility)

      // Prepare data for update
      const facilityData = {
        name: editFacility.name,
        location: editFacility.location,
        address: editFacility.address || null,
        contact_name: editFacility.contact_name || null,
        contact_email: editFacility.contact_email || null,
        contact_phone: editFacility.contact_phone || null,
      }

      // Call the API to update the facility
      await companiesAPI.updateFacility(selectedCompany.id, editFacility.id, facilityData)

      // Close dialog and reset form
      setIsEditFacilityOpen(false)
      setEditFacility({
        id: "",
        name: "",
        location: "",
        address: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
      })

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Facility updated successfully.",
      })
    } catch (error) {
      console.error("Error updating facility:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update facility. Please try again.",
      })
    }
  }

  // Handle delete facility
  const handleDeleteFacility = async () => {
    try {
      setDeleteLoading(true)
      console.log("Deleting facility:", selectedFacility.id)

      // Call the API to delete the facility
      await companiesAPI.deleteFacility(selectedCompany.id, selectedFacility.id)

      // Close dialog and reset selected facility
      setIsDeleteFacilityDialogOpen(false)
      setSelectedFacility(null)

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Facility deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting facility:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete facility. Please try again.",
      })
    } finally {
      setDeleteLoading(false)
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

      // Prepare data for API
      const departmentData = {
        name: newDepartment.name,
        notes: newDepartment.notes || null,
      }

      // Call the API to create a new department
      await companiesAPI.createDepartment(selectedFacility.id, departmentData)

      // Close dialog and reset form
      setIsAddDepartmentOpen(false)
      setNewDepartment({
        name: "",
        notes: "",
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

  // Handle edit department
  const handleEditDepartment = async () => {
    try {
      // Validate form
      if (!editDepartment.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Department name is required.",
        })
        return
      }

      console.log("Updating department:", editDepartment)

      // Prepare data for update
      const departmentData = {
        name: editDepartment.name,
        notes: editDepartment.notes || null,
      }

      // Call the API to update the department
      await companiesAPI.updateDepartment(selectedFacility.id, editDepartment.id, departmentData)

      // Close dialog and reset form
      setIsEditDepartmentOpen(false)
      setEditDepartment({
        id: "",
        name: "",
        notes: "",
      })

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Department updated successfully.",
      })
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update department. Please try again.",
      })
    }
  }

  // Handle delete department
  const handleDeleteDepartment = async () => {
    try {
      setDeleteLoading(true)
      console.log("Deleting department:", selectedDepartment.id)

      // Call the API to delete the department
      await companiesAPI.deleteDepartment(selectedFacility.id, selectedDepartment.id)

      // Close dialog and reset selected department
      setIsDeleteDepartmentDialogOpen(false)
      setSelectedDepartment(null)

      // Refresh the data
      fetchCompanies()

      toast({
        title: "Success",
        description: "Department deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete department. Please try again.",
      })
    } finally {
      setDeleteLoading(false)
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

      {/* Edit Company Dialog */}
      <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the details of the company.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-company-name">Company Name</Label>
              <Input
                id="edit-company-name"
                placeholder="Enter company name"
                value={editCompany.name}
                onChange={(e) => handleEditCompanyInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-company-address">Address</Label>
              <Textarea
                id="edit-company-address"
                placeholder="Enter company address"
                value={editCompany.address}
                onChange={(e) => handleEditCompanyInputChange("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-contact-name">Contact Person</Label>
                <Input
                  id="edit-contact-name"
                  placeholder="Enter contact name"
                  value={editCompany.contact_name}
                  onChange={(e) => handleEditCompanyInputChange("contact_name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact-email">Contact Email</Label>
                <Input
                  id="edit-contact-email"
                  type="email"
                  placeholder="Enter contact email"
                  value={editCompany.contact_email}
                  onChange={(e) => handleEditCompanyInputChange("contact_email", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-contact-phone">Contact Phone</Label>
                <Input
                  id="edit-contact-phone"
                  placeholder="Enter contact phone"
                  value={editCompany.contact_phone}
                  onChange={(e) => handleEditCompanyInputChange("contact_phone", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company-status">Status</Label>
                <select
                  id="edit-company-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editCompany.status}
                  onChange={(e) => handleEditCompanyInputChange("status", e.target.value)}
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
            <Button variant="outline" onClick={() => setIsEditCompanyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCompany}
              disabled={!editCompany.name || !editCompany.contact_name || !editCompany.contact_email}
            >
              Update Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Facility Dialog */}
      <Dialog open={isEditFacilityOpen} onOpenChange={setIsEditFacilityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
            <DialogDescription>
              Update the facility details for {selectedCompany?.name || "the selected company"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-facility-name">Facility Name</Label>
              <Input
                id="edit-facility-name"
                placeholder="Enter facility name"
                value={editFacility.name}
                onChange={(e) => handleEditFacilityInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-facility-location">Location</Label>
              <Input
                id="edit-facility-location"
                placeholder="Enter facility location"
                value={editFacility.location}
                onChange={(e) => handleEditFacilityInputChange("location", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-facility-address">Address</Label>
              <Textarea
                id="edit-facility-address"
                placeholder="Enter facility address"
                value={editFacility.address}
                onChange={(e) => handleEditFacilityInputChange("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-facility-contact-name">Contact Person</Label>
                <Input
                  id="edit-facility-contact-name"
                  placeholder="Enter contact name"
                  value={editFacility.contact_name}
                  onChange={(e) => handleEditFacilityInputChange("contact_name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-facility-contact-email">Contact Email</Label>
                <Input
                  id="edit-facility-contact-email"
                  type="email"
                  placeholder="Enter contact email"
                  value={editFacility.contact_email}
                  onChange={(e) => handleEditFacilityInputChange("contact_email", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-facility-contact-phone">Contact Phone</Label>
              <Input
                id="edit-facility-contact-phone"
                placeholder="Enter contact phone"
                value={editFacility.contact_phone}
                onChange={(e) => handleEditFacilityInputChange("contact_phone", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFacilityOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFacility} disabled={!editFacility.name || !editFacility.location}>
              Update Facility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department details for {selectedFacility?.name || "the selected facility"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-department-name">Department Name</Label>
              <Input
                id="edit-department-name"
                placeholder="Enter department name"
                value={editDepartment.name}
                onChange={(e) => handleEditDepartmentInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-department-notes">Notes</Label>
              <Textarea
                id="edit-department-notes"
                placeholder="Enter department notes"
                value={editDepartment.notes}
                onChange={(e) => handleEditDepartmentInputChange("notes", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment} disabled={!editDepartment.name}>
              Update Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <AlertDialog open={isDeleteCompanyDialogOpen} onOpenChange={setIsDeleteCompanyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the company "{selectedCompany?.name}" and all its facilities and departments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Facility Dialog */}
      <AlertDialog open={isDeleteFacilityDialogOpen} onOpenChange={setIsDeleteFacilityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the facility "{selectedFacility?.name}" and all its departments. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFacility} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Department Dialog */}
      <AlertDialog open={isDeleteDepartmentDialogOpen} onOpenChange={setIsDeleteDepartmentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department "{selectedDepartment?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCompany(company)
                                    setEditCompany({
                                      id: company.id,
                                      name: company.name,
                                      address: company.address || "",
                                      contact_name: company.contact_name || "",
                                      contact_email: company.contact_email || "",
                                      contact_phone: company.contact_phone || "",
                                      status: company.status || "lead",
                                    })
                                    setIsEditCompanyOpen(true)
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCompany(company)
                                    setIsDeleteCompanyDialogOpen(true)
                                  }}
                                >
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
                    <div className="grid gap-2">
                      <Label htmlFor="facility-address">Address</Label>
                      <Textarea
                        id="facility-address"
                        placeholder="Enter facility address"
                        value={newFacility.address}
                        onChange={(e) => handleFacilityInputChange("address", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="facility-contact-name">Contact Person</Label>
                        <Input
                          id="facility-contact-name"
                          placeholder="Enter contact name"
                          value={newFacility.contact_name}
                          onChange={(e) => handleFacilityInputChange("contact_name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="facility-contact-email">Contact Email</Label>
                        <Input
                          id="facility-contact-email"
                          type="email"
                          placeholder="Enter contact email"
                          value={newFacility.contact_email}
                          onChange={(e) => handleFacilityInputChange("contact_email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="facility-contact-phone">Contact Phone</Label>
                      <Input
                        id="facility-contact-phone"
                        placeholder="Enter contact phone"
                        value={newFacility.contact_phone}
                        onChange={(e) => handleFacilityInputChange("contact_phone", e.target.value)}
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
                    <div className="grid gap-2">
                      <Label htmlFor="department-notes">Notes</Label>
                      <Textarea
                        id="department-notes"
                        placeholder="Enter department notes"
                        value={newDepartment.notes}
                        onChange={(e) => handleDepartmentInputChange("notes", e.target.value)}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCompany(company)
                            setEditCompany({
                              id: company.id,
                              name: company.name,
                              address: company.address || "",
                              contact_name: company.contact_name || "",
                              contact_email: company.contact_email || "",
                              contact_phone: company.contact_phone || "",
                              status: company.status || "lead",
                            })
                            setIsEditCompanyOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCompany(company)
                            setIsDeleteCompanyDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedCompany(company)
                                      setSelectedFacility(facility)
                                      setEditFacility({
                                        id: facility.id,
                                        name: facility.name,
                                        location: facility.location || "",
                                        address: facility.address || "",
                                        contact_name: facility.contact_name || "",
                                        contact_email: facility.contact_email || "",
                                        contact_phone: facility.contact_phone || "",
                                      })
                                      setIsEditFacilityOpen(true)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedCompany(company)
                                      setSelectedFacility(facility)
                                      setIsDeleteFacilityDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
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
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => {
                                                    setSelectedCompany(company)
                                                    setSelectedFacility(facility)
                                                    setSelectedDepartment(department)
                                                    setEditDepartment({
                                                      id: department.id,
                                                      name: department.name,
                                                      notes: department.notes || "",
                                                    })
                                                    setIsEditDepartmentOpen(true)
                                                  }}
                                                >
                                                  <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => {
                                                    setSelectedCompany(company)
                                                    setSelectedFacility(facility)
                                                    setSelectedDepartment(department)
                                                    setIsDeleteDepartmentDialogOpen(true)
                                                  }}
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
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
