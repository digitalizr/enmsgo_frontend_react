"use client"

import { useState } from "react"
import { Building2, Plus, Search, MoreHorizontal, CircuitBoard, Pencil, Trash2 } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Sample data
const companies = [
  {
    id: "C001",
    name: "Acme Corporation",
    address: "123 Main St, New York, NY 10001",
    contactPerson: "John Doe",
    email: "john.doe@acme.com",
    phone: "+1 (555) 123-4567",
    assignedMeters: 5,
    status: "active",
  },
  {
    id: "C002",
    name: "TechCorp",
    address: "456 Tech Ave, San Francisco, CA 94107",
    contactPerson: "Jane Smith",
    email: "jane.smith@techcorp.com",
    phone: "+1 (555) 987-6543",
    assignedMeters: 3,
    status: "active",
  },
  {
    id: "C003",
    name: "GlobalTech Industries",
    address: "789 Industry Blvd, Chicago, IL 60607",
    contactPerson: "Robert Johnson",
    email: "robert.johnson@globaltech.com",
    phone: "+1 (555) 456-7890",
    assignedMeters: 8,
    status: "active",
  },
  {
    id: "C004",
    name: "Innovative Solutions",
    address: "321 Innovation Dr, Austin, TX 78701",
    contactPerson: "Sarah Williams",
    email: "sarah.williams@innovative.com",
    phone: "+1 (555) 234-5678",
    assignedMeters: 0,
    status: "inactive",
  },
  {
    id: "C005",
    name: "Future Energy",
    address: "654 Power Lane, Seattle, WA 98101",
    contactPerson: "Michael Brown",
    email: "michael.brown@future-energy.com",
    phone: "+1 (555) 876-5432",
    assignedMeters: 2,
    status: "active",
  },
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (company: any) => {
    setSelectedCompany(company)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (company: any) => {
    setSelectedCompany(company)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your client companies</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>Enter the details of the new client company.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" placeholder="Enter company name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter company address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input id="contactPerson" placeholder="Enter contact name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Assigned Meters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.contactPerson}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.assignedMeters}</TableCell>
                <TableCell>
                  <Badge variant={company.status === "active" ? "default" : "secondary"}>
                    {company.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(company)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Building2 className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CircuitBoard className="mr-2 h-4 w-4" />
                        Manage Meters
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
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
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" defaultValue={selectedCompany.phone} />
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
                {selectedCompany.assignedMeters > 0 && (
                  <p className="mt-2 text-destructive">
                    Warning: This company has {selectedCompany.assignedMeters} assigned smart meters. Deleting this
                    company will remove all meter assignments.
                  </p>
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

