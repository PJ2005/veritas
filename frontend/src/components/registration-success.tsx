import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface RegistrationResponse {
  content_id: string
  timestamp: string
  transaction_id: string
  content_hash: string
}

interface RegistrationSuccessProps {
  response: RegistrationResponse
  onRegisterAnother: () => void
}

export function RegistrationSuccess({ response, onRegisterAnother }: RegistrationSuccessProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    toast("Copied to clipboard", {
      description: `${field} has been copied to your clipboard.`,
    })

    setTimeout(() => {
      setCopied(null)
    }, 2000)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
                <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <CardTitle>Registration Successful</CardTitle>
                <CardDescription>Your content has been successfully registered on the blockchain.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Content ID</p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                <code className="text-sm">{response.content_id}</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(response.content_id, "Content ID")}>
                  {copied === "Content ID" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Transaction ID</p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                <code className="text-sm">{response.transaction_id}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(response.transaction_id, "Transaction ID")}
                >
                  {copied === "Transaction ID" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Content Hash</p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                <code className="text-sm">{response.content_hash}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(response.content_hash, "Content Hash")}
                >
                  {copied === "Content Hash" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Timestamp</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{new Date(response.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto" onClick={onRegisterAnother}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Register Another
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => window.print()}>
              Save Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

