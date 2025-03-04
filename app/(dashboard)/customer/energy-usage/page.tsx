"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Zap, DollarSign, Clock, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for energy consumption
const hourlyConsumptionData = [
  { hour: "00:00", consumption: 42, demand: 35, cost: 4.2 },
  { hour: "01:00", consumption: 38, demand: 32, cost: 3.8 },
  { hour: "02:00", consumption: 35, demand: 30, cost: 3.5 },
  { hour: "03:00", consumption: 30, demand: 28, cost: 3.0 },
  { hour: "04:00", consumption: 32, demand: 29, cost: 3.2 },
  { hour: "05:00", consumption: 35, demand: 31, cost: 3.5 },
  { hour: "06:00", consumption: 45, demand: 38, cost: 4.5 },
  { hour: "07:00", consumption: 58, demand: 45, cost: 5.8 },
  { hour: "08:00", consumption: 65, demand: 52, cost: 6.5 },
  { hour: "09:00", consumption: 70, demand: 58, cost: 7.0 },
  { hour: "10:00", consumption: 75, demand: 62, cost: 7.5 },
  { hour: "11:00", consumption: 80, demand: 65, cost: 8.0 },
  { hour: "12:00", consumption: 85, demand: 68, cost: 8.5 },
  { hour: "13:00", consumption: 82, demand: 66, cost: 8.2 },
  { hour: "14:00", consumption: 80, demand: 64, cost: 8.0 },
  { hour: "15:00", consumption: 78, demand: 62, cost: 7.8 },
  { hour: "16:00", consumption: 75, demand: 60, cost: 7.5 },
  { hour: "17:00", consumption: 72, demand: 58, cost: 7.2 },
  { hour: "18:00", consumption: 70, demand: 56, cost: 7.0 },
  { hour: "19:00", consumption: 68, demand: 54, cost: 6.8 },
  { hour: "20:00", consumption: 65, demand: 52, cost: 6.5 },
  { hour: "21:00", consumption: 60, demand: 48, cost: 6.0 },
  { hour: "22:00", consumption: 55, demand: 45, cost: 5.5 },
  { hour: "23:00", consumption: 48, demand: 40, cost: 4.8 },
]

const dailyConsumptionData = [
  { day: "Mon", consumption: 1250, demand: 85, cost: 125.0, baseline: 1300 },
  { day: "Tue", consumption: 1180, demand: 82, cost: 118.0, baseline: 1300 },
  { day: "Wed", consumption: 1320, demand: 88, cost: 132.0, baseline: 1300 },
  { day: "Thu", consumption: 1450, demand: 95, cost: 145.0, baseline: 1300 },
  { day: "Fri", consumption: 1380, demand: 92, cost: 138.0, baseline: 1300 },
  { day: "Sat", consumption: 980, demand: 75, cost: 98.0, baseline: 1000 },
  { day: "Sun", consumption: 850, demand: 68, cost: 85.0, baseline: 1000 },
]

const monthlyConsumptionData = [
  { month: "Jan", consumption: 32500, demand: 95, cost: 3250, baseline: 35000 },
  { month: "Feb", consumption: 29800, demand: 92, cost: 2980, baseline: 35000 },
  { month: "Mar", consumption: 31200, demand: 94, cost: 3120, baseline: 35000 },
  { month: "Apr", consumption: 30500, demand: 93, cost: 3050, baseline: 35000 },
  { month: "May", consumption: 33800, demand: 96, cost: 3380, baseline: 35000 },
  { month: "Jun", consumption: 38500, demand: 105, cost: 3850, baseline: 35000 },
  { month: "Jul", consumption: 42000, demand: 110, cost: 4200, baseline: 35000 },
  { month: "Aug", consumption: 41500, demand: 108, cost: 4150, baseline: 35000 },
  { month: "Sep", consumption: 36800, demand: 98, cost: 3680, baseline: 35000 },
  { month: "Oct", consumption: 34200, demand: 96, cost: 3420, baseline: 35000 },
  { month: "Nov", consumption: 33500, demand: 95, cost: 3350, baseline: 35000 },
  { month: "Dec", consumption: 35800, demand: 97, cost: 3580, baseline: 35000 },
]

const yearlyConsumptionData = [
  { year: "2018", consumption: 380000, demand: 110, cost: 38000, baseline: 400000 },
  { year: "2019", consumption: 395000, demand: 115, cost: 39500, baseline: 400000 },
  { year: "2020", consumption: 360000, demand: 105, cost: 36000, baseline: 400000 },
  { year: "2021", consumption: 410000, demand: 120, cost: 41000, baseline: 400000 },
  { year: "2022", consumption: 425000, demand: 125, cost: 42500, baseline: 400000 },
  { year: "2023", consumption: 415000, demand: 122, cost: 41500, baseline: 400000 },
]

const usageByAreaData = [
  { name: "HVAC", value: 45 },
  { name: "Lighting", value: 20 },
  { name: "Equipment", value: 15 },
  { name: "IT Infrastructure", value: 12 },
  { name: "Other", value: 8 },
]

const timeOfUseData = [
  { name: "Off-Peak", value: 35, cost: 0.08 },
  { name: "Mid-Peak", value: 40, cost: 0.12 },
  { name: "On-Peak", value: 25, cost: 0.2 },
]

const peakDemandData = [
  { day: "Mon", time: "14:30", demand: 85 },
  { day: "Tue", time: "15:00", demand: 82 },
  { day: "Wed", time: "14:15", demand: 88 },
  { day: "Thu", time: "13:45", demand: 95 },
  { day: "Fri", time: "14:30", demand: 92 },
  { day: "Sat", time: "12:00", demand: 75 },
  { day: "Sun", time: "13:30", demand: 68 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
const TOU_COLORS = ["#82ca9d", "#8884d8", "#ff7c43"]

export default function EnergyUsagePage() {
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const [viewType, setViewType] = useState("consumption")

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Usage</h1>
          <p className="text-muted-foreground">Detailed analysis of your energy consumption</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284 kWh</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <TrendingDown className="h-3 w-3 mr-1" />
                5.2% vs. last period
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$257.20</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.8% vs. last period
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68 kW</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                <TrendingDown className="h-3 w-3 mr-1" />
                2.1% vs. last period
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Occurred on May 15, 2:30 PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button
            variant={viewType === "consumption" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("consumption")}
          >
            <Zap className="mr-2 h-4 w-4" />
            Consumption
          </Button>
          <Button variant={viewType === "cost" ? "default" : "outline"} size="sm" onClick={() => setViewType("cost")}>
            <DollarSign className="mr-2 h-4 w-4" />
            Cost
          </Button>
          <Button
            variant={viewType === "demand" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("demand")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Demand
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select defaultValue="kWh">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kWh">kWh</SelectItem>
              <SelectItem value="MWh">MWh</SelectItem>
              <SelectItem value="kW">kW</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="hourly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Hourly Energy {viewType === "consumption" ? "Consumption" : viewType === "cost" ? "Cost" : "Demand"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-hidden">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  demand: {
                    label: "Demand (kW)",
                    color: "hsl(var(--chart-2))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {viewType === "consumption" ? (
                    <AreaChart data={hourlyConsumptionData}>
                      <defs>
                        <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-consumption)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-consumption)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke="var(--color-consumption)"
                        fillOpacity={1}
                        fill="url(#colorConsumption)"
                      />
                    </AreaChart>
                  ) : viewType === "cost" ? (
                    <BarChart data={hourlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="var(--color-cost)" />
                    </BarChart>
                  ) : (
                    <LineChart data={hourlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Energy Usage by Area</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    value: {
                      label: "Percentage (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <RechartsPieChart>
                      <Pie
                        data={usageByAreaData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usageByAreaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time of Use Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    value: {
                      label: "Percentage (%)",
                      color: "hsl(var(--chart-1))",
                    },
                    cost: {
                      label: "Cost ($/kWh)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <ComposedChart data={timeOfUseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="value" fill="var(--color-value)">
                        {timeOfUseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TOU_COLORS[index % TOU_COLORS.length]} />
                        ))}
                      </Bar>
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Daily Energy {viewType === "consumption" ? "Consumption" : viewType === "cost" ? "Cost" : "Demand"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-hidden">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  baseline: {
                    label: "Baseline (kWh)",
                    color: "hsl(var(--chart-2))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-3))",
                  },
                  demand: {
                    label: "Demand (kW)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {viewType === "consumption" ? (
                    <ComposedChart data={dailyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="consumption" fill="var(--color-consumption)" />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="var(--color-baseline)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  ) : viewType === "cost" ? (
                    <BarChart data={dailyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="var(--color-cost)" />
                    </BarChart>
                  ) : (
                    <LineChart data={dailyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Peak Demand</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    demand: {
                      label: "Demand (kW)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <BarChart data={peakDemandData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Day</span>
                                    <span className="font-bold text-xs">{payload[0].payload.day}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                    <span className="font-bold text-xs">{payload[0].payload.time}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Demand</span>
                                    <span className="font-bold text-xs">{payload[0].value} kW</span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="demand" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Consumption vs. Cost</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
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
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <ComposedChart data={dailyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="consumption" fill="var(--color-consumption)" />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="var(--color-cost)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Monthly Energy {viewType === "consumption" ? "Consumption" : viewType === "cost" ? "Cost" : "Demand"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-hidden">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  baseline: {
                    label: "Baseline (kWh)",
                    color: "hsl(var(--chart-2))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-3))",
                  },
                  demand: {
                    label: "Demand (kW)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {viewType === "consumption" ? (
                    <ComposedChart data={monthlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="consumption" fill="var(--color-consumption)" />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="var(--color-baseline)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  ) : viewType === "cost" ? (
                    <AreaChart data={monthlyConsumptionData}>
                      <defs>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="var(--color-cost)"
                        fillOpacity={1}
                        fill="url(#colorCost)"
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={monthlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Consumption Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    consumption: {
                      label: "Consumption (kWh)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <AreaChart data={monthlyConsumptionData}>
                      <defs>
                        <linearGradient id="colorMonthlyConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-consumption)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-consumption)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke="var(--color-consumption)"
                        fillOpacity={1}
                        fill="url(#colorMonthlyConsumption)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    cost: {
                      label: "Cost ($)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <BarChart data={monthlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="var(--color-cost)">
                        {monthlyConsumptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cost > 3500 ? "#ff7300" : "var(--color-cost)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Yearly Energy {viewType === "consumption" ? "Consumption" : viewType === "cost" ? "Cost" : "Demand"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-hidden">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  baseline: {
                    label: "Baseline (kWh)",
                    color: "hsl(var(--chart-2))",
                  },
                  cost: {
                    label: "Cost ($)",
                    color: "hsl(var(--chart-3))",
                  },
                  demand: {
                    label: "Demand (kW)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {viewType === "consumption" ? (
                    <ComposedChart data={yearlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="consumption" fill="var(--color-consumption)" />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="var(--color-baseline)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  ) : viewType === "cost" ? (
                    <BarChart data={yearlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="var(--color-cost)" />
                    </BarChart>
                  ) : (
                    <LineChart data={yearlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <ChartContainer
                  config={{
                    consumption: {
                      label: "Consumption (kWh)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <BarChart data={yearlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="consumption" fill="var(--color-consumption)">
                        {yearlyConsumptionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.consumption > entry.baseline ? "#ff7300" : "#82ca9d"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Cost vs. Consumption</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
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
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <ComposedChart data={yearlyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="consumption" fill="var(--color-consumption)" />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="var(--color-cost)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Energy Efficiency Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Energy Efficiency Score</p>
                  <p className="text-xs text-muted-foreground">Based on your consumption patterns</p>
                </div>
                <div className="text-2xl font-bold">78/100</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>HVAC Efficiency</div>
                  <div className="font-medium">Good</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Lighting Efficiency</div>
                  <div className="font-medium">Excellent</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Equipment Usage</div>
                  <div className="font-medium">Needs Improvement</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Peak Demand Management</div>
                  <div className="font-medium">Poor</div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">Shift Non-Critical Operations</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Shifting non-critical operations to off-peak hours (10 PM - 6 AM) could reduce your energy costs by
                  approximately 15%.
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1.5 text-green-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">HVAC Scheduling Optimization</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Optimizing your HVAC schedule based on occupancy patterns could save up to 12% on HVAC-related energy
                  consumption.
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 p-1.5 text-amber-600">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">Peak Demand Management</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Implementing load shedding during peak demand periods (12 PM - 4 PM) could reduce your demand charges
                  by up to 20%.
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-1.5 text-purple-600">
                    <PieChart className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">Equipment Efficiency Audit</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Conducting an equipment efficiency audit could identify outdated equipment that's consuming 25-40%
                  more energy than modern alternatives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

