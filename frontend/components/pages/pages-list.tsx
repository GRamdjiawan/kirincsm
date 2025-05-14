import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

const pages = [
  {
    id: "1",
    title: "Homepage",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "2",
    title: "About Us",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
  },
  {
    id: "3",
    title: "Services",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
  },
  {
    id: "4",
    title: "Contact",
    status: "published",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
  },
  {
    id: "5",
    title: "Blog",
    status: "draft",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
]

export function PagesList() {
  return (
    <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5">
                <TableHead>Page Name</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Edited</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id} className="hover:bg-white/5 border-white/5">
                  <TableCell className="font-medium">
                    <div>
                      {page.title}
                      <div className="md:hidden mt-1">
                        <Badge
                          variant="outline"
                          className={
                            page.status === "published"
                              ? "border-green-500/50 text-green-400 bg-green-500/10"
                              : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                          }
                        >
                          {page.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="md:hidden mt-1 text-xs text-muted-foreground">
                        {formatDistanceToNow(page.updatedAt, { addSuffix: true })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        page.status === "published"
                          ? "border-green-500/50 text-green-400 bg-green-500/10"
                          : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                      }
                    >
                      {page.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(page.updatedAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white">
                        <Link href={`/dashboard/pages/${page.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
                          <DropdownMenuItem>Make a copy</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
