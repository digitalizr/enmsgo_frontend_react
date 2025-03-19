"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, RefreshCw, Shield, User, UserPlus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("operator")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [sendInvite, setSendInvite] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "operator",
  })

  // Generate a random password
  const generateRandomPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?"
    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    setFormData({ ...formData, password })
    setGeneratedPassword(password)
    return password
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle role selection
  const handleRoleChange = (role) => {
    setSelectedRole(role)
    setFormData({
      ...formData,
      role,
    })
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    // In a real application, this would call the API
    console.log("Submitting form data:", formData)
    console.log("Send invite email:", sendInvite)

    toast({
      title: "Success",
      description: "Team member added successfully.",
    })

    setIsAddTeamMemberOpen(false)

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "operator",
    })
    setGeneratedPassword("")
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and platform preferences.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <Tabs defaultValue="general" className="lg:flex lg:flex-col" orientation="vertical">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-1">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
          </Tabs>
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Tabs defaultValue="general" orientation="vertical">
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure general platform settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Energy Management SaaS" />
                    <p className="text-sm text-muted-foreground">
                      This is the name that will be displayed on your dashboard and reports.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      All dates and times will be displayed in this timezone.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events and alerts.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect anonymous usage data to improve our service.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>Manage your API keys and access tokens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input readOnly value="sk_live_51JGh0rKZ9JKl7J0Z9JKl7J0Z9JKl7J0Z9JKl7J0Z9JKl" type="password" />
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your API key has full access to your account. Keep it secure!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-access">API Access</Label>
                      <Switch id="api-access" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Enable or disable API access to your account.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Regenerate Key</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="teams" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage your team members and their access permissions.</CardDescription>
                  </div>
                  <Dialog open={isAddTeamMemberOpen} onOpenChange={setIsAddTeamMemberOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Team Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Team Member</DialogTitle>
                        <DialogDescription>
                          Add a new team member to your organization. They will receive an email invitation to join.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input
                              id="first-name"
                              placeholder="Enter first name"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input
                              id="last-name"
                              placeholder="Enter last name"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                              id="phone"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label>Role</Label>
                          <div className="grid grid-cols-1 gap-4">
                            <div
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${selectedRole === "admin" ? "border-primary bg-primary/5" : ""}`}
                              onClick={() => handleRoleChange("admin")}
                            >
                              <Shield className="mt-0.5 h-5 w-5 text-primary" />
                              <div className="space-y-1">
                                <div className="font-medium">Administrator</div>
                                <div className="text-sm text-muted-foreground">
                                  Full access to all settings and features. Can manage team members and billing.
                                </div>
                              </div>
                            </div>
                            <div
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${selectedRole === "operator" ? "border-primary bg-primary/5" : ""}`}
                              onClick={() => handleRoleChange("operator")}
                            >
                              <Users className="mt-0.5 h-5 w-5 text-primary" />
                              <div className="space-y-1">
                                <div className="font-medium">Operator</div>
                                <div className="text-sm text-muted-foreground">
                                  Can manage devices, assignments, and view analytics. Limited access to settings.
                                </div>
                              </div>
                            </div>
                            <div
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${selectedRole === "technician" ? "border-primary bg-primary/5" : ""}`}
                              onClick={() => handleRoleChange("technician")}
                            >
                              <User className="mt-0.5 h-5 w-5 text-primary" />
                              <div className="space-y-1">
                                <div className="font-medium">Technician</div>
                                <div className="text-sm text-muted-foreground">
                                  Can view device status and perform basic operations. No access to settings or billing.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="send-invite">Send Email Invitation</Label>
                            <Switch
                              id="send-invite"
                              checked={sendInvite}
                              onCheckedChange={setSendInvite}
                              defaultChecked
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            The user will receive an email with instructions to set up their account.
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <Button variant="outline" type="button" onClick={generateRandomPassword}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Generate
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            The user will be required to change this password on first login.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTeamMemberOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                          {sendInvite ? (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Invite Team Member
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add Team Member
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="flex items-center p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Badge className="bg-primary">Admin</Badge>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border">
                      <div className="flex items-center p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Jane Smith</p>
                            <p className="text-sm text-muted-foreground">jane.smith@example.com</p>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Badge variant="outline" className="bg-blue-500 text-white">
                            Operator
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border">
                      <div className="flex items-center p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>RJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Robert Johnson</p>
                            <p className="text-sm text-muted-foreground">robert.johnson@example.com</p>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-500 text-white">
                            Technician
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Configure access permissions for each role in your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Administrator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Administrators have full access to all features and settings.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="admin-users" defaultChecked disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="admin-users">User Management</Label>
                            <p className="text-sm text-muted-foreground">Create, edit, and delete users</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="admin-billing" defaultChecked disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="admin-billing">Billing & Subscriptions</Label>
                            <p className="text-sm text-muted-foreground">Manage billing and subscription settings</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="admin-devices" defaultChecked disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="admin-devices">Device Management</Label>
                            <p className="text-sm text-muted-foreground">Add, edit, and remove devices</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="admin-settings" defaultChecked disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="admin-settings">System Settings</Label>
                            <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">Operator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Operators can manage devices and view analytics.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="operator-users" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="operator-users">User Management</Label>
                            <p className="text-sm text-muted-foreground">Create, edit, and delete users</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="operator-billing" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="operator-billing">Billing & Subscriptions</Label>
                            <p className="text-sm text-muted-foreground">Manage billing and subscription settings</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="operator-devices" defaultChecked />
                          <div className="grid gap-1.5">
                            <Label htmlFor="operator-devices">Device Management</Label>
                            <p className="text-sm text-muted-foreground">Add, edit, and remove devices</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="operator-settings" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="operator-settings">System Settings</Label>
                            <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">Technician</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Technicians have limited access to device management.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="tech-users" disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="tech-users">User Management</Label>
                            <p className="text-sm text-muted-foreground">Create, edit, and delete users</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="tech-billing" disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="tech-billing">Billing & Subscriptions</Label>
                            <p className="text-sm text-muted-foreground">Manage billing and subscription settings</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="tech-devices" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="tech-devices">Device Management</Label>
                            <p className="text-sm text-muted-foreground">
                              View device status and perform basic operations
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="tech-settings" disabled />
                          <div className="grid gap-1.5">
                            <Label htmlFor="tech-settings">System Settings</Label>
                            <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Permission Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

