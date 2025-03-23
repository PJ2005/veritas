import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Database, HardDrive } from "lucide-react"

interface SystemMetricsProps {
  system: {
    cpu_percent: number
    memory_percent: number
    disk_percent: number
    platform: string
    python_version: string
  }
  className?: string
}

export function SystemMetrics({ system, className = "" }: SystemMetricsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Hardware and software information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Server className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Platform</span>
              </div>
              <p className="text-sm">{system.platform}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Python Version</span>
              </div>
              <p className="text-sm">{system.python_version}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Resource Usage</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">CPU</p>
                  <p
                    className={`font-medium ${
                      system.cpu_percent > 80
                        ? "text-red-500"
                        : system.cpu_percent > 60
                          ? "text-amber-500"
                          : "text-green-500"
                    }`}
                  >
                    {system.cpu_percent.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p
                    className={`font-medium ${
                      system.memory_percent > 80
                        ? "text-red-500"
                        : system.memory_percent > 60
                          ? "text-amber-500"
                          : "text-green-500"
                    }`}
                  >
                    {system.memory_percent.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Disk</p>
                  <p
                    className={`font-medium ${
                      system.disk_percent > 80
                        ? "text-red-500"
                        : system.disk_percent > 60
                          ? "text-amber-500"
                          : "text-green-500"
                    }`}
                  >
                    {system.disk_percent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

