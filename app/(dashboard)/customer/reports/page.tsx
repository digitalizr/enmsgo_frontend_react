"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Plus,
  Mail,
  Share2,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  CheckCircle,
  Filter,
  FileBarChart,
  FilePieChart,
  FileLineChart,
  FileSpreadsheet,
  Search,
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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

// Sample data for reports
const reportsData = [
  {
    id: "R001",
    name: "Monthly Energy Consumption Report",
    type: "consumption",
    format: "pdf",
    createdAt: "2023-05-01T10:00:00Z",
    timeRange: "April 2023",
    shared: true,
    sharedWith: ["john.doe@example.com", "jane.smith@example.com"],
  },
  {
    id: "R002",
    name: "Weekly Peak Demand Analysis",
    type: "demand",
    format: "pdf",
    createdAt: "2023-05-08T14:30:00Z",
    timeRange: "May 1-7, 2023",
    shared: false,
    sharedWith: [],
  },
  {
    id: "R003",
    name: "Energy Cost Breakdown",
    type: "cost",
    format: "excel",
    createdAt: "2023-05-10T09:15:00Z",
    timeRange: "Q1 2023",
    shared: true,
    sharedWith: ["finance@example.com"],
  },
  {
    id: "R004",
    name: "Energy Efficiency Recommendations",
    type: "efficiency",
    format: "pdf",
    createdAt: "2023-05-12T16:45:00Z",
    timeRange: "Year to Date",
    shared: false,
    sharedWith: [],
  },
  {
    id: "R005",
    name: "Carbon Footprint Analysis",
    type: "sustainability",
    format: "pdf",
    createdAt: "2023-05-15T11:30:00Z",
    timeRange: "2023 YTD",
    shared: true,
    sharedWith: ["sustainability@example.com", "management@example.com"],
  },
]

// Sample data for report templates
const reportTemplatesData = [
  {
    id: "T001",
    name: "Monthly Consumption Summary",
    description: "A comprehensive overview of energy consumption for the month",
    type: "consumption",
    sections: ["Usage Overview", "Peak Demand Analysis", "Cost Breakdown", "Comparison to Previous Periods"],
    icon: FileBarChart,
  },
  {
    id: "T002",
    name: "Cost Analysis Report",
    description: "Detailed breakdown of energy costs and potential savings",
    type: "cost",
    sections: ["Cost Summary", "Time-of-Use Analysis", "Tariff Analysis", "Savings Opportunities"],
    icon: FileSpreadsheet,
  },
  {
    id: "T003",
    name: "Efficiency Recommendations",
    description: "AI-generated recommendations for improving energy efficiency",
    type: "efficiency",
    sections: ["Efficiency Score", "Recommendations", "Implementation Costs", "Potential Savings"],
    icon: FilePieChart,
  },
  {
    id: "T004",
    name: "Sustainability Report",
    description: "Analysis of carbon footprint and sustainability metrics",
    type: "sustainability",
    sections: ["Carbon Emissions", "Renewable Energy Usage", "Sustainability Goals", "Improvement Trends"],
    icon: FileLineChart,
  },
]

// Sample data for contact points
const contactPointsData = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Energy Manager",
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Facility Manager",
  },
  {
    id: "C003",
    name: "Finance Team",
    email: "finance@example.com",
    role: "Finance Department",
  },
  {
    id: "C004",
    name: "Sustainability Team",
    email: "sustainability@example.com",
    role: "Sustainability Department",
  },
  {
    id: "C005",
    name: "Management",
    email: "management@example.com",
    role: "Executive Team",
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateReportDialogOpen, setIsCreateReportDialogOpen] = useState(false)
  const [isShareReportDialogOpen, setIsShareReportDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(reportTemplatesData[0])
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  })

  const filteredReports = reportsData.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleShareReport = (report: any) => {
    setSelectedReport(report)
    setIsShareReportDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage energy consumption reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateReportDialogOpen} onOpenChange={setIsCreateReportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>Generate a new report based on your energy data</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <Tabs defaultValue="template" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="template">Use Template</TabsTrigger>
                    <TabsTrigger value="custom">Custom Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="template" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {reportTemplatesData.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id ? "border-primary" : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <template.icon className="h-8 w-8 text-primary" />
                              <CheckCircle
                                className={`h-5 w-5 ${
                                  selectedTemplate?.id === template.id ? "text-primary" : "text-transparent"
                                }`}
                              />
                            </div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>

                    {selectedTemplate && (
                      <div className="space-y-4 mt-6">
                        <div className="grid gap-2">
                          <Label htmlFor="report-name">Report Name</Label>
                          <Input
                            id="report-name"
                            defaultValue={`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Time Range</Label>
                          <DatePickerWithRange date={date} setDate={setDate} />
                        </div>

                        <div className="grid gap-2">
                          <Label>Report Format</Label>
                          <Select defaultValue="pdf">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                              <SelectItem value="csv">CSV File</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Included Sections</Label>
                          <div className="grid gap-2 mt-2">
                            {selectedTemplate.sections.map((section, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Checkbox id={`section-${index}`} defaultChecked />
                                <label
                                  htmlFor={`section-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {section}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="custom-report-name">Report Name</Label>
                        <Input id="custom-report-name" placeholder="Enter report name" />
                      </div>

                      <div className="grid gap-2">
                        <Label>Time Range</Label>
                        <DatePickerWithRange date={date} setDate={setDate} />
                      </div>

                      <div className="grid gap-2">
                        <Label>Report Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consumption">Energy Consumption</SelectItem>
                            <SelectItem value="demand">Peak Demand</SelectItem>
                            <SelectItem value="cost">Cost Analysis</SelectItem>
                            <SelectItem value="efficiency">Efficiency</SelectItem>
                            <SelectItem value="sustainability">Sustainability</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Report Format</Label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                            <SelectItem value="csv">CSV File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="report-description">Description (Optional)</Label>
                        <Textarea id="report-description" placeholder="Enter report description" />
                      </div>

                      <div className="space-y-2">
                        <Label>Data to Include</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-consumption" defaultChecked />
                            <label
                              htmlFor="include-consumption"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Energy Consumption
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-demand" defaultChecked />
                            <label
                              htmlFor="include-demand"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Peak Demand
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-cost" defaultChecked />
                            <label
                              htmlFor="include-cost"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Cost Analysis
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-comparison" defaultChecked />
                            <label
                              htmlFor="include-comparison"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Historical Comparison
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-recommendations" />
                            <label
                              htmlFor="include-recommendations"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Recommendations
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="include-charts" defaultChecked />
                            <label
                              htmlFor="include-charts"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Charts & Graphs
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateReportDialogOpen(false)}>Generate Report</Button>
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
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Format</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Time Range</TableHead>
              <TableHead className="hidden md:table-cell">Shared</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No reports found</p>
                    <Button variant="outline" size="sm" onClick={() => setIsCreateReportDialogOpen(true)}>
                      Create your first report
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="font-medium">{report.name}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={`
                      ${report.type === "consumption" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" : ""}
                      ${report.type === "demand" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400" : ""}
                      ${report.type === "cost" ? "bg-green-500/10 text-green-700 dark:text-green-400" : ""}
                      ${report.type === "efficiency" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : ""}
                      ${report.type === "sustainability" ? "bg-teal-500/10 text-teal-700 dark:text-teal-400" : ""}
                    `}
                    >
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{report.timeRange}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {report.shared ? (
                      <Badge variant="outline" className="bg-primary/10">
                        Shared ({report.sharedWith.length})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted">
                        Private
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareReport(report)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
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

      {/* Share Report Dialog */}
      <Dialog open={isShareReportDialogOpen} onOpenChange={setIsShareReportDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>Share this report with team members or stakeholders</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-muted rounded-md">
                <h3 className="font-medium">{selectedReport.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)} report for{" "}
                  {selectedReport.timeRange}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Share with Contact Points</Label>
                  <div className="grid gap-2 mt-2">
                    {contactPointsData.map((contact) => (
                      <div key={contact.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`contact-${contact.id}`}
                          defaultChecked={selectedReport.sharedWith.includes(contact.email)}
                        />
                        <label
                          htmlFor={`contact-${contact.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {contact.name} ({contact.email}) - {contact.role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="additional-emails">Additional Email Addresses</Label>
                  <Input id="additional-emails" placeholder="Enter email addresses separated by commas" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="share-message">Message (Optional)</Label>
                  <Textarea id="share-message" placeholder="Add a message to include with the shared report" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Sharing Options</Label>
                  <div className="grid gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-link" defaultChecked />
                      <label
                        htmlFor="option-link"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include link to view report online
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-attachment" defaultChecked />
                      <label
                        htmlFor="option-attachment"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include report as attachment
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-notify" defaultChecked />
                      <label
                        htmlFor="option-notify"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Notify me when recipients view the report
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsShareReportDialogOpen(false)}>
              <Mail className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

