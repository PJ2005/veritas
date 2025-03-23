"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface VerificationMatch {
  content_id: string
  similarity_score: number
  timestamp: string
  title?: string
  author?: string
}

interface MatchesListProps {
  matches: VerificationMatch[]
}

export function MatchesList({ matches }: MatchesListProps) {
  // Sort matches by similarity score (highest first)
  const sortedMatches = [...matches].sort((a, b) => b.similarity_score - a.similarity_score)

  return (
    <div className="space-y-3">
      {sortedMatches.map((match, index) => (
        <Card key={match.content_id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-medium truncate">{match.title || `Untitled Content ${index + 1}`}</h4>
                    {match.author && <p className="text-sm text-muted-foreground">By {match.author}</p>}
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        match.similarity_score > 0.9
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : match.similarity_score > 0.8
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }
                    `}
                    >
                      {(match.similarity_score * 100).toFixed(1)}% match
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                  <span>ID: {match.content_id.substring(0, 8)}...</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Registered: {new Date(match.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

