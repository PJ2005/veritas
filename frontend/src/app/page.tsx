import Link from "next/link"
import { ArrowRight, FileCheck, FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Veritas Content Verification System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Secure and verify your digital content using blockchain technology and AI-based similarity detection.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90">
                    Register Content
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline">
                    Verify Content
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Register Content</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Securely register your original content on the blockchain for future verification.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileCheck className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Verify Content</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Check if content has been previously registered or if similar content exists.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Visualize Results</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    See detailed similarity analysis and blockchain verification results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

