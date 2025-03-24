"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { RegistrationSuccess } from "@/components/registration-success"
import { Loader2 } from "lucide-react"

// API base URL from environment variable or default to localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// You might need to adjust these paths based on your actual API structure
const API_CREATE_TOPIC_ENDPOINT = '/api/create-topic';
const API_REGISTER_ENDPOINT = '/api/register';

interface MetadataType {
  category: string;
  keywords: string[];
  [key: string]: string | string[];
}

interface RegistrationRequest {
  content: string
  content_type: "text" | "image" | "code" | "document"
  title?: string
  author?: string
  metadata?: MetadataType
  topic_id: string
}

interface RegistrationResponse {
  content_id: string
  timestamp: string
  transaction_id: string
  content_hash: string
}

export default function RegisterPage() {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [topicLoading, setTopicLoading] = useState(false)
  const [formData, setFormData] = useState<RegistrationRequest>({
    content: "",
    content_type: "text",
    title: "",
    author: "",
    metadata: { category: "", keywords: [] },
    topic_id: ""
  })
  const [response, setResponse] = useState<RegistrationResponse | null>(null)

  // Get a default topic ID when the component mounts
  useEffect(() => {
    const getTopicId = async () => {
      try {
        setTopicLoading(true)
        const apiUrl = `${API_BASE_URL}${API_CREATE_TOPIC_ENDPOINT}`;
        console.log('Creating topic at:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'POST'
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        // setTopicId function doesn't exist, replace with direct state update
        setFormData(prev => ({ ...prev, topic_id: data.topic_id }))
      } catch (err) {
        console.error("Failed to create topic:", err)
        toast.error("Failed to initialize topic", {
          description: "You'll need to provide your own topic ID."
        })
      } finally {
        setTopicLoading(false)
      }
    }

    getTopicId()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const apiUrl = `${API_BASE_URL}${API_REGISTER_ENDPOINT}`;
      console.log('Registering content at:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResponse(data)
      toast.success("Content Registered Successfully", {
        description: "Your content has been registered on the blockchain.",
      })
    } catch (error) {
      toast.error("Registration Failed", {
        description: "There was an error registering your content. Please try again.",
      })
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content_type: value as "text" | "image" | "code" | "document" }))
  }

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "keywords") {
      const keywords = value.split(",").map((k) => k.trim())
      setFormData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata!, keywords },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata!, [name]: value },
      }))
    }
  }

  if (response) {
    return <RegistrationSuccess response={response} onRegisterAnother={() => setResponse(null)} />
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Register Content</CardTitle>
            <CardDescription>Register your original content on the blockchain for future verification.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter content title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author (Optional)</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_type">Content Type</Label>
                <Select value={formData.content_type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic_id">Topic ID</Label>
                <Input
                  id="topic_id"
                  name="topic_id"
                  placeholder="Enter Hedera Topic ID"
                  value={formData.topic_id}
                  onChange={handleInputChange}
                  required
                  disabled={topicLoading}
                />
                {topicLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Creating default topic...
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter your content here"
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Metadata (Optional)</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category" className="text-xs">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="E.g., research, article"
                      value={formData.metadata?.category || ""}
                      onChange={handleMetadataChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords" className="text-xs">
                      Keywords (comma separated)
                    </Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      placeholder="E.g., blockchain, verification"
                      value={formData.metadata?.keywords?.join(", ") || ""}
                      onChange={handleMetadataChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className=" pt-5">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Content"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

