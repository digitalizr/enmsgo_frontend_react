"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, ArrowRight, Download, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

// Sample data for predictive trends
const predictiveTrendData = [
  { month: "Jun", actual: 18900, predicted: null },
  { month: "Jul", actual: 19800, predicted: null },
  { month: "Aug", actual: 19500, predicted: null },
  { month: "Sep", actual: null, predicted: 18200 },
  { month: "Oct", actual: null, predicted: 17100 },
  { month: "Nov", actual: null, predicted: 16300 },
  { month: "Dec", actual: null, predicted: 16800 },
]

// Sample data for energy breakdown
const energyBreakdownData = [
  { name: "HVAC", value: 45, color: "#0088FE" },
  { name: "Lighting", value: 20, color: "#00C49F" },
  { name: "Equipment", value: 15, color: "#FFBB28" },
  { name: "IT Infrastructure", value: 12, color: "#FF8042" },
  { name: "Other", value: 8, color: "#8884D8" },
]

// Sample data for optimization potential
const optimizationPotentialData = [
  { category: "HVAC", current: 45, optimized: 38 },
  { category: "Lighting", current: 20, optimized: 12 },
  { category: "Equipment", current: 15, optimized: 13 },
  { category: "IT", current: 12, optimized: 10 },
  { category: "Other", current: 8, optimized: 7 },
]

// Sample recommendations
const recommendations = [
  {
    id: 1,
    title: "Optimize HVAC Schedule",
    description:
      "Your HVAC system is running at full capacity during non-business hours. Adjusting the schedule to reduce operation during these times could save up to 15% on HVAC-related energy costs.",
    impact: "high",
    savingsPercentage: 15,
    savingsAmount: "$262.50",
    implementationCost: "Low",
    paybackPeriod: "2 months",
    steps: [
      "Program HVAC to reduce output by 30% between 7PM and 6AM",
      "Implement weekend schedule with 50% reduced capacity",
      "Install smart thermostats in zones for better control",
    ],
  },
  {
    id: 2,
    title: "Lighting Efficiency Upgrade",
    description:
      "Replacing current fluorescent lighting with LED alternatives would significantly reduce lighting-related energy consumption while providing the same or better illumination.",
    impact: "medium",
    savingsPercentage: 8,
    savingsAmount: "$140.00",
    implementationCost: "Medium",
    paybackPeriod: "8 months",
    steps: [
      "Replace all fluorescent tubes with LED equivalents",
      "Install motion sensors in low-traffic areas",
      "Implement daylight harvesting in areas with natural light",
    ],
  },
  {
    id: 3,
    title: "Peak Demand Management",
    description:
      "Your facility regularly exceeds optimal peak demand levels during 2-4PM. Implementing load shifting strategies could reduce peak demand charges significantly.",
    impact: "high",
    savingsPercentage: 20,
    savingsAmount: "$350.00",
    implementationCost: "Low",
    paybackPeriod: "3 months",
    steps: [
      "Stagger operation of high-power equipment",
      "Pre-cool spaces before peak hours",
      "Implement automated load shedding during peak periods",
    ],
  },
  {
    id: 4,
    title: "Equipment Maintenance Schedule",
    description:
      "Regular maintenance of key equipment can improve efficiency and reduce energy consumption. Our analysis shows some equipment may be operating below optimal efficiency.",
    impact: "medium",
    savingsPercentage: 5,
    savingsAmount: "$87.50",
    implementationCost: "Low",
    paybackPeriod: "4 months",
    steps: [
      "Schedule quarterly maintenance for all HVAC equipment",
      "Clean or replace air filters monthly",
      "Check and optimize refrigeration systems",
    ],
  },
]

export default function AIInsightsPage() {
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [selectedRecommendation, setSelectedRecommendation] = useState(recommendations[0])

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">AI-powered analysis and recommendations for energy optimization</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Energy Predictions</TabsTrigger>
          <TabsTrigger value="breakdown">Energy Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Prediction</CardTitle>
              <CardDescription>
                Predicted energy usage for the next 4 months based on historical patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  actual: {
                    label: "Actual Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  predicted: {
                    label: "Predicted Consumption (kWh)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={predictiveTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--color-actual)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Actual Consumption"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="var(--color-predicted)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Consumption"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Prediction based on historical usage patterns, seasonal factors, and weather forecasts. The model has a
                92% accuracy rate based on previous predictions.
              </p>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Impact Analysis</CardTitle>
                <CardDescription>How seasonal changes affect your energy consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">Summer Peak</span>
                      </div>
                      <span>+15-20%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      HVAC cooling demands increase consumption significantly during summer months
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">Winter Impact</span>
                      </div>
                      <span>+10-15%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Heating and reduced daylight hours increase consumption in winter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">Spring/Fall</span>
                      </div>
                      <span>-5-10%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Moderate temperatures reduce HVAC demands during transitional seasons
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection</CardTitle>
                <CardDescription>AI-detected unusual patterns in your energy consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Unusual Weekend Usage</h3>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Energy consumption on weekends has been 40% higher than historical patterns for the past 3 weeks.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Overnight Baseline Increase</h3>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Baseline energy usage during 12AM-5AM has increased by 25% compared to previous months.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Energy Usage Breakdown</CardTitle>
                <CardDescription>How your energy is being consumed by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={energyBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {energyBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Consumption"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Potential</CardTitle>
                <CardDescription>Current vs. optimized energy usage by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer
                  config={{
                    current: {
                      label: "Current Usage (%)",
                      color: "hsl(var(--chart-1))",
                    },
                    optimized: {
                      label: "Optimized Usage (%)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={optimizationPotentialData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="current" fill="var(--color-current)" name="Current Usage (%)" />
                      <Bar dataKey="optimized" fill="var(--color-optimized)" name="Optimized Usage (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Implementing all recommended optimizations could reduce your total energy consumption by approximately
                  20%.
                </p>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time-of-Use Analysis</CardTitle>
              <CardDescription>Energy consumption patterns throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  consumption: {
                    label: "Energy Consumption (kWh)",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Energy Cost ($/kWh)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { time: "12 AM", consumption: 42, cost: 0.08 },
                      { time: "2 AM", consumption: 35, cost: 0.08 },
                      { time: "4 AM", consumption: 30, cost: 0.08 },
                      { time: "6 AM", consumption: 35, cost: 0.1 },
                      { time: "8 AM", consumption: 65, cost: 0.12 },
                      { time: "10 AM", consumption: 75, cost: 0.15 },
                      { time: "12 PM", consumption: 85, cost: 0.18 },
                      { time: "2 PM", consumption: 80, cost: 0.2 },
                      { time: "4 PM", consumption: 75, cost: 0.18 },
                      { time: "6 PM", consumption: 70, cost: 0.15 },
                      { time: "8 PM", consumption: 60, cost: 0.12 },
                      { time: "10 PM", consumption: 50, cost: 0.1 },
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-consumption)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-consumption)" stopOpacity={0.1} />
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
                    />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Shifting energy-intensive operations from peak cost periods (12PM-6PM) to off-peak hours could reduce
                costs by up to 25%.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                  <CardDescription>AI-generated recommendations to reduce energy consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedRecommendation.id === rec.id ? "bg-primary/10 border-primary/50" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{rec.title}</h3>
                          <Badge
                            variant={
                              rec.impact === "high" ? "default" : rec.impact === "medium" ? "secondary" : "outline"
                            }
                          >
                            {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{rec.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-green-500">Save {rec.savingsAmount}/mo</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedRecommendation.title}</CardTitle>
                    <CardDescription>Detailed analysis and implementation steps</CardDescription>
                  </div>
                  <Badge
                    variant={
                      selectedRecommendation.impact === "high"
                        ? "default"
                        : selectedRecommendation.impact === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedRecommendation.impact.charAt(0).toUpperCase() + selectedRecommendation.impact.slice(1)}{" "}
                    Impact
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedRecommendation.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Potential Savings</h3>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-bold text-green-500">
                        {selectedRecommendation.savingsPercentage}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Approximately {selectedRecommendation.savingsAmount} per month
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Implementation Cost</h3>
                    <div className="text-lg font-bold">{selectedRecommendation.implementationCost}</div>
                    <p className="text-xs text-muted-foreground">One-time investment</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Payback Period</h3>
                    <div className="text-lg font-bold">{selectedRecommendation.paybackPeriod}</div>
                    <p className="text-xs text-muted-foreground">Return on investment</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Implementation Steps</h3>
                  <div className="space-y-2">
                    {selectedRecommendation.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs">
                          {index + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Details
                </Button>
                <Button>Implement Recommendation</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

