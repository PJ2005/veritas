import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiEndpoint } from "@/components/api-endpoint"

export default function ApiDocsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">Reference documentation for the Veritas content verification API.</p>
        </div>

        <Tabs defaultValue="register" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4">
            <ApiEndpoint
              title="Content Registration"
              endpoint="POST /api/register"
              description="Register content on the blockchain for future verification."
              requestBody={{
                content: "string",
                content_type: "'text' | 'image' | 'code' | 'document'",
                title: "string (optional)",
                author: "string (optional)",
                metadata: "Record<string, any> (optional)",
              }}
              responseBody={{
                content_id: "string",
                timestamp: "string",
                transaction_id: "string",
                content_hash: "string",
              }}
              sampleRequest={{
                content: "This is original content that needs to be registered for verification.",
                content_type: "text",
                title: "Sample Research Paper",
                author: "John Doe",
                metadata: {
                  category: "research",
                  keywords: ["blockchain", "verification"],
                },
              }}
              sampleResponse={{
                content_id: "8a7b64c5f3e2d1a0b9c8d7e6f5a4b3c2d1e0f",
                timestamp: "2025-03-23T12:34:56",
                transaction_id: "0.0.5763624@1742732976.123456789",
                content_hash: "8a7b64c5f3e2d1a0b9c8d7e6f5a4b3c2d1e0f",
              }}
            />
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <ApiEndpoint
              title="Content Verification"
              endpoint="POST /api/verify"
              description="Verify content against previously registered content."
              requestBody={{
                content: "string",
                content_type: "'text' | 'image' | 'code' | 'document'",
                threshold: "number (0-1 similarity threshold)",
              }}
              responseBody={{
                content_hash: "string",
                is_original: "boolean",
                similarity_threshold: "number",
                matches:
                  "Array<{ content_id: string, similarity_score: number, timestamp: string, title?: string, author?: string }>",
              }}
              sampleRequest={{
                content: "This is similar content that needs to be verified against registered content.",
                content_type: "text",
                threshold: 0.85,
              }}
              sampleResponse={{
                content_hash: "7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8",
                is_original: false,
                similarity_threshold: 0.85,
                matches: [
                  {
                    content_id: "8a7b64c5f3e2d1a0b9c8d7e6f5a4b3c2d1e0f",
                    similarity_score: 0.92,
                    timestamp: "2025-03-23T12:34:56",
                    title: "Sample Research Paper",
                    author: "John Doe",
                  },
                  {
                    content_id: "5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7",
                    similarity_score: 0.87,
                    timestamp: "2025-03-22T10:20:30",
                    title: "Original Research",
                    author: "Jane Smith",
                  },
                ],
              }}
            />
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <ApiEndpoint
              title="Health Check"
              endpoint="GET /api/health"
              description="Get system health and status information."
              requestBody={null}
              responseBody={{
                status: "string",
                timestamp: "string",
                version: "string",
                services: "{ redis: string, hedera: string }",
                system:
                  "{ cpu_percent: number, memory_percent: number, disk_percent: number, platform: string, python_version: string }",
              }}
              sampleRequest={null}
              sampleResponse={{
                status: "ok",
                timestamp: "2025-03-23T18:30:45",
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
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

