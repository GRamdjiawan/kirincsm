export interface MediaItem {
  id: string
  name: string
  url: string
  type: "image" | "video"
  size: number
  dimensions?: {
    width: number
    height: number
  }
  uploadedAt: Date
  uploadedBy: string
  tags?: string[]
}

export interface MediaFilter {
  type?: "all" | "image" | "video"
  search?: string
  tags?: string[]
}
