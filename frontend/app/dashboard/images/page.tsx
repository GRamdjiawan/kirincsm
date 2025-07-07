"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/media/image-upload"
import { Upload, Search, Grid3X3, List, Trash2, Eye, Plus, FileImage, FileVideo, Save, CheckCircle } from "lucide-react"

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

export default function ImagesPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch media from API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/media/domain`, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch media")
        }
        const data = await response.json()
        setMediaItems(data.filter((item: MediaItem) => item.type !== "text"))
      } catch (error) {
        console.error(error)
      }
    }
    fetchMedia()
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = mediaItems
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.file_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    setFilteredItems(filtered)
  }, [mediaItems, filterType, searchQuery])

  const handleUploadComplete = (newFiles: MediaItem[]) => {
    setMediaItems((prev) => [...newFiles, ...prev])
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/media/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to delete media")
      }
      setMediaItems((prev) => prev.filter((item) => item.id !== Number(id)))
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting media:", error)
    }
  }

  const handleUpdate = async (id: number, updatedData: { title: string; text: string }) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`http://localhost:8000/api/media/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Backend error:", errorData)
        throw new Error("Failed to update media")
      }
      const updatedMedia = await response.json()
      setMediaItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedMedia } : item)))
      setSelectedItem(null)
      setShowSuccessPopup(true)
      setTimeout(() => setShowSuccessPopup(false), 3000)
    } catch (error) {
      console.error("Error updating media:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <span>Media updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-gray-400">Manage your images and videos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <ImageUpload
          onUploadComplete={handleUploadComplete}
          maxFiles={10}
          maxFileSize={10 * 1024 * 1024} // 10MB
        />
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="rounded-xl"
          >
            All ({mediaItems.length})
          </Button>
          <Button
            variant={filterType === "image" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("image")}
            className="rounded-xl"
          >
            <FileImage className="h-4 w-4 mr-1" />
            Images ({mediaItems.filter((item) => item.type === "image").length})
          </Button>
          <Button
            variant={filterType === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("video")}
            className="rounded-xl"
          >
            <FileVideo className="h-4 w-4 mr-1" />
            Videos ({mediaItems.filter((item) => item.type === "video").length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-xl"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-xl"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Gallery */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer transition-all duration-200 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  {item.type === "image" ? (
                    <img
                      src={`http://localhost:8000${item.file_url}`}
                      alt={item.text || item.file_url}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-t-xl flex items-center justify-center">
                      <FileVideo className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-xl flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{item.title || item.file_url}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {item.type === "image" ? (
                      <img
                        src={`http://localhost:8000${item.file_url}`}
                        alt={item.text || item.file_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileVideo className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{item.title || item.file_url}</p>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="rounded-lg">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-lg text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id.toString())
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="bg-white/5 border-white/10 border-dashed">
          <CardContent className="p-12 text-center">
            <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No media files found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Upload your first image or video to get started"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Media Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl h-[80vh] backdrop-blur-md bg-black/80 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Media</DialogTitle>
            </DialogHeader>

            <div className="flex-1 flex gap-6 h-full">
              <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-xl overflow-hidden">
                {selectedItem.type === "image" ? (
                <div className="relative aspect-square w-full h-full">
                        <img
                            src={`http://localhost:8000${selectedItem.file_url}`}
                            alt={selectedItem.text || selectedItem.file_url}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FileVideo className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="w-70 space-y-4 flex flex-col">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Title</h4>
                  <Input
                    value={selectedItem.title || ""}
                    onChange={(e) => setSelectedItem((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    placeholder="Enter a title"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Alt Text</h4>
                  <Input
                    value={selectedItem.text || ""}
                    onChange={(e) => setSelectedItem((prev) => (prev ? { ...prev, text: e.target.value } : null))}
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    placeholder="Enter alt text for accessibility"
                  />
                </div>


                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl"
                    onClick={() =>
                      handleUpdate(selectedItem.id, {
                        title: selectedItem.title || "",
                        text: selectedItem.text || "",
                      })
                    }
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() => handleDelete(selectedItem.id.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
