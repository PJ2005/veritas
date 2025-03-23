"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SystemMetrics } from "@/components/system-metrics"
import { ServiceStatus } from "@/components/service-status"
import { Loader2 } from "lucide-react"

interface HealthResponse {
  status: string
  timestamp: string
  version: string
  services: {
    redis: string
    hedera: string
  }
  system: {
    cpu_percent: number
    memory_percent: number
    disk_percent: number
    platform: string
    python_version: string
  }
}

export default function DashboardPage() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('http://localhost:8000/api/health')
        // const data = await response.json()

        // Simulate API response
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockData: HealthResponse = {
          status: "ok",
          timestamp: new Date().toISOString(),
          version: "0.1.0",
          services: {
            redis: "ok",
            hedera: "ok",
          },
          system: {
            cpu_percent: 23.5,
            memory_percent: 48.2,
            disk_percent: 65.7,
            platform: "Linux-5.15.0-x86_64-with-glibc2.31",
            python_version: "3.9.21",
          },
        }

        setHealthData(mockData)
      } catch (err) {
        setError("Failed to fetch health data. Please try again later.")
        console.error("Health check error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthData()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchHealthData, 30000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading system status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300">System Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!healthData) return null

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
            <p className="text-muted-foreground">Monitor system health and performance metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">System Status:</p>
            <Badge variant={healthData.status === "ok" ? "success" : "destructive"} className="px-3 py-1">
              {healthData.status === "ok" ? "Operational" : "Degraded"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.version}</div>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(healthData.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.cpu_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        healthData.system.cpu_percent > 80
                          ? "bg-red-500"
                          : healthData.system.cpu_percent > 60
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${healthData.system.cpu_percent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.memory_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        healthData.system.memory_percent > 80
                          ? "bg-red-500"
                          : healthData.system.memory_percent > 60
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${healthData.system.memory_percent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.disk_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        healthData.system.disk_percent > 80
                          ? "bg-red-500"
                          : healthData.system.disk_percent > 60
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${healthData.system.disk_percent}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ServiceStatus services={healthData.services} />
              <SystemMetrics system={healthData.system} />
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServiceStatus services={healthData.services} className="w-full" />
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <SystemMetrics system={healthData.system} className="w-full" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

