"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSectionContext } from "./section-context"
import { availablePages } from "./section-types"

export function SectionList() {
  const {
    selectedPageId,
    setSelectedPageId,
    selectedSectionId,
    setSelectedSectionId,
    draggedSectionId,
    dragOverSectionId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    addNewSection,
    deleteSection,
    isMobileView,
    setShowSectionList,
  } = useSectionContext()

  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pages, setPages] = useState<any[]>([])

  useEffect(() => { 
    availablePages()
      .then((data) =>
       setPages(data))
      .catch(() => setPages([]))


    if (!selectedPageId) {
      setSections([])
      return
    }
    setLoading(true)
    fetch(`http://localhost:8000/api/sections/${selectedPageId}`,{credentials: "include"})
      .then((res) => res.json())
      .then((data) => {
        setSections(Array.isArray(data) ? data : [])})
      .catch(() => setSections([]))
      .finally(() => setLoading(false))
    
      
      
  }, [selectedPageId])

    return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Label htmlFor="page-select" className="text-sm">
          Select Page
        </Label>
        <Select value={selectedPageId} onValueChange={setSelectedPageId}>
          <SelectTrigger
            id="page-select"
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          >
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
            {pages.map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Sections</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={addNewSection}
            className="h-8 px-2 text-xs rounded-lg border-white/10 hover:bg-white/5"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Section
          </Button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-xs text-gray-400">Loading...</div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={(e) => handleDragOver(e, section.id)}
                onDrop={(e) => handleDrop(e, section.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "bg-white/5 border border-white/10 rounded-xl p-3 text-sm cursor-move hover:bg-white/10 transition-colors flex items-center justify-between",
                  selectedSectionId === section.id ? "ring-2 ring-neon-blue" : "",
                  dragOverSectionId === section.id ? "bg-neon-blue/10" : "",
                )}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span>{section.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSection(section.id)
                  }}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-transparent"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {isMobileView && (
        <div className="p-4 mt-auto">
          <Button onClick={() => setShowSectionList(false)} className="w-full">
            Show Editor
          </Button>
        </div>
      )}
    </div>
  )
}