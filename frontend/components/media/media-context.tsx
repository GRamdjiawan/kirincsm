"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"

interface MediaItem {
  id: number
  title: string
  file_url: string
  type: "image" | "video" | "text"
  domain_id: number
  uploaded_by: number
  section_id?: number | null
  text?: string | null
}

interface MediaFilter {
  type?: "all" | "image" | "video"
  search?: string
  tags?: string[] // Optional: remove if you don't use tags
}

interface MediaContextType {
  mediaItems: MediaItem[]
  filteredItems: MediaItem[]
  filter: MediaFilter
  setFilter: (filter: MediaFilter) => void
  uploadMedia: (file: File) => Promise<MediaItem>
  deleteMedia: (id: number) => Promise<void>
  getMediaById: (id: number) => MediaItem | undefined
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filter, setFilter] = useState<MediaFilter>({ type: "all" })

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`https://api.kirin-cms.nl/api/media/domain`, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch media")
        }
        const data = await response.json()
        const filtered = data.filter((item: MediaItem) => item.type !== "text")
        setMediaItems(filtered)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMedia()
  }, [])

  const filteredItems = mediaItems.filter((item) => {
    if (filter.type && filter.type !== "all" && item.type !== filter.type) {
      return false
    }
    if (filter.search && !item.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    // Remove tag filtering unless you reintroduce tags
    return true
  })

  const uploadMedia = useCallback(async (file: File): Promise<MediaItem> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`https://api.kirin-cms.nl/media/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to upload media")
    }

    const newItem: MediaItem = await response.json()
    setMediaItems((prev) => [newItem, ...prev])
    return newItem
  }, [])

  const deleteMedia = useCallback(async (id: number) => {
    // const response = await fetch(`http://localhost:8000/api/media/${id}`, {
    //   method: "DELETE",
    //   credentials: "include",
    // })

    // if (!response.ok) {
    //   throw new Error("Failed to delete media")
    // }

    setMediaItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const getMediaById = useCallback(
    (id: number) => {
      return mediaItems.find((item) => item.id === id)
    },
    [mediaItems],
  )

  return (
    <MediaContext.Provider
      value={{
        mediaItems,
        filteredItems,
        filter,
        setFilter,
        uploadMedia,
        deleteMedia,
        getMediaById,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider")
  }
  return context
}

export { useMedia as useMediaContext }
