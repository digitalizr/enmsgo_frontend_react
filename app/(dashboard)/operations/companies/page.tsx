"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
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

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your client companies</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Manage Meters</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

