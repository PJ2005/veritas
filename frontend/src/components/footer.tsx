import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 px-5 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span className="text-lg font-bold">Veritas</span>
        </div>
        <div className="flex flex-col md:flex-row items-center pl-32 gap-20 ">
          <Link href="/about" className="text-sm hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/contact" className="text-sm hover:underline underline-offset-4">
            Contact
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Veritas. All rights reserved.</p>
      </div>
    </footer>
  )
}

