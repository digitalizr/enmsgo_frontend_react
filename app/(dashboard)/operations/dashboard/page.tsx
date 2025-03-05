"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, CircuitBoard, Building2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function OperationsDashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="smart-meters">Smart Meters</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Smart Meters</CardTitle>
                <CircuitBoard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Meters</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">218</div>
                <p className="text-xs text-muted-foreground">89% of total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offline Meters</CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27</div>
                <p className="text-xs text-muted-foreground">11% of total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest operations activities across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                      <Activity className="h-5 w-5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {i % 3 === 0
                            ? "New smart meter registered"
                            : i % 2 === 0
                              ? "New company onboarded"
                              : "Smart meter assigned to client"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i % 3 === 0
                            ? "Elmeasure EM6400NG"
                            : i % 2 === 0
                              ? "Acme Corporation"
                              : "Huawei DTSU666-H assigned to TechCorp"}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {i} hour{i !== 1 ? "s" : ""} ago
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>System alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                      <AlertCircle className={`h-5 w-5 ${i === 1 ? "text-destructive" : "text-amber-500"}`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {i === 1
                            ? "Critical: 5 meters offline for 24+ hours"
                            : i === 2
                              ? "Warning: Data inconsistency detected"
                              : "Notice: Firmware updates available"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i === 1
                            ? "Client: GlobalTech Industries"
                            : i === 2
                              ? "Affected meters: 3"
                              : "15 meters eligible for update"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="smart-meters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Meters Overview</CardTitle>
              <CardDescription>Distribution by manufacturer and status</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Smart Meters chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Companies Overview</CardTitle>
              <CardDescription>Client distribution and meter assignments</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Companies chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

