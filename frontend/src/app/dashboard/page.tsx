"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SystemMetrics } from "@/components/system-metrics"
import { ServiceStatus } from "@/components/service-status"
import { Loader2, RefreshCw } from "lucide-react"

// API base URL from environment variable or default to localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// You might need to adjust this path based on your actual API structure
const API_HEALTH_ENDPOINT = '/api/health';

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
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dataStale, setDataStale] = useState(false)

  const fetchHealthData = useCallback(async () => {
    try {
      if (!loading) setRefreshing(true);

      const apiUrl = `${API_BASE_URL}${API_HEALTH_ENDPOINT}`;
      console.log('Fetching health data from:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json()
      console.log('Received health data:', data);

      // Verify we're getting fresh data by comparing timestamps
      if (healthData && healthData.timestamp === data.timestamp) {
        setDataStale(true);
      } else {
        setDataStale(false);
      }

      setHealthData(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch health data: ${errorMessage}`);
      console.error("Health check error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [loading, healthData])

  useEffect(() => {
    fetchHealthData()

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchHealthData, 5000)

    return () => clearInterval(intervalId)
  }, [fetchHealthData])

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
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm">System Status:</p>
              <Badge variant={healthData.status === "ok" ? "default" : "destructive"} className="px-3 py-1">
                {healthData.status === "ok" ? "Operational" : "Degraded"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {refreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : null}
              <span>
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                {dataStale && <span className="text-amber-500 ml-2">(Warning: Data may be stale)</span>}
              </span>
            </div>
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
                    API time: {new Date(healthData.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.cpu_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${healthData.system.cpu_percent > 80
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
                  {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.memory_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${healthData.system.memory_percent > 80
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
                  {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthData.system.disk_percent.toFixed(1)}%</div>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${healthData.system.disk_percent > 80
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

