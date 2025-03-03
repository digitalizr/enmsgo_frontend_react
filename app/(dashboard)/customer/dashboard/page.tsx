"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Zap,
  DollarSign,
  TrendingDown,
  AlertCircle,
  Calendar,
  Download,
  BrainCircuit,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

// Sample data for energy consumption
const dailyConsumptionData = [
  { time: "00:00", consumption: 42, cost: 4.2 },
  { time: "03:00", consumption: 30, cost: 3.0 },
  { time: "06:00", consumption: 35, cost: 3.5 },
  { time: "09:00", consumption: 70, cost: 7.0 },
  { time: "12:00", consumption: 85, cost: 8.5 },
  { time: "15:00", consumption: 80, cost: 8.0 },
  { time: "18:00", consumption: 90, cost: 9.0 },
  { time: "21:00", consumption: 65, cost: 6.5 },
]

const weeklyConsumptionData = [
  { day: "Mon", consumption: 540, cost: 54.0 },
  { day: "Tue", consumption: 620, cost: 62.0 },
  { day: "Wed", consumption: 580, cost: 58.0 },
  { day: "Thu", consumption: 610, cost: 61.0 },
  { day: "Fri", consumption: 670, cost: 67.0 },
  { day: "Sat", consumption: 480, cost: 48.0 },
  { day: "Sun", consumption: 420, cost: 42.0 },
]

const monthlyConsumptionData = [
  { month: "Jan", consumption: 15200, cost: 1520 },
  { month: "Feb", consumption: 14800, cost: 1480 },
  { month: "Mar", consumption: 15600, cost: 1560 },
  { month: "Apr", consumption: 16200, cost: 1620 },
  { month: "May", consumption: 17500, cost: 1750 },
  { month: "Jun", consumption: 18900, cost: 1890 },
  { month: "Jul", consumption: 19800, cost: 1980 },
  { month: "Aug", consumption: 19500, cost: 1950 },
  { month: "Sep", consumption: 18200, cost: 1820 },
  { month: "Oct", consumption: 17100, cost: 1710 },
  { month: "Nov", consumption: 16300, cost: 1630 },
  { month: "Dec", consumption: 16800, cost: 1680 },
]

const yearlyConsumptionData = [
  { year: "2019", consumption: 195000, cost: 19500 },
  { year: "2020", consumption: 187000, cost: 18700 },
  { year: "2021", consumption: 201000, cost: 20100 },
  { year: "2022", consumption: 210000, cost: 21000 },
  { year: "2023", consumption: 198000, cost: 19800 },
  { year: "2024", consumption: 92000, cost: 9200, predicted: true },
]

export default function CustomerDashboard() {
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze your energy consumption</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">497 kWh</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
              <span>5.2% less than yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$49.70</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
              <span>5.2% less than yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Consumption</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17,500 kWh</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="mr-1 h-4 w-4 text-amber-500" />
              <span>8.0% more than last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Monthly Cost</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,750.00</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="mr-1 h-4 w-4 text-amber-500" />
              <span>8.0% more than last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Energy Consumption & Cost</CardTitle>
              <CardDescription>Hourly energy usage and cost for today</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyConsumptionData}>
                    <defs>
                      <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-consumption)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-consumption)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="consumption"
                      stroke="var(--color-consumption)"
                      fillOpacity={1}
                      fill="url(#colorConsumption)"
                      name="Consumption (kWh)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      stroke="var(--color-cost)"
                      fillOpacity={1}
                      fill="url(#colorCost)"
                      name="Cost ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Energy Consumption & Cost</CardTitle>
              <CardDescription>Daily energy usage and cost for the current week</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="consumption"
                      fill="var(--color-consumption)"
                      name="Consumption (kWh)"
                    />
                    <Bar yAxisId="right" dataKey="cost" fill="var(--color-cost)" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Energy Consumption & Cost</CardTitle>
              <CardDescription>Monthly energy usage and cost for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="consumption"
                      stroke="var(--color-consumption)"
                      activeDot={{ r: 8 }}
                      name="Consumption (kWh)"
                    />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="var(--color-cost)" name="Cost ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Energy Consumption & Cost</CardTitle>
              <CardDescription>Annual energy usage and cost with prediction for current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="consumption"
                      fill={(entry) => (entry.predicted ? "url(#patternConsumption)" : "var(--color-consumption)")}
                      name="Consumption (kWh)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="cost"
                      fill={(entry) => (entry.predicted ? "url(#patternCost)" : "var(--color-cost)")}
                      name="Cost ($)"
                    />
                    <defs>
                      <pattern
                        id="patternConsumption"
                        patternUnits="userSpaceOnUse"
                        width="4"
                        height="4"
                        patternTransform="rotate(45)"
                      >
                        <rect width="2" height="4" fill="var(--color-consumption)" fillOpacity="0.7" />
                      </pattern>
                      <pattern
                        id="patternCost"
                        patternUnits="userSpaceOnUse"
                        width="4"
                        height="4"
                        patternTransform="rotate(45)"
                      >
                        <rect width="2" height="4" fill="var(--color-cost)" fillOpacity="0.7" />
                      </pattern>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Recent energy usage alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "critical",
                  title: "Unusual consumption detected",
                  time: "Today at 2:30 PM",
                  description: "Energy usage 35% higher than normal for this time",
                },
                {
                  type: "warning",
                  title: "Peak demand approaching limit",
                  time: "Yesterday at 1:15 PM",
                  description: "Peak demand reached 85% of your subscribed capacity",
                },
                {
                  type: "info",
                  title: "Energy usage 20% higher than average",
                  time: "May 12 at 10:45 AM",
                  description: "Consider reviewing equipment efficiency",
                },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.type === "critical"
                        ? "text-destructive"
                        : alert.type === "warning"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium leading-none">{alert.title}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Smart recommendations to optimize energy usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Optimize HVAC Schedule",
                  description:
                    "Adjusting your HVAC schedule to reduce operation during non-business hours could save up to 15% on energy costs.",
                  savings: "$262.50",
                },
                {
                  title: "Lighting Efficiency",
                  description:
                    "Replacing current lighting with LED alternatives would reduce consumption by approximately 8%.",
                  savings: "$140.00",
                },
                {
                  title: "Peak Demand Management",
                  description: "Implementing load shifting strategies could reduce peak demand charges by up to 20%.",
                  savings: "$350.00",
                },
              ].map((recommendation, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <span className="text-sm font-medium text-green-500">Save {recommendation.savings}/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

