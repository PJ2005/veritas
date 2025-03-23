import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface ServiceStatusProps {
  services: {
    redis: string
    hedera: string
    [key: string]: string
  }
  className?: string
}

export function ServiceStatus({ services, className = "" }: ServiceStatusProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Service Status</CardTitle>
        <CardDescription>Current status of connected services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(services).map(([service, status]) => (
            <div key={service} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {status === "ok" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium capitalize">{service}</p>
                  <p className="text-xs text-muted-foreground">
                    {status === "ok" ? "Operational" : "Service Disruption"}
                  </p>
                </div>
              </div>
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  status === "ok"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {status === "ok" ? "Online" : "Offline"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

