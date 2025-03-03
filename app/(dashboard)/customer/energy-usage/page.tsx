"use client"

import { useState } from "react"
import { DateRange } from "@/components/date-range-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Zap, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

// Sample data for energy consumption
const hourlyConsumptionData = [
  { hour: "00:00", consumption: 42, demand: 35 },
  { hour: "01:00", consumption: 38, demand: 32 },
  { hour: "02:00", consumption: 35, demand: 30 },
  { hour: "03:00", consumption: 30, demand: 28 },
  { hour: "04:00", consumption: 32, demand: 29 },
  { hour: "05:00", consumption: 35, demand: 31 },
  { hour: "06:00", consumption: 45, demand: 38 },
  { hour: "07:00", consumption: 58, demand: 45 },
  { hour: "08:00", consumption: 65, demand: 52 },
  { hour: "09:00", consumption: 70, demand: 58 },
  { hour: "10:00", consumption: 75, demand: 62 },
  { hour: "11:00", consumption: 80, demand: 65 },
  { hour: "12:00", consumption: 85, demand: 68 },
  { hour: "13:00", consumption: 82, demand: 66 },
  { hour: "14:00", consumption: 80, demand: 64 },
  { hour: "15:00", consumption: 78, demand: 62 },
  { hour: "16:00", consumption: 75, demand: 60 },
  { hour: "17:00", consumption: 72, demand: 58 },
  { hour: "18:00", consumption: 70, demand: 56 },
  { hour: "19:00", consumption: 68, demand: 54 },
  { hour: "20:00", consumption: 65, demand: 52 },
  { hour: "21:00", consumption: 60, demand: 48 },
  { hour: "22:00", consumption: 55, demand: 45 },
  { hour: "23:00", consumption: 48, demand: 40 },
]

const usageByAreaData = [
  { name: "HVAC", value: 45 },
  { name: "Lighting", value: 20 },
  { name: "Equipment", value: 15 },
  { name: "IT Infrastructure", value: 12 },
  { name: "Other", value: 8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function EnergyUsagePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Usage</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your energy consumption
          </p>
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
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$257.20</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68 kW</div>
            <p className="text-xs text-muted-foreground">Occurred on May 15, 2:30 PM</p>
          </CardContent>
        </Card>
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
              <CardTitle>Hourly Energy Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your chart component here */}
              <div className="h-[300px]">
                {/* Placeholder for chart */}
                <p>Chart goes here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Add other TabsContent sections as needed */}
      </Tabs>
    </div>
  )
}

