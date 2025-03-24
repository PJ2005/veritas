import Link from "next/link"
import { Shield } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex px-5 h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="text-xl font-bold">Veritas</span>
        </Link>
        <nav className="hidden md:flex gap-20">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
          <Link href="/verify" className="text-sm font-medium hover:underline underline-offset-4">
            Verify
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/api-docs" className="text-sm font-medium hover:underline underline-offset-4">
            API Docs
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {/* <Button variant="outline" size="sm" className="hidden md:flex">
            Sign In
          </Button> */}
        </div>
      </div>
    </header>
  )
}

