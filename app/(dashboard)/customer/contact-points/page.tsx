"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, User, Pencil, Trash2, Check, X } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"

// Sample data for contact points
const contactPointsData = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Energy Manager",
    department: "Facilities",
    notifications: ["alerts", "reports"],
    status: "active",
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    role: "Facility Manager",
    department: "Operations",
    notifications: ["alerts"],
    status: "active",
  },
  {
    id: "C003",
    name: "Finance Team",
    email: "finance@example.com",
    phone: "+1 (555) 456-7890",
    role: "Finance Department",
    department: "Finance",
    notifications: ["reports"],
    status: "active",
  },
  {
    id: "C004",
    name: "Sustainability Team",
    email: "sustainability@example.com",
    phone: "+1 (555) 234-5678",
    role: "Sustainability Department",
    department: "Sustainability",
    notifications: ["alerts", "reports"],
    status: "active",
  },
  {
    id: "C005",
    name: "Management",
    email: "management@example.com",
    phone: "+1 (555) 876-5432",
    role: "Executive Team",
    department: "Management",
    notifications: ["reports"],
    status: "inactive",
  },
]

export default function ContactPointsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false)
  const [isEditContactDialogOpen, setIsEditContactDialogOpen] = useState(false)
  const [isDeleteContactDialogOpen, setIsDeleteContactDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  const filteredContacts = contactPointsData.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact)
    setIsEditContactDialogOpen(true)
  }

  const handleDeleteContact = (contact: any) => {
    setSelectedContact(contact)
    setIsDeleteContactDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Points</h1>
          <p className="text-muted-foreground">Manage contacts for alerts and report sharing</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Add a new contact for alerts and report sharing</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter contact name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Enter role" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Enter department" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notification Preferences</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alerts" />
                      <label
                        htmlFor="alerts"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Alerts & Anomalies
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reports" />
                      <label
                        htmlFor="reports"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Reports
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddContactDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddContactDialogOpen(false)}>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contacts</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Notifications</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No contacts found</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAddContactDialogOpen(true)}>
                      Add your first contact
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{contact.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-medium">{contact.role}</div>
                    <div className="text-xs text-muted-foreground">{contact.department}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {contact.notifications.includes("alerts") && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                          Alerts
                        </Badge>
                      )}
                      {contact.notifications.includes("reports") && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                          Reports
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {contact.status === "active" ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted">
                        Inactive
                      </Badge>
                    )}
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
                        <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteContact(contact)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {contact.status === "active" ? (
                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditContactDialogOpen} onOpenChange={setIsEditContactDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information and notification preferences</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" defaultValue={selectedContact.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedContact.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedContact.phone} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Input id="edit-role" defaultValue={selectedContact.role} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input id="edit-department" defaultValue={selectedContact.department} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-alerts" defaultChecked={selectedContact.notifications.includes("alerts")} />
                    <label
                      htmlFor="edit-alerts"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Alerts & Anomalies
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit-reports" defaultChecked={selectedContact.notifications.includes("reports")} />
                    <label
                      htmlFor="edit-reports"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Reports
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedContact.status}>
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditContactDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Dialog */}
      <Dialog open={isDeleteContactDialogOpen} onOpenChange={setIsDeleteContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="py-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedContact.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.role}, {selectedContact.department}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteContactDialogOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

