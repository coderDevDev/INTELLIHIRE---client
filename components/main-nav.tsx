import Link from "next/link"
import { Briefcase } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Briefcase className="h-6 w-6" />
        <span className="inline-block font-bold">InteliHire</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link
          href="/jobs"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Jobs
        </Link>
        <Link
          href="/employers"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Employers
        </Link>
        <Link
          href="/about"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          About
        </Link>
      </nav>
    </div>
  )
}
