"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

// Sample data for charts
const deviceStatusData = [
  { name: "Smart Meters", active: 850, inactive: 116, maintenance: 42, error: 24 },
  { name: "Edge Gateways", active: 282, inactive: 38, maintenance: 12, error: 8 },
]

const deviceTypeData = [
  { name: "Smart Meters", value: 1032 },
  { name: "Edge Gateways", value: 340 },
  { name: "Sensors", value: 216 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const manufacturerData = [
  { name: "Smart Meters", elmeasure: 420, huawei: 380, siemens: 120, schneider: 80, abb: 32 },
  { name: "Edge Gateways", elmeasure: 140, huawei: 120, siemens: 40, schneider: 30, abb: 10 },
]

const companySizeData = [{ name: "Companies", small: 18, medium: 12, large: 4, enterprise: 2 }]

const industryUsageData = [
  {
    name: "Average kWh/month",
    manufacturing: 12500,
    commercial: 8200,
    healthcare: 9800,
    education: 7500,
    retail: 6200,
  },
]

const deviceGrowthData = [
  { month: "Jan", devices: 980 },
  { month: "Feb", devices: 1020 },
  { month: "Mar", devices: 1080 },
  { month: "Apr", devices: 1120 },
  { month: "May", devices: 1180 },
  { month: "Jun", devices: 1240 },
  { month: "Jul", devices: 1280 },
  { month: "Aug", devices: 1320 },
  { month: "Sep", devices: 1372 },
]

const companyGrowthData = [
  { month: "Jan", companies: 28 },
  { month: "Feb", companies: 29 },
  { month: "Mar", companies: 30 },
  { month: "Apr", companies: 31 },
  { month: "May", companies: 32 },
  { month: "Jun", companies: 33 },
  { month: "Jul", companies: 34 },
  { month: "Aug", companies: 35 },
  { month: "Sep", companies: 36 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Analyze your operations data and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Smart Meters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+156 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Smart Meters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,132</div>
            <p className="text-xs text-muted-foreground">90.7% of total meters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Device Status Distribution</CardTitle>
                <CardDescription>Distribution of devices by status</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" fill="#0088FE" name="Active" />
                      <Bar dataKey="inactive" fill="#00C49F" name="Inactive" />
                      <Bar dataKey="maintenance" fill="#FFBB28" name="Maintenance" />
                      <Bar dataKey="error" fill="#FF8042" name="Error" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Distribution by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Device Manufacturers</CardTitle>
              <CardDescription>Distribution of devices by manufacturer</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={manufacturerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="elmeasure" fill="#0088FE" name="Elmeasure" />
                    <Bar dataKey="huawei" fill="#00C49F" name="Huawei" />
                    <Bar dataKey="siemens" fill="#FFBB28" name="Siemens" />
                    <Bar dataKey="schneider" fill="#FF8042" name="Schneider" />
                    <Bar dataKey="abb" fill="#8884D8" name="ABB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Companies by Size</CardTitle>
              <CardDescription>Distribution of companies by number of devices</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companySizeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="small" fill="#0088FE" name="Small (1-10)" />
                    <Bar dataKey="medium" fill="#00C49F" name="Medium (11-50)" />
                    <Bar dataKey="large" fill="#FFBB28" name="Large (51-100)" />
                    <Bar dataKey="enterprise" fill="#FF8042" name="Enterprise (100+)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Usage by Industry</CardTitle>
              <CardDescription>Average energy consumption by industry sector</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="manufacturing" fill="#0088FE" name="Manufacturing" />
                    <Bar dataKey="commercial" fill="#00C49F" name="Commercial" />
                    <Bar dataKey="healthcare" fill="#FFBB28" name="Healthcare" />
                    <Bar dataKey="education" fill="#FF8042" name="Education" />
                    <Bar dataKey="retail" fill="#8884D8" name="Retail" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Growth</CardTitle>
                <CardDescription>Number of devices added over time</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deviceGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="devices" stroke="#0088FE" activeDot={{ r: 8 }} name="Devices" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Company Growth</CardTitle>
                <CardDescription>Number of companies added over time</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={companyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="companies"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        name="Companies"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

