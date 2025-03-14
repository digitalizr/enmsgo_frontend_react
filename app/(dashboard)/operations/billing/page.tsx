"use client"

import { useState } from "react"
import { CreditCard, DollarSign, Download, FileText, Filter, Mail, Plus, RefreshCw, Search, Send } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample data for subscriptions
const subscriptions = [
  {
    id: "SUB001",
    company: "Acme Corporation",
    plan: "Enterprise",
    status: "active",
    startDate: "2023-01-15",
    nextBillingDate: "2023-07-15",
    amount: 1299.99,
    billingCycle: "monthly",
    paymentMethod: "credit_card",
    metersAllowed: 50,
    usersAllowed: 25,
    metersUsed: 32,
    usersUsed: 18,
  },
  {
    id: "SUB002",
    company: "TechCorp",
    plan: "Professional",
    status: "active",
    startDate: "2023-02-10",
    nextBillingDate: "2023-07-10",
    amount: 699.99,
    billingCycle: "monthly",
    paymentMethod: "bank_transfer",
    metersAllowed: 25,
    usersAllowed: 15,
    metersUsed: 20,
    usersUsed: 12,
  },
  {
    id: "SUB003",
    company: "GlobalTech Industries",
    plan: "Enterprise",
    status: "active",
    startDate: "2023-03-05",
    nextBillingDate: "2023-07-05",
    amount: 1499.99,
    billingCycle: "monthly",
    paymentMethod: "credit_card",
    metersAllowed: 100,
    usersAllowed: 50,
    metersUsed: 78,
    usersUsed: 42,
  },
  {
    id: "SUB004",
    company: "Future Energy",
    plan: "Basic",
    status: "past_due",
    startDate: "2023-04-20",
    nextBillingDate: "2023-06-20",
    amount: 299.99,
    billingCycle: "monthly",
    paymentMethod: "credit_card",
    metersAllowed: 10,
    usersAllowed: 5,
    metersUsed: 8,
    usersUsed: 4,
  },
  {
    id: "SUB005",
    company: "Eco Solutions",
    plan: "Professional",
    status: "canceled",
    startDate: "2023-01-10",
    nextBillingDate: "2023-06-10",
    amount: 699.99,
    billingCycle: "monthly",
    paymentMethod: "bank_transfer",
    metersAllowed: 25,
    usersAllowed: 15,
    metersUsed: 0,
    usersUsed: 0,
  },
]

// Sample data for invoices
const invoices = [
  {
    id: "INV001",
    subscriptionId: "SUB001",
    company: "Acme Corporation",
    issueDate: "2023-06-15",
    dueDate: "2023-06-30",
    amount: 1299.99,
    status: "paid",
    paymentDate: "2023-06-20",
  },
  {
    id: "INV002",
    subscriptionId: "SUB002",
    company: "TechCorp",
    issueDate: "2023-06-10",
    dueDate: "2023-06-25",
    amount: 699.99,
    status: "paid",
    paymentDate: "2023-06-15",
  },
  {
    id: "INV003",
    subscriptionId: "SUB003",
    company: "GlobalTech Industries",
    issueDate: "2023-06-05",
    dueDate: "2023-06-20",
    amount: 1499.99,
    status: "paid",
    paymentDate: "2023-06-10",
  },
  {
    id: "INV004",
    subscriptionId: "SUB004",
    company: "Future Energy",
    issueDate: "2023-06-20",
    dueDate: "2023-07-05",
    amount: 299.99,
    status: "overdue",
    paymentDate: null,
  },
  {
    id: "INV005",
    subscriptionId: "SUB001",
    company: "Acme Corporation",
    issueDate: "2023-05-15",
    dueDate: "2023-05-30",
    amount: 1299.99,
    status: "paid",
    paymentDate: "2023-05-25",
  },
  {
    id: "INV006",
    subscriptionId: "SUB002",
    company: "TechCorp",
    issueDate: "2023-05-10",
    dueDate: "2023-05-25",
    amount: 699.99,
    status: "paid",
    paymentDate: "2023-05-20",
  },
  {
    id: "INV007",
    subscriptionId: "SUB003",
    company: "GlobalTech Industries",
    issueDate: "2023-05-05",
    dueDate: "2023-05-20",
    amount: 1499.99,
    status: "paid",
    paymentDate: "2023-05-15",
  },
  {
    id: "INV008",
    subscriptionId: "SUB005",
    company: "Eco Solutions",
    issueDate: "2023-05-10",
    dueDate: "2023-05-25",
    amount: 699.99,
    status: "paid",
    paymentDate: "2023-05-20",
  },
]

// Sample data for payment history
const paymentHistory = [
  {
    id: "PAY001",
    invoiceId: "INV001",
    company: "Acme Corporation",
    date: "2023-06-20",
    amount: 1299.99,
    method: "Credit Card",
    status: "successful",
    transactionId: "txn_1234567890",
  },
  {
    id: "PAY002",
    invoiceId: "INV002",
    company: "TechCorp",
    date: "2023-06-15",
    amount: 699.99,
    method: "Bank Transfer",
    status: "successful",
    transactionId: "txn_0987654321",
  },
  {
    id: "PAY003",
    invoiceId: "INV003",
    company: "GlobalTech Industries",
    date: "2023-06-10",
    amount: 1499.99,
    method: "Credit Card",
    status: "successful",
    transactionId: "txn_5678901234",
  },
  {
    id: "PAY004",
    invoiceId: "INV005",
    company: "Acme Corporation",
    date: "2023-05-25",
    amount: 1299.99,
    method: "Credit Card",
    status: "successful",
    transactionId: "txn_6789012345",
  },
  {
    id: "PAY005",
    invoiceId: "INV006",
    company: "TechCorp",
    date: "2023-05-20",
    amount: 699.99,
    method: "Bank Transfer",
    status: "successful",
    transactionId: "txn_7890123456",
  },
  {
    id: "PAY006",
    invoiceId: "INV007",
    company: "GlobalTech Industries",
    date: "2023-05-15",
    amount: 1499.99,
    method: "Credit Card",
    status: "successful",
    transactionId: "txn_8901234567",
  },
  {
    id: "PAY007",
    invoiceId: "INV008",
    company: "Eco Solutions",
    date: "2023-05-20",
    amount: 699.99,
    method: "Bank Transfer",
    status: "successful",
    transactionId: "txn_9012345678",
  },
]

// Sample companies data
const companies = [
  { id: "COM001", name: "Acme Corporation" },
  { id: "COM002", name: "TechCorp" },
  { id: "COM003", name: "GlobalTech Industries" },
  { id: "COM004", name: "Future Energy" },
  { id: "COM005", name: "Eco Solutions" },
  { id: "COM006", name: "PowerGrid Systems" },
  { id: "COM007", name: "Renewable Energy Co." },
  { id: "COM008", name: "Smart Buildings Inc." },
  { id: "COM009", name: "Green Power Ltd." },
  { id: "COM010", name: "Energy Innovations" },
]

// Subscription plans
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 299.99,
    metersAllowed: 10,
    usersAllowed: 5,
    features: ["Basic monitoring", "Standard reports", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 699.99,
    metersAllowed: 25,
    usersAllowed: 15,
    features: ["Advanced monitoring", "Custom reports", "Priority email support", "API access"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1299.99,
    metersAllowed: 50,
    usersAllowed: 25,
    features: ["Real-time monitoring", "Advanced analytics", "24/7 phone support", "API access", "Custom integrations"],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 2499.99,
    metersAllowed: 999,
    usersAllowed: 100,
    features: [
      "Unlimited monitoring",
      "Advanced analytics",
      "24/7 dedicated support",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
]

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("subscriptions")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isNewSubscriptionDialogOpen, setIsNewSubscriptionDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly")

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter invoices based on search term and selected company
  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCompany ? invoice.company === selectedCompany : true),
  )

  // Filter payment history based on search term and selected company
  const filteredPayments = paymentHistory.filter(
    (payment) =>
      (payment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCompany ? payment.company === selectedCompany : true),
  )

  // Calculate total revenue
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  // Calculate outstanding amount
  const outstandingAmount = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  // Get active subscriptions count
  const activeSubscriptionsCount = subscriptions.filter((sub) => sub.status === "active").length

  // Get overdue invoices count
  const overdueInvoicesCount = invoices.filter((invoice) => invoice.status === "overdue").length

  // Handle sending payment reminder
  const handleSendReminder = () => {
    // In a real application, this would send an API request
    console.log(`Sending payment reminder for invoice ${selectedInvoice?.id} to ${selectedInvoice?.company}`)
    setIsReminderDialogOpen(false)
  }

  // Handle creating a new subscription
  const handleCreateSubscription = () => {
    // In a real application, this would send an API request
    console.log(`Creating new subscription for plan ${selectedPlan} with billing cycle ${selectedBillingCycle}`)
    setIsNewSubscriptionDialogOpen(false)
  }

  // Get the selected plan details
  const getPlanDetails = (planId) => {
    return subscriptionPlans.find((plan) => plan.id === planId) || subscriptionPlans[1] // Default to Professional
  }

  // Calculate price based on billing cycle
  const calculatePrice = (basePrice, cycle) => {
    if (cycle === "annually") {
      return (basePrice * 10).toFixed(2) // 2 months free
    }
    return basePrice.toFixed(2)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
          <p className="text-muted-foreground">Manage customer subscriptions, invoices, and payments</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewSubscriptionDialogOpen} onOpenChange={setIsNewSubscriptionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Subscription</DialogTitle>
                <DialogDescription>
                  Assign a subscription plan to a company. Each plan has limits on the number of smart meters and users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Select defaultValue={companies[0].id}>
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Subscription Plan</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                      {subscriptionPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`flex flex-col space-y-2 rounded-lg border p-4 ${selectedPlan === plan.id ? "border-primary bg-primary/5" : ""}`}
                        >
                          <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                          <Label htmlFor={plan.id} className="cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-medium">{plan.name}</div>
                              <div className="text-lg font-bold">
                                ${calculatePrice(plan.price, selectedBillingCycle)}
                                <span className="text-sm font-normal text-muted-foreground">
                                  /{selectedBillingCycle === "monthly" ? "mo" : "yr"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                              <span className="mr-4">
                                <span className="font-medium">{plan.metersAllowed}</span> Smart Meters
                              </span>
                              <span>
                                <span className="font-medium">{plan.usersAllowed}</span> Users
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">{plan.features.join(" • ")}</div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Billing Cycle</Label>
                  <div className="flex rounded-lg border p-1">
                    <button
                      className={`flex-1 rounded-md px-3 py-2 text-center text-sm ${
                        selectedBillingCycle === "monthly" ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => setSelectedBillingCycle("monthly")}
                    >
                      Monthly
                    </button>
                    <button
                      className={`flex-1 rounded-md px-3 py-2 text-center text-sm ${
                        selectedBillingCycle === "annually" ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => setSelectedBillingCycle("annually")}
                    >
                      Annually (Save 16%)
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subscription</span>
                    <span>${calculatePrice(getPlanDetails(selectedPlan).price, selectedBillingCycle)}</span>
                  </div>
                  {selectedBillingCycle === "annually" && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-green-600">Annual discount</span>
                      <span className="text-green-600">-${(getPlanDetails(selectedPlan).price * 2).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="mt-3 border-t pt-3 flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>${calculatePrice(getPlanDetails(selectedPlan).price, selectedBillingCycle)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewSubscriptionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubscription}>Create Subscription</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${outstandingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{overdueInvoicesCount} overdue invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptionsCount}</div>
            <p className="text-xs text-muted-foreground">
              {((activeSubscriptionsCount / subscriptions.length) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / (subscriptions.filter((sub) => sub.status === "active").length || 1)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per active subscription</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="subscriptions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payments">Payment History</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${activeTab}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Company</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedCompany(null)}>All Companies</DropdownMenuItem>
                  {Array.from(new Set(subscriptions.map((sub) => sub.company))).map((company) => (
                    <DropdownMenuItem key={company} onClick={() => setSelectedCompany(company as string)}>
                      {company}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="subscriptions" className="mt-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subscription ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Smart Meters</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Next Billing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            No subscriptions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubscriptions.map((subscription) => (
                          <TableRow key={subscription.id}>
                            <TableCell className="font-medium">{subscription.id}</TableCell>
                            <TableCell>{subscription.company}</TableCell>
                            <TableCell>{subscription.plan}</TableCell>
                            <TableCell>${subscription.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              {subscription.metersUsed} / {subscription.metersAllowed}
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(subscription.metersUsed / subscription.metersAllowed) * 100}%` }}
                                ></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {subscription.usersUsed} / {subscription.usersAllowed}
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${(subscription.usersUsed / subscription.usersAllowed) * 100}%` }}
                                ></div>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(subscription.nextBillingDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {subscription.status === "active" ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : subscription.status === "past_due" ? (
                                <Badge variant="destructive">Past Due</Badge>
                              ) : (
                                <Badge variant="outline">Canceled</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Filter className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                                  <DropdownMenuItem>Upgrade Plan</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Cancel Subscription</DropdownMenuItem>
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

          <TabsContent value="invoices" className="mt-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.company}</TableCell>
                            <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              {invoice.status === "paid" ? (
                                <Badge className="bg-green-500">Paid</Badge>
                              ) : (
                                <Badge variant="destructive">Overdue</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {invoice.status === "overdue" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedInvoice(invoice)
                                      setIsReminderDialogOpen(true)
                                    }}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
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

          <TabsContent value="payments" className="mt-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No payments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.invoiceId}</TableCell>
                            <TableCell>{payment.company}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              {payment.status === "successful" ? (
                                <Badge className="bg-green-500">Successful</Badge>
                              ) : (
                                <Badge variant="destructive">Failed</Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a payment reminder to {selectedInvoice?.company} for invoice {selectedInvoice?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reminder-template">Reminder Template</Label>
              <Select defaultValue="friendly">
                <SelectTrigger id="reminder-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly Reminder</SelectItem>
                  <SelectItem value="standard">Standard Reminder</SelectItem>
                  <SelectItem value="urgent">Urgent Reminder</SelectItem>
                  <SelectItem value="final">Final Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reminder-message">Custom Message (Optional)</Label>
              <textarea
                id="reminder-message"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add a custom message to the reminder email..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="cc-admin" className="rounded border-gray-300" />
              <Label htmlFor="cc-admin">CC account manager</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReminder}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

