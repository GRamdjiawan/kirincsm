import { PagesList } from "@/components/pages/pages-list"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function PagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Pages</h1>
          <p className="text-muted-foreground">Create and manage your website content</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl"
        >
          <Link href="/dashboard/pages/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Page
          </Link>
        </Button>
      </div>

      <PagesList />
    </div>
  )
}
