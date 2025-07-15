"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSectionContext } from "../section-context"
import type { CardSectionContent } from "../section-types"

export function CardPreview() {
  const { selectedSection } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "CARD") return null

  const content = selectedSection.content as CardSectionContent

  return (
    <Card className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
      {content.imageUrl && (
        <div className="aspect-video bg-white/10 overflow-hidden">
          <img
            src={content.imageUrl || "/placeholder.svg"}
            alt={content.heading}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg font-medium">{content.heading}</h3>
        <p className="text-sm text-gray-300">{content.text}</p>
        <Button variant="secondary" asChild>
          <a href={content.buttonUrl}>{content.buttonText}</a>
        </Button>
      </CardContent>
    </Card>
  )
}
