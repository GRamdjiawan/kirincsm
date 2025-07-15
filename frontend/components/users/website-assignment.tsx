"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock websites data
import { websites } from "./mock-data"

interface WebsiteAssignmentProps {
  selectedWebsites: string[]
  onChange: (websites: string[]) => void
}

export function WebsiteAssignment({ selectedWebsites, onChange }: WebsiteAssignmentProps) {
  const [open, setOpen] = useState(false)

  const toggleWebsite = (websiteName: string) => {
    if (selectedWebsites.includes(websiteName)) {
      onChange(selectedWebsites.filter((site) => site !== websiteName))
    } else {
      onChange([...selectedWebsites, websiteName])
    }
  }

  const removeWebsite = (websiteName: string) => {
    onChange(selectedWebsites.filter((site) => site !== websiteName))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedWebsites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No websites assigned. Assign websites below.</p>
        ) : (
          selectedWebsites.map((website) => (
            <Badge
              key={website}
              variant="outline"
              className="bg-white/5 border-white/10 pl-2 pr-1 py-1 flex items-center gap-1"
            >
              {website}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full hover:bg-white/10"
                onClick={() => removeWebsite(website)}
              >
                <span className="sr-only">Remove</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </Badge>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5 rounded-xl flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Assign Website
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 backdrop-blur-md bg-black/80 border-white/10 w-[200px]">
            <Command>
              <CommandInput placeholder="Search websites..." />
              <CommandList>
                <CommandEmpty>No websites found.</CommandEmpty>
                <CommandGroup>
                  {websites.map((website) => {
                    const isSelected = selectedWebsites.includes(website.name)
                    return (
                      <CommandItem
                        key={website.id}
                        onSelect={() => toggleWebsite(website.name)}
                        className={cn("flex items-center gap-2 cursor-pointer", isSelected ? "bg-white/10" : "")}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-white/20",
                            isSelected ? "bg-neon-blue border-neon-blue" : "opacity-50",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{website.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="bg-white/5 border-white/10 p-4 rounded-xl">
        <h4 className="text-sm font-medium mb-2">Website Access Permissions</h4>
        <p className="text-xs text-muted-foreground">
          Users can only access and manage content for their assigned websites. Administrators have access to all
          websites by default.
        </p>
      </Card>
    </div>
  )
}
