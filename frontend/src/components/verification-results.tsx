"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react"
import { SimilarityGauge } from "@/components/similarity-gauge"
import { MatchesList } from "@/components/matches-list"

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

interface VerificationResultsProps {
  results: VerificationResponse
  onVerifyAnother: () => void
}

export function VerificationResults({ results, onVerifyAnother }: VerificationResultsProps) {
  const highestMatch =
    results.matches.length > 0
      ? results.matches.reduce((prev, current) => (prev.similarity_score > current.similarity_score ? prev : current))
      : null

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader
            className={`${results.is_original ? "bg-green-50 dark:bg-green-900/20" : "bg-amber-50 dark:bg-amber-900/20"} border-b`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`${results.is_original ? "bg-green-100 dark:bg-green-800" : "bg-amber-100 dark:bg-amber-800"} rounded-full p-2`}
              >
                {results.is_original ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                )}
              </div>
              <div>
                <CardTitle>{results.is_original ? "Original Content" : "Similar Content Found"}</CardTitle>
                <CardDescription>
                  {results.is_original
                    ? "No similar content was found above the threshold."
                    : `Found ${results.matches.length} similar content matches.`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Content Hash</p>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm">{results.content_hash}</code>
              </div>
            </div>

            {highestMatch && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Similarity Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Highest match: {(highestMatch.similarity_score * 100).toFixed(1)}%
                  </p>
                </div>

                <SimilarityGauge score={highestMatch.similarity_score} threshold={results.similarity_threshold} />
              </div>
            )}

            {results.matches.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Similar Content Matches</h3>
                <MatchesList matches={results.matches} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={onVerifyAnother}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Verify Another
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

