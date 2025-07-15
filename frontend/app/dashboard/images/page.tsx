"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/media/image-upload"
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Eye,
  Plus,
  FileImage,
  FileVideo,
  Save,
  CheckCircle,
  Filter,
  X,
} from "lucide-react"
import { MediaProvider } from "@/components/media/media-context"
import Image from "next/image"

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
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch media from API
  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.nebula-cms.nl/api/media/domain`, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          setMediaItems([])
        } else {
          const data = await response.json()
          setMediaItems(data.filter((item: MediaItem) => item.type !== "text"))
        }
      } catch (error) {
        console.error(error)
        setMediaItems([])
      } finally {
        setIsLoading(false)
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
    setShowUpload(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://api.nebula-cms.nl/api/media/${id}`, {
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
      const response = await fetch(`https://api.nebula-cms.nl/api/media/${id}`, {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
          <CardContent className="p-0">
            <div className="aspect-square bg-gray-700 rounded-t-xl"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <MediaProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Media updated successfully!</span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Media Library</h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Manage your images and videos • {mediaItems.length} files
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl transition-all duration-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Upload Media</span>
                  <span className="xs:hidden">Upload</span>
                </Button>
              </div>
            </div>

            {/* Mobile Upload Section */}
            {showUpload && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <ImageUpload
                  onUploadComplete={handleUploadComplete}
                  maxFiles={10}
                  maxFileSize={10 * 1024 * 1024} // 10MB
                />
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl h-10 sm:h-9"
                />
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="rounded-xl text-xs"
              >
                All ({mediaItems.length})
              </Button>
              <Button
                variant={filterType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("image")}
                className="rounded-xl text-xs"
              >
                <FileImage className="h-3 w-3 mr-1" />
                Images ({mediaItems.filter((item) => item.type === "image").length})
              </Button>
              <Button
                variant={filterType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("video")}
                className="rounded-xl text-xs"
              >
                <FileVideo className="h-3 w-3 mr-1" />
                Videos ({mediaItems.filter((item) => item.type === "video").length})
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden rounded-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="sm:hidden animate-in slide-in-from-top-2 duration-200">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">Filter by type</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={filterType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilterType("all")
                        setShowMobileFilters(false)
                      }}
                      className="rounded-xl text-xs"
                    >
                      All ({mediaItems.length})
                    </Button>
                    <Button
                      variant={filterType === "image" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilterType("image")
                        setShowMobileFilters(false)
                      }}
                      className="rounded-xl text-xs"
                    >
                      <FileImage className="h-3 w-3 mr-1" />
                      Images
                    </Button>
                    <Button
                      variant={filterType === "video" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilterType("video")
                        setShowMobileFilters(false)
                      }}
                      className="rounded-xl text-xs"
                    >
                      <FileVideo className="h-3 w-3 mr-1" />
                      Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Media Gallery */}
          {!isLoading && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="group cursor-pointer transition-all duration-200 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-xl">
                          {item.type === "image" ? (
                            <Image
                              src={`https://api.nebula-cms.nl${item.file_url}`}
                              alt={item.text || item.title || item.file_url}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <FileVideo className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                            </div>
                          )}

                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs backdrop-blur-sm">
                              {item.type}
                            </Badge>
                          </div>

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="secondary" className="rounded-lg backdrop-blur-sm">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">
                            {item.title || item.file_url.split("/").pop()}
                          </p>
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
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 cursor-pointer transition-colors active:bg-white/10"
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            {item.type === "image" ? (
                              <Image
                                src={`https://api.nebula-cms.nl${item.file_url}`}
                                alt={item.text || item.title || item.file_url}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileVideo className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-white truncate">
                                {item.title || item.file_url.split("/").pop()}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 truncate">{item.text || "No description"}</p>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item.id.toString())
                              }}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && filteredItems.length === 0 && (
            <Card className="bg-white/5 border-white/10 border-dashed">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <FileImage className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No media files found</h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base max-w-md mx-auto">
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
              <DialogContent className="max-w-4xl h-[90vh] sm:h-[80vh] backdrop-blur-md bg-black/90 border-white/10 p-0 overflow-hidden">
                <div className="flex flex-col h-full">
                  <DialogHeader className="p-4 sm:p-6 border-b border-white/10">
                    <DialogTitle className="text-white text-lg sm:text-xl">Edit Media</DialogTitle>
                  </DialogHeader>

                  <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 overflow-hidden">
                    {/* Image Preview */}
                    <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-xl overflow-hidden min-h-[200px] sm:min-h-[300px]">
                      {selectedItem.type === "image" ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={`https://api.nebula-cms.nl${selectedItem.file_url}`}
                            alt={selectedItem.text || selectedItem.title || selectedItem.file_url}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <FileVideo className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Edit Form */}
                    <div className="w-full lg:w-80 space-y-4 flex flex-col">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Title</h4>
                        <Input
                          value={selectedItem.title || ""}
                          onChange={(e) =>
                            setSelectedItem((prev) => (prev ? { ...prev, title: e.target.value } : null))
                          }
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

                      <div className="flex-1"></div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                          className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl transition-all duration-200"
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
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </MediaProvider>
  )
}
