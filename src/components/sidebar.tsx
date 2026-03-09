import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-64 bg-muted h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-4">RDW Dashboard</h2>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/sales-funnel">Sales Funnel</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/staff-performance">Staff Performance</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/call-tracking">Call Tracking</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/jobs">Jobs</Link>
        </Button>
      </nav>
    </div>
  )
}