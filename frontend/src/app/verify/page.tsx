"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { VerificationResults } from "@/components/verification-results"
import { Loader2 } from "lucide-react"

interface VerificationRequest {
  content: string
  content_type: "text" | "image" | "code" | "document"
  threshold: number
}

interface VerificationMatch {
  content_id: string
  similarity_score: number
  timestamp: string
  title?: string
  author?: string
}

interface VerificationResponse {
  content_hash: string
  is_original: boolean
  similarity_threshold: number
  matches: VerificationMatch[]
}

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<VerificationRequest>({
    content: "",
    content_type: "text",
    threshold: 0.85,
  })
  const [results, setResults] = useState<VerificationResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('http://localhost:8000/api/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response with some random data
      const mockResponse: VerificationResponse = {
        content_hash: "7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8",
        is_original: false,
        similarity_threshold: formData.threshold,
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
      }

        setResults(mockResponse)
        toast.success(
          mockResponse.is_original
            ? "No similar content was found."
            : `Found ${mockResponse.matches.length} similar content matches.`,
          {
            description: "Verification Complete",
          }
        )
      } catch (error) {
        toast.error("Verification Failed", {
          description: "There was an error verifying your content. Please try again."
        })
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content_type: value as any }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, threshold: value[0] }))
  }

  const resetForm = () => {
    setResults(null)
    setFormData({
      content: "",
      content_type: "text",
      threshold: 0.85,
    })
  }

  if (results) {
    return <VerificationResults results={results} onVerifyAnother={resetForm} />
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Verify Content</CardTitle>
            <CardDescription>
              Check if content has been previously registered or if similar content exists.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                <Label htmlFor="content">Content to Verify</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter content to verify"
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="threshold">Similarity Threshold: {formData.threshold.toFixed(2)}</Label>
                </div>
                <Slider
                  id="threshold"
                  min={0.7}
                  max={1.0}
                  step={0.01}
                  value={[formData.threshold]}
                  onValueChange={handleSliderChange}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values require closer matches. Lower values may find more potential matches.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Content"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

