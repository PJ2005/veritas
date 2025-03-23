import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ApiEndpointProps {
  title: string
  endpoint: string
  description: string
  requestBody: Record<string, string> | null
  responseBody: Record<string, string>
  sampleRequest: Record<string, any> | null
  sampleResponse: Record<string, any>
}

export function ApiEndpoint({
  title,
  endpoint,
  description,
  requestBody,
  responseBody,
  sampleRequest,
  sampleResponse,
}: ApiEndpointProps) {
  const [method, path] = endpoint.split(" ")

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {path}
            </Badge>
            <Badge
              className={`
              ${
                method === "GET"
                  ? "bg-green-500 hover:bg-green-600"
                  : method === "POST"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : method === "PUT"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : method === "DELETE"
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
              }
            `}
            >
              {method}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="example">Example</TabsTrigger>
          </TabsList>
          <TabsContent value="schema" className="space-y-4 mt-4">
            {requestBody && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Request Body</h4>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-xs overflow-auto">
                    {`{\n${Object.entries(requestBody)
                      .map(([key, type]) => `  "${key}": ${type}`)
                      .join(",\n")}\n}`}
                  </pre>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Response Body</h4>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {`{\n${Object.entries(responseBody)
                    .map(([key, type]) => `  "${key}": ${type}`)
                    .join(",\n")}\n}`}
                </pre>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="example" className="space-y-4 mt-4">
            {sampleRequest && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sample Request</h4>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-xs overflow-auto">{JSON.stringify(sampleRequest, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sample Response</h4>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-xs overflow-auto">{JSON.stringify(sampleResponse, null, 2)}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

