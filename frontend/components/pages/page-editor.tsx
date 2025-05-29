"use client"

import { SectionManager } from "./section-manager"

interface PageEditorProps {
  seo?: boolean
}

export function PageEditor({ seo = false }: PageEditorProps) {
  // We're no longer using the seo prop since we've removed that tab
  return <SectionManager />
}
