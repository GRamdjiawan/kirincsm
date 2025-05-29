"use client"

import { useSectionContext } from "../section-context"
import type { TextContent } from "../section-types"

export function TextPreview() {
  const { selectedSection } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "TEXT") return null

  const content = selectedSection.content as TextContent

  return (
    <div className="p-3 sm:p-4 space-y-2">
      <h3 className="text-lg font-medium">{content.title}</h3>
      <div className="text-sm text-gray-300 whitespace-pre-line">{content.text || "No content yet"}</div>
    </div>
  )
}
