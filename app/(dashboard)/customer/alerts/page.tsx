"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Sample data for alerts
const alertsData = [
  {
    id: "A001",
    type: "consumption",
    severity: "critical",
    title: "Unusual consumption detected",
    description: "Energy usage 35% higher than normal for this time",
    timestamp: "2023-05-15T14:30:00Z",
    status: "active",
    acknowledged: false,
  },
  {
    id: "A002",
    type: "demand",
    severity: "warning",
    title: "Peak demand approaching limit",
    description: "Peak demand reached 85% of your subscribed capacity",
    timestamp: "2023-05-14T13:15:00Z",
    status: "active",
    acknowledged: true,
  },
  {
    id: "A003",
    type: "consumption",
    severity: "info",
    title: "Energy usage 20% higher than average",
    description: "Consider reviewing equipment efficiency",
    timestamp: "2023-05-12T10:45:00Z",
    status: "active",
    acknowledged: false,
  },
  {
    id: "A004",
    type: "price",
    severity: "warning",
    title: "Energy price spike detected",
    description: "Current energy price is 30% above normal rates",
    timestamp: "2023-05-10T16:20:00Z",
    status: "active",
    acknowledged: true,
  },
  {
    id: "A005",
    type: "system",
    severity: "critical",
    title: "Smart meter connection lost",
    description: "Connection to smart meter lost for more than 2 hours",
    timestamp: "2023-05-08T09:10:00Z",
    status: "resolved",
    acknowledged: true,
    resolvedAt: "2023-05-08T11:45:00Z",
  },
]

// Sample data for alert rules
const alertRulesData = [
  {
    id: "R001",
    name: "High Consumption Alert",
    description: "Alert when consumption exceeds 20% above average",
    type: "consumption",
    threshold: 20,
    timeWindow: "1 hour",
    enabled: true,
    notifyVia: ["email", "sms"],
    contacts: ["primary", "energy-manager"],
  },
  {
    id: "R002",
    name: "Peak Demand Warning",
    description: "Alert when peak demand exceeds 80% of subscribed capacity",
    type: "demand",
    threshold: 80,
    timeWindow: "15 minutes",
    enabled: true,
    notifyVia: ["email"],
    contacts: ["primary"],
  },
  {
    id: "R003",
    name: "Price Spike Alert",
    description: "Alert when energy price exceeds $0.15/kWh",
    type: "price",
    threshold: 0.15,
    timeWindow: "real-time",
    enabled: false,
    notifyVia: ["email", "sms"],
    contacts: ["primary", "finance-team"],
  },
  {
    id: "R004",
    name: "Connection Loss Alert",
    description: "Alert when smart meter connection is lost",
    type: "system",
    threshold: null,
    timeWindow: "30 minutes",
    enabled: true,
    notifyVia: ["email"],
    contacts: ["primary", "it-support"],
  },
]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false)
  const [isViewAlertDialogOpen, setIsViewAlertDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)

  const filteredAlerts = alertsData.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRules = alertRulesData.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert)
    setIsViewAlertDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Anomalies</h1>
          <p className="text-muted-foreground">Monitor and manage alerts and anomaly detection</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts
                  .filter((alert) => alert.status === "active")
                  .map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        {alert.severity === "critical" ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Critical
                          </Badge>
                        ) : alert.severity === "warning" ? (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-400"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Warning
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Info
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground hidden sm:block">{alert.description}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {alert.type === "consumption" ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            Consumption
                          </Badge>
                        ) : alert.type === "demand" ? (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                            Demand
                          </Badge>
                        ) : alert.type === "price" ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                            Price
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                            System
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {alert.acknowledged ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            Acknowledged
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            New
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
                            <DropdownMenuItem onClick={() => handleViewAlert(alert)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Acknowledge
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4" />
                              Resolve
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Severity</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead className="hidden md:table-cell">Resolution</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts
                  .filter((alert) => alert.status === "resolved")
                  .map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        {alert.severity === "critical" ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Critical
                          </Badge>
                        ) : alert.severity === "warning" ? (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-400"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Warning
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Info
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground hidden sm:block">{alert.description}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {alert.type === "consumption" ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            Consumption
                          </Badge>
                        ) : alert.type === "demand" ? (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                            Demand
                          </Badge>
                        ) : alert.type === "price" ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                            Price
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                            System
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {alert.resolvedAt && new Date(alert.resolvedAt).toLocaleString()}
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
                            <DropdownMenuItem onClick={() => handleViewAlert(alert)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Alert Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Alert Rule</DialogTitle>
                  <DialogDescription>Configure a new alert rule to monitor your energy usage</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input id="name" placeholder="Enter rule name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter rule description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Alert Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumption">Consumption</SelectItem>
                          <SelectItem value="demand">Demand</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="threshold">Threshold</Label>
                      <Input id="threshold" type="number" placeholder="Enter threshold value" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timeWindow">Time Window</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time window" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="15min">15 minutes</SelectItem>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="1hour">1 hour</SelectItem>
                          <SelectItem value="1day">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Methods</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email" />
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms" />
                        <label
                          htmlFor="sms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          SMS
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="push" />
                        <label
                          htmlFor="push"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Push Notification
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Points</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="primary" />
                        <label
                          htmlFor="primary"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Primary Contact
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="energy-manager" />
                        <label
                          htmlFor="energy-manager"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Energy Manager
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="it-support" />
                        <label
                          htmlFor="it-support"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          IT Support
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRuleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddRuleDialogOpen(false)}>Create Rule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead>Rule Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Threshold</TableHead>
                  <TableHead className="hidden md:table-cell">Notifications</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Switch checked={rule.enabled} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">{rule.description}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {rule.type === "consumption" ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                          Consumption
                        </Badge>
                      ) : rule.type === "demand" ? (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                          Demand
                        </Badge>
                      ) : rule.type === "price" ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                          Price
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                          System
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {rule.threshold !== null ? (
                        <span>
                          {rule.threshold}
                          {rule.type === "price" ? "/kWh" : "%"}
                        </span>
                      ) : (
                        <span>N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {rule.notifyVia.map((method) => (
                          <Badge key={method} variant="outline" className="bg-secondary/50">
                            {method}
                          </Badge>
                        ))}
                      </div>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Rule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Alert Dialog */}
      <Dialog open={isViewAlertDialogOpen} onOpenChange={setIsViewAlertDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Alert Details</DialogTitle>
              {selectedAlert &&
                (selectedAlert.severity === "critical" ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Critical
                  </Badge>
                ) : selectedAlert.severity === "warning" ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-400"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Warning
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Info
                  </Badge>
                ))}
            </div>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedAlert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAlert.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Alert Type</h4>
                    <Badge
                      variant="outline"
                      className={`
                      ${selectedAlert.type === "consumption" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" : ""}
                      ${selectedAlert.type === "demand" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400" : ""}
                      ${selectedAlert.type === "price" ? "bg-green-500/10 text-green-700 dark:text-green-400" : ""}
                      ${selectedAlert.type === "system" ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" : ""}
                    `}
                    >
                      {selectedAlert.type.charAt(0).toUpperCase() + selectedAlert.type.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <Badge variant={selectedAlert.status === "active" ? "outline" : "secondary"}>
                      {selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Detected At</h4>
                    <p className="text-sm">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Acknowledged</h4>
                    <p className="text-sm">{selectedAlert.acknowledged ? "Yes" : "No"}</p>
                  </div>

                  {selectedAlert.resolvedAt && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Resolved At</h4>
                      <p className="text-sm">{new Date(selectedAlert.resolvedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                  <div className="space-y-2">
                    {selectedAlert.type === "consumption" && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            1
                          </div>
                          <p className="text-sm">Check for equipment that may have been left running</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            2
                          </div>
                          <p className="text-sm">Review HVAC settings and adjust if necessary</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            3
                          </div>
                          <p className="text-sm">Check for malfunctioning equipment or leaks</p>
                        </div>
                      </>
                    )}

                    {selectedAlert.type === "demand" && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            1
                          </div>
                          <p className="text-sm">Temporarily reduce non-essential equipment usage</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            2
                          </div>
                          <p className="text-sm">Stagger operation of high-power equipment</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            3
                          </div>
                          <p className="text-sm">
                            Consider increasing your subscribed capacity if this occurs frequently
                          </p>
                        </div>
                      </>
                    )}

                    {selectedAlert.type === "price" && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            1
                          </div>
                          <p className="text-sm">Reduce non-essential energy usage during high-price periods</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            2
                          </div>
                          <p className="text-sm">
                            Shift energy-intensive operations to lower-price periods if possible
                          </p>
                        </div>
                      </>
                    )}

                    {selectedAlert.type === "system" && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            1
                          </div>
                          <p className="text-sm">Check physical connection to the smart meter</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            2
                          </div>
                          <p className="text-sm">Verify network connectivity in the area</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                            3
                          </div>
                          <p className="text-sm">Contact support if the issue persists</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            {selectedAlert && selectedAlert.status === "active" && (
              <>
                {!selectedAlert.acknowledged && (
                  <Button variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Acknowledge
                  </Button>
                )}
                <Button variant="default">
                  <XCircle className="mr-2 h-4 w-4" />
                  Resolve Alert
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsViewAlertDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

