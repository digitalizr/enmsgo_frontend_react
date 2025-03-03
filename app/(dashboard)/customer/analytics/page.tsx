"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Download,
  BarChart2,
  PieChart,
  TrendingUp,
  Activity,
  Zap,
  DollarSign,
  Clock,
  Filter,
  Share2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Sample data for energy consumption
const energyConsumptionData = [
  { month: "Jan", consumption: 420, peak: 520, average: 380, cost: 1260 },
  { month: "Feb", consumption: 380, peak: 480, average: 350, cost: 1140 },
  { month: "Mar", consumption: 450, peak: 540, average: 400, cost: 1350 },
  { month: "Apr", consumption: 470, peak: 570, average: 420, cost: 1410 },
  { month: "May", consumption: 540, peak: 640, average: 490, cost: 1620 },
  { month: "Jun", consumption: 580, peak: 680, average: 530, cost: 1740 },
  { month: "Jul", consumption: 620, peak: 720, average: 570, cost: 1860 },
  { month: "Aug", consumption: 590, peak: 690, average: 540, cost: 1770 },
  { month: "Sep", consumption: 520, peak: 620, average: 470, cost: 1560 },
  { month: "Oct", consumption: 480, peak: 580, average: 430, cost: 1440 },
  { month: "Nov", consumption: 430, peak: 530, average: 380, cost: 1290 },
  { month: "Dec", consumption: 460, peak: 560, average: 410, cost: 1380 },
]

// Sample data for daily consumption
const dailyConsumptionData = Array.from({ length: 24 }, (_, i) => {
  const hour = i
  const baseConsumption = 20 + Math.sin(i / 3) * 15
  return {
    hour: `${hour}:00`,
    consumption: Math.round(baseConsumption + Math.random() * 10),
    cost: Math.round((baseConsumption + Math.random() * 10) * 0.15 * 100) / 100,
  }
})

// Sample data for energy distribution
const energyDistributionData = [
  { name: "HVAC", value: 45 },
  { name: "Lighting", value: 20 },
  { name: "Equipment", value: 25 },
  { name: "Other", value: 10 },
]

// Sample data for peak demand times
const peakDemandData = [
  { time: "6:00", demand: 120 },
  { time: "8:00", demand: 280 },
  { time: "10:00", demand: 320 },
  { time: "12:00", demand: 350 },
  { time: "14:00", demand: 370 },
  { time: "16:00", demand: 390 },
  { time: "18:00", demand: 320 },
  { time: "20:00", demand: 270 },
  { time: "22:00", demand: 190 },
]

// Sample data for energy efficiency score
const efficiencyScoreData = [
  { name: "Your Score", value: 78 },
  { name: "Remaining", value: 22 },
]

// Sample data for cost breakdown
const costBreakdownData = [
  { name: "Peak Hours", value: 55 },
  { name: "Off-Peak", value: 30 },
  { name: "Demand Charges", value: 15 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]
const EFFICIENCY_COLORS = ["#4CAF50", "#F5F5F5"]
const COST_COLORS = ["#FF5722", "#2196F3", "#FFC107"]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}{" "}
            {entry.name?.toString().includes("cost")
              ? "$"
              : entry.name?.toString().includes("consumption")
                ? "kWh"
                : ""}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export default function AnalyticsPage() {
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Analytics</h1>
          <p className="text-muted-foreground">Analyze your energy consumption patterns and costs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
          <Select defaultValue="facility1">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facility1">Main Facility</SelectItem>
              <SelectItem value="facility2">Warehouse</SelectItem>
              <SelectItem value="facility3">Office Building</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,540 kWh</div>
            <p className="text-xs text-muted-foreground">+12% from previous period</p>
            <div className="mt-4 h-1 w-full bg-muted">
              <div className="h-1 w-[75%] bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">75% of your monthly allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,962.00</div>
            <p className="text-xs text-muted-foreground">+8% from previous period</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                $0.30/kWh
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                Avg. Rate
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">390 kW</div>
            <p className="text-xs text-muted-foreground">-5% from previous period</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                2:00 PM - 4:00 PM
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                Peak Time
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78/100</div>
            <p className="text-xs text-muted-foreground">+3 points from previous period</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                Good
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                Improving
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">
            <BarChart2 className="mr-2 h-4 w-4" />
            Consumption
          </TabsTrigger>
          <TabsTrigger value="cost">
            <DollarSign className="mr-2 h-4 w-4" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="demand">
            <Activity className="mr-2 h-4 w-4" />
            Demand
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChart className="mr-2 h-4 w-4" />
            Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Energy Consumption</CardTitle>
              <CardDescription>View your energy consumption trends over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={energyConsumptionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="consumption" name="Consumption (kWh)" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="peak" name="Peak Demand (kW)" fill="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="average" name="Average (kWh)" stroke="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily View</SelectItem>
                    <SelectItem value="weekly">Weekly View</SelectItem>
                    <SelectItem value="monthly">Monthly View</SelectItem>
                    <SelectItem value="yearly">Yearly View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Custom Range
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Consumption Pattern</CardTitle>
              <CardDescription>Hourly energy consumption for the selected day</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyConsumptionData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="consumption"
                      name="Consumption (kWh)"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Select defaultValue="today">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  <Clock className="mr-2 h-4 w-4" />
                  Peak Hours: 2:00 PM - 6:00 PM
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Trends</CardTitle>
                <CardDescription>Energy cost breakdown over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={energyConsumptionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="cost" name="Cost ($)" stroke="#FF5722" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Distribution of energy costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COST_COLORS[index % COST_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#FF5722] mr-2" />
                      <span>Peak Hours</span>
                    </div>
                    <span className="font-medium">$1,079.10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#2196F3] mr-2" />
                      <span>Off-Peak</span>
                    </div>
                    <span className="font-medium">$588.60</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#FFC107] mr-2" />
                      <span>Demand Charges</span>
                    </div>
                    <span className="font-medium">$294.30</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
              <CardDescription>Potential savings based on usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                        <Clock className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Shift Peak Usage</h4>
                        <p className="text-sm text-muted-foreground">Shift 20% of peak hour usage to off-peak hours</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">$215.82</p>
                      <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                        <Activity className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Reduce Peak Demand</h4>
                        <p className="text-sm text-muted-foreground">
                          Lower peak demand by 10% through load management
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">$147.15</p>
                      <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                        <Zap className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Lighting Efficiency</h4>
                        <p className="text-sm text-muted-foreground">Upgrade to LED lighting throughout facility</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">$98.10</p>
                      <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Detailed Savings Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Demand Analysis</CardTitle>
              <CardDescription>Hourly peak demand patterns</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={peakDemandData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="demand" name="Demand (kW)" stroke="#FF5722" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  Peak Time: 2:00 PM - 4:00 PM
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Demand Response Events</CardTitle>
                <CardDescription>Recent and upcoming demand response events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-amber-500/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Critical Peak Event</h4>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM - 6:00 PM</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-400">
                        Upcoming
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-sm">Reduce load by 15% during event hours to avoid peak charges.</p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Standard Peak Alert</h4>
                        <p className="text-sm text-muted-foreground">May 15, 2023, 1:00 PM - 5:00 PM</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Completed
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-sm">Successfully reduced load by 18% during event hours.</p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand Reduction Strategies</CardTitle>
                <CardDescription>Recommended actions to reduce peak demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <Clock className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Load Shifting</h4>
                      <p className="text-sm text-muted-foreground">
                        Schedule energy-intensive operations during off-peak hours
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <Activity className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Load Shedding</h4>
                      <p className="text-sm text-muted-foreground">
                        Temporarily reduce non-essential equipment usage during peak times
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                      <Zap className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Energy Storage</h4>
                      <p className="text-sm text-muted-foreground">
                        Use battery storage systems to reduce grid demand during peak periods
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create Demand Response Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Energy Usage Distribution</CardTitle>
                <CardDescription>Breakdown of energy consumption by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={energyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {energyDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#0088FE] mr-2" />
                      <span>HVAC</span>
                    </div>
                    <span className="font-medium">2,943 kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#00C49F] mr-2" />
                      <span>Lighting</span>
                    </div>
                    <span className="font-medium">1,308 kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#FFBB28] mr-2" />
                      <span>Equipment</span>
                    </div>
                    <span className="font-medium">1,635 kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#FF8042] mr-2" />
                      <span>Other</span>
                    </div>
                    <span className="font-medium">654 kWh</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Score</CardTitle>
                <CardDescription>Your energy efficiency rating compared to industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={efficiencyScoreData}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {efficiencyScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EFFICIENCY_COLORS[index % EFFICIENCY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-2xl font-bold">78/100</h3>
                  <p className="text-sm text-muted-foreground">Your Efficiency Score</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Industry Average</span>
                    <span className="text-sm font-medium">65/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Top Performers</span>
                    <span className="text-sm font-medium">85/100</span>
                  </div>
                  <Button className="w-full mt-2">View Improvement Recommendations</Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Energy Usage by Time of Day</CardTitle>
              <CardDescription>Distribution of energy consumption throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyConsumptionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="consumption" name="Consumption (kWh)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  Working Hours: 8:00 AM - 6:00 PM
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

