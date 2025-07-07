"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SectionProvider, useSectionContext } from "./section-context"
import { SectionList } from "./section-list"
import { SectionEditor } from "./section-editor"

function SectionManagerContent() {
  const { isMobileView, showSectionList, setShowSectionList, selectedSection } = useSectionContext()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-screen">
      {/* Section List */}
      <aside
        className={cn(
          "bg-black/40 border-r border-white/5 overflow-y-auto h-full",
          isMobileView ? (showSectionList ? "block" : "hidden") : "block",
        )}
      >
        <SectionList />
      </aside>

      {/* Section Editor Only */}
      <main
        className={cn(
          "bg-black/80 h-full overflow-y-auto",
          isMobileView ? (showSectionList ? "hidden" : "block") : "block",
        )}
      >
        {selectedSection ? (
          <div className="h-full">
            <SectionEditor />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No section selected</div>
        )}
        {isMobileView && !showSectionList && (
          <div className="p-4">
            <Button onClick={() => setShowSectionList(true)} className="w-full">
              Show Sections
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export function SectionManager() {
  return (
      <SectionProvider>
        <SectionManagerContent />
      </SectionProvider>
  )
}
