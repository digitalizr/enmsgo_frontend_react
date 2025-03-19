"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Users,
  Bell,
  Shield,
  Database,
  Save,
  Globe,
  Server,
  RefreshCw,
  Mail,
  Phone,
  Plus,
  Upload,
  Download,
  Trash,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for users
const usersData = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2023-05-15T10:30:00Z",
  },
  {
    id: "U002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Operations Manager",
    status: "active",
    lastLogin: "2023-05-14T16:45:00Z",
  },
  {
    id: "U003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Technician",
    status: "active",
    lastLogin: "2023-05-13T09:15:00Z",
  },
  {
    id: "U004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Support",
    status: "inactive",
    lastLogin: "2023-05-01T14:20:00Z",
  },
]

// Sample data for integrations
const integrationsData = [
  {
    id: "I001",
    name: "Elmeasure API",
    type: "Smart Meter",
    status: "connected",
    lastSync: "2023-05-15T12:30:00Z",
  },
  {
    id: "I002",
    name: "Huawei Smart Meter API",
    type: "Smart Meter",
    status: "connected",
    lastSync: "2023-05-15T12:35:00Z",
  },
  {
    id: "I003",
    name: "Weather Service",
    type: "External Data",
    status: "connected",
    lastSync: "2023-05-15T12:00:00Z",
  },
  {
    id: "I004",
    name: "Energy Price API",
    type: "External Data",
    status: "error",
    lastSync: "2023-05-14T10:15:00Z",
  },
]

export default function OperationsSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Settings</h1>
          <p className="text-muted-foreground">Configure system settings and manage operations</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            Data Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure general system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Energy Management SaaS" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" type="email" defaultValue="support@energyms.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-phone">Support Phone</Label>
                    <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Time Zone</Label>
                    <Select defaultValue="america-new_york">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america-chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america-denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america-los_angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="etc-utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mm-dd-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="cad">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Preferences</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh dashboard data every 5 minutes
                    </p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode Default</Label>
                    <p className="text-sm text-muted-foreground">Set dark mode as the default theme for all users</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymous usage data to improve the system</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require two-factor authentication for all users</p>
                </div>
                <Switch id="two-factor" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-expiry">Password Expiry</Label>
                  <p className="text-sm text-muted-foreground">Force password reset every 90 days</p>
                </div>
                <Switch id="password-expiry" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-restrictions">IP Restrictions</Label>
                <Textarea
                  id="ip-restrictions"
                  placeholder="Enter allowed IP addresses, one per line"
                  defaultValue="192.168.1.0/24"
                />
                <p className="text-xs text-muted-foreground">Leave blank to allow access from any IP address</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.status === "active" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem>Deactivate</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Activate</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Configure user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Administrator</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      System Role
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Full access to all system features and settings</p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Operations Manager</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      System Role
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access to operations features and limited settings
                  </p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Technician</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      System Role
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access to device management and monitoring features
                  </p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Support</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      System Role
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access to customer support features and limited data
                  </p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Smart Meter Integrations</CardTitle>
                <CardDescription>Manage connections to smart meter systems</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrationsData.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.name}</TableCell>
                        <TableCell>{integration.type}</TableCell>
                        <TableCell>
                          {integration.status === "connected" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive">
                              Error
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(integration.lastSync).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure API settings and access tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input id="api-url" defaultValue="https://api.energyms.com/v1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-key">API Key</Label>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <Input id="api-key" defaultValue="sk_live_51Hb3U5JK8iUtr9Xj5tFQFqTJ" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" defaultValue="https://energyms.com/api/webhook" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="api-logging">API Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all API requests and responses for debugging</p>
                </div>
                <Switch id="api-logging" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rate-limiting">Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">Enable rate limiting for API requests</p>
                </div>
                <Switch id="rate-limiting" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save API Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
              <CardDescription>Configure connections to external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Server className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Weather Service</h3>
                      <p className="text-sm text-muted-foreground">Integrate weather data for energy forecasting</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Energy Price API</h3>
                      <p className="text-sm text-muted-foreground">Real-time energy pricing data</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Service</h3>
                      <p className="text-sm text-muted-foreground">Email notifications and reports</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">SMS Gateway</h3>
                      <p className="text-sm text-muted-foreground">SMS notifications for alerts</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system-wide notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Notifications</h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications for critical system alerts</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Switch id="critical-email" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Switch id="critical-sms" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Switch id="critical-push" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Warning Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications for warning-level alerts</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Switch id="warning-email" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Switch id="warning-sms" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Switch id="warning-push" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Informational Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications for informational alerts</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Switch id="info-email" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Switch id="info-sms" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Switch id="info-push" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="meter-offline">Smart Meter Offline</Label>
                      <p className="text-sm text-muted-foreground">Notify when a smart meter goes offline</p>
                    </div>
                    <Switch id="meter-offline" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-device">New Device Registration</Label>
                      <p className="text-sm text-muted-foreground">Notify when a new smart meter is registered</p>
                    </div>
                    <Switch id="new-device" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="integration-error">Integration Error</Label>
                      <p className="text-sm text-muted-foreground">Notify when an integration encounters an error</p>
                    </div>
                    <Switch id="integration-error" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="user-activity">User Activity</Label>
                      <p className="text-sm text-muted-foreground">Notify on important user activities</p>
                    </div>
                    <Switch id="user-activity" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Delivery</h3>
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Default Notification Email</Label>
                  <Input id="notification-email" defaultValue="operations@energyms.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-phone">Default Notification Phone</Label>
                  <Input id="notification-phone" defaultValue="+1 (555) 987-6543" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet-hours">Quiet Hours</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="quiet-hours">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No quiet hours</SelectItem>
                      <SelectItem value="night">10:00 PM - 7:00 AM</SelectItem>
                      <SelectItem value="weekend">Weekends</SelectItem>
                      <SelectItem value="custom">Custom schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Only critical alerts will be sent during quiet hours</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Customize notification message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-template">Email Template</Label>
                <Textarea
                  id="email-template"
                  rows={4}
                  defaultValue="[EnergyMS] Alert: {{alert_type}} - {{alert_message}}\n\nDevice: {{device_name}}\nTime: {{timestamp}}\n\nView details: {{alert_url}}"
                />
                <p className="text-xs text-muted-foreground">Use {{ variable }} placeholders for dynamic content</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-template">SMS Template</Label>
                <Textarea
                  id="sms-template"\
                  rows                <Textarea
                  id="sms-template"
                  rows={3}
                  defaultValue="EnergyMS Alert: {{alert_type}} - {{alert_message}} (Device: {{device_name}})"
                />
                <p className="text-xs text-muted-foreground">Keep SMS templates concise (160 characters max)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="push-template">Push Notification Template</Label>
                <Textarea id="push-template" rows={2} defaultValue="{{alert_type}}: {{alert_message}}" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Templates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Storage Settings</CardTitle>
              <CardDescription>Configure data retention and storage policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select defaultValue="36">
                  <SelectTrigger id="data-retention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Data older than this period will be automatically archived
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-resolution">Data Resolution</Label>
                <Select defaultValue="15min">
                  <SelectTrigger id="data-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1min">1 minute</SelectItem>
                    <SelectItem value="5min">5 minutes</SelectItem>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="60min">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Resolution for storing time-series data</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-compression">Data Compression</Label>
                  <p className="text-sm text-muted-foreground">Compress historical data to save storage space</p>
                </div>
                <Switch id="data-compression" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Create daily backups of all system data</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Data Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Import/Export</CardTitle>
              <CardDescription>Import and export system data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Import Data</h3>
                <p className="text-sm text-muted-foreground mt-1">Import data from CSV, Excel, or JSON files</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                    <Button variant="outline" disabled>
                      <Database className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground mt-1">Export system data to various formats</p>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="export-type">Data Type</Label>
                      <Select defaultValue="meter-readings">
                        <SelectTrigger id="export-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meter-readings">Meter Readings</SelectItem>
                          <SelectItem value="devices">Smart Meters</SelectItem>
                          <SelectItem value="companies">Companies</SelectItem>
                          <SelectItem value="assignments">Assignments</SelectItem>
                          <SelectItem value="alerts">Alerts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="export-format">Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger id="export-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Perform system maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Database Optimization</h3>
                    <p className="text-sm text-muted-foreground mt-1">Optimize database performance and storage</p>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Optimize
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Clear Cache</h3>
                    <p className="text-sm text-muted-foreground mt-1">Clear system cache to free up memory</p>
                  </div>
                  <Button variant="outline">
                    <Trash className="mr-2 h-4 w-4" />
                    Clear Cache
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">System Backup</h3>
                    <p className="text-sm text-muted-foreground mt-1">Create a full system backup</p>
                  </div>
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-destructive">Reset System</h3>
                    <p className="text-sm text-muted-foreground mt-1">Reset the system to factory defaults</p>
                  </div>
                  <Button variant="destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

