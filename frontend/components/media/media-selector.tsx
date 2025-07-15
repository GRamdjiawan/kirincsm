"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Images, Upload, Search, Check, FileImage, FileVideo, Plus } from "lucide-react"
import { MediaProvider, useMediaContext } from "./media-context"
import type { MediaItem } from "./media-types"

interface MediaSelectorProps {
  onSelect: (items: MediaItem[]) => void
  selectedItems?: MediaItem[]
  selectedSection?: number
  multiple?: boolean
  type?: "all" | "image" | "video"
  trigger?: React.ReactNode
  className?: string
}

export function MediaSelector({
  onSelect,
  selectedItems = [],
  selectedSection = 0,
  multiple = false,
  type = "all",
  trigger,
  className = "",
}: MediaSelectorProps) {
  const {
    filteredItems,
    selectedItems: contextSelectedItems,
    searchQuery,
    filterType,
    isUploading,
    selectMediaItem,
    deselectMediaItem,
    clearSelection,
    setSearchQuery,
    setFilterType,
    addMediaItem,
  } = useMediaContext()


  console.log("Selected Section in filtering logic:", selectedSection);
  console.log("Filtered Items:", filteredItems);
  const refilteredItems = filteredItems.filter((item) => {
    
    return item.section_id !== selectedSection;
  })

  const [isOpen, setIsOpen] = useState(false)
  const [localSelectedItems, setLocalSelectedItems] = useState<MediaItem[]>(selectedItems)

  const handleItemClick = (item: MediaItem) => {
    if (multiple) {
      const isSelected = localSelectedItems.find((selected) => selected.id === item.id)
      if (isSelected) {
        setLocalSelectedItems((prev) => prev.filter((selected) => selected.id !== item.id))
      } else {
        setLocalSelectedItems((prev) => [...prev, item])
      }
    } else {
      setLocalSelectedItems([item])
    }
  }

  
  const handleConfirm = async () => {
    try {
      // Update section_id for each selected item
      const updatedItems = await Promise.all(
        localSelectedItems.map(async (item) => {
          console.log(item);
          
          const updatedItem = { ...item, section_id: selectedSection } // Update section_id
          const response = await fetch(`https://api.nebula-cms.nl/api/media/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedItem),
          })

          if (!response.ok) {
            throw new Error(`Failed to update media item with ID ${item.id}`)
          }
          
          return updatedItem
        })
      )



      // Call the onSelect callback with the updated items
      onSelect(updatedItems)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to update media items:", error)
    }
  }

  const handleCancel = () => {
    setLocalSelectedItems(selectedItems)
    setIsOpen(false)
  }

  const handleUpload = () => {
    // Simulate file upload
    const newItem: Omit<MediaItem, "id" | "uploaded_at"> = {
      file_url: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent("New uploaded image")}`,
      filename: `uploaded-image-${Date.now()}.jpg`,
      type: "image",
      uploaded_by: "Current User",
      alt_text: "Newly uploaded image",
      caption: "User uploaded content",
      file_size: 256000,
      dimensions: { width: 800, height: 600 },
    }
    addMediaItem(newItem)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={`border-white/10 hover:bg-white/5 rounded-xl ${className}`}>
            <Images className="h-4 w-4 mr-2" />
            Select Media
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] backdrop-blur-md bg-black/80 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Media Library</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="h-full flex flex-col">
          <TabsContent value="library" className="flex-1 flex flex-col space-y-4">
            {/* Search and Filter */}
            {/* <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className="rounded-xl"
                >
                  All
                </Button>
                <Button
                  variant={filterType === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("image")}
                  className="rounded-xl"
                >
                  <FileImage className="h-4 w-4 mr-1" />
                  Images
                </Button>
                <Button
                  variant={filterType === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("video")}
                  className="rounded-xl"
                >
                  <FileVideo className="h-4 w-4 mr-1" />
                  Videos
                </Button>
              </div>
            </div> */}

            {/* Media Grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                {refilteredItems.map((item) => {
                  const isSelected = localSelectedItems.find((selected) => selected.id === item.id)
                  console.log("Rendering item:", item)
                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-neon-blue bg-neon-blue/10 border-neon-blue/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <img
                            src={`https://api.nebula-cms.nl${item.file_url}`}
                            alt={item.text || item.title}
                            className="w-full h-full object-cover rounded-t-xl"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-neon-blue text-white rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Selection Summary */}
            {localSelectedItems.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">
                    {localSelectedItems.length} item{localSelectedItems.length !== 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalSelectedItems([])}
                    className="text-gray-400 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-md bg-white/5 border-white/10 border-dashed">
                <CardContent className="p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Upload Media</h3>
                  <p className="text-gray-400 mb-4">Drag and drop files here, or click to browse</p>
                  <Button onClick={handleUpload} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={handleCancel} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={localSelectedItems.length === 0}
            className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple"
          >
            Select {localSelectedItems.length > 0 && `(${localSelectedItems.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const App = () => {
  return (
    <MediaProvider>
      <MediaSelector onSelect={(items) => console.log(items)} />
    </MediaProvider>
  )
}

export default App
