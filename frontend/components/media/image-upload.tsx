"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Upload, X, FileImage, FileVideo, AlertCircle, CheckCircle, Youtube, Link2 } from "lucide-react"
import { MediaSelector } from "./media-selector"
import { API_URL } from "@/lib/config"

interface UploadFile {
  id: string
  file: File | null
  preview?: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface LibraryMediaItem {
  id: string | number
  file_url?: string
  url?: string
}

interface ImageUploadProps {
  onUploadComplete?: (files: any[]) => void
  maxFiles?: number
  maxFileSize?: number
  acceptedTypes?: string[]
  onAddMediaItems?: (items: LibraryMediaItem[]) => void
  domainId?: number
}

type UploadTab = "file" | "youtube"

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export function ImageUpload({
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 500 * 1024 * 1024,
  acceptedTypes = ["image/*", "video/*"],
  onAddMediaItems,
  domainId,
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<UploadTab>("file")
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeTitle, setYoutubeTitle] = useState("")
  const [youtubeStatus, setYoutubeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [youtubeError, setYoutubeError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | undefined => {
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`
    }
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) return file.type.startsWith(type.replace("/*", "/"))
      return file.type === type
    })
    if (!isValidType) return "File type not supported"
    return undefined
  }

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const mapBackendErrorToMessage = (detail?: string) => {
    if (!detail) return "Upload failed"
    if (
      detail.includes("Domain not found for the current user") ||
      detail.includes("No domains found for the current user")
    ) return "No domain is linked to this account yet. Add/select a domain first, then upload again."
    if (detail.includes("domain_id is required when user has multiple domains"))
      return "Select a domain first before uploading files."
    return detail
  }

  const processFiles = async (files: FileList) => {
    const newFiles: UploadFile[] = []
    for (let i = 0; i < Math.min(files.length, maxFiles - uploadFiles.length); i++) {
      const file = files[i]
      const error = validateFile(file)
      const preview = await createPreview(file)
      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        progress: 0,
        status: error ? "error" : "pending",
        error,
      })
    }
    setUploadFiles((prev) => [...prev, ...newFiles])
    newFiles.filter((f) => f.status === "pending").forEach((uploadFile) => {
      uploadFile.status = "uploading"
      uploadFileToServer(uploadFile)
    })
  }

  const uploadFileToServer = async (uploadFile: UploadFile) => {
    if (!uploadFile.file) {
      setUploadFiles((prev) =>
        prev.map((f) => f.id === uploadFile.id ? { ...f, status: "error", error: "No file available for upload." } : f),
      )
      return
    }
    if (!domainId) {
      setUploadFiles((prev) =>
        prev.map((f) => f.id === uploadFile.id ? { ...f, status: "error", error: "Select a domain first before uploading files." } : f),
      )
      return
    }
    const formData = new FormData()
    formData.append("file", uploadFile.file)
    try {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
      }
      const response = await fetch(`${API_URL}/api/upload?domain_id=${domainId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!response.ok) {
        let detail = ""
        try {
          const errorPayload = await response.json()
          detail = errorPayload?.detail || ""
        } catch {}
        throw new Error(mapBackendErrorToMessage(detail))
      }
      const uploadedFile = await response.json()
      setUploadFiles((prev) =>
        prev.map((f) => f.id === uploadFile.id ? { ...f, status: "success", progress: 100, ...uploadedFile } : f),
      )
      onUploadComplete?.([uploadedFile])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: errorMessage } : f)),
      )
    }
  }

  const handleAddYouTube = async () => {
    if (!youtubeUrl.trim()) return
    if (!domainId) {
      setYoutubeError("Select a domain first.")
      setYoutubeStatus("error")
      return
    }
    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      setYoutubeError("Not a valid YouTube URL.")
      setYoutubeStatus("error")
      return
    }
    setYoutubeStatus("loading")
    setYoutubeError("")
    try {
      const res = await fetch(`${API_URL}/api/media/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          url: youtubeUrl.trim(),
          title: youtubeTitle.trim() || videoId,
          domain_id: domainId,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.detail || "Failed to add YouTube video")
      }
      const created = await res.json()
      setYoutubeStatus("success")
      setYoutubeUrl("")
      setYoutubeTitle("")
      onUploadComplete?.([created])
      setTimeout(() => setYoutubeStatus("idle"), 3000)
    } catch (err) {
      setYoutubeError(err instanceof Error ? err.message : "Failed to add video")
      setYoutubeStatus("error")
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
    },
    [uploadFiles.length, maxFiles],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  const removeFile = (id: string) => setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  const clearAll = () => setUploadFiles([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const addMediaItems = (items: LibraryMediaItem[]) => {
    const newFiles = items.map((item) => ({
      id: String(item.id),
      file: null,
      preview: item.file_url || item.url,
      progress: 100,
      status: "success" as const,
    }))
    setUploadFiles((prev) => [...prev, ...newFiles])
    onAddMediaItems?.(items)
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/10">
        {(["file", "youtube"] as UploadTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? "border-neon-blue text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === "file" ? <Upload className="h-3.5 w-3.5" /> : <Youtube className="h-3.5 w-3.5" />}
            {tab === "file" ? "Upload File" : "YouTube URL"}
          </button>
        ))}
      </div>

      {activeTab === "file" ? (
        <>
          {/* Drop Zone */}
          <Card
            className={`border-2 border-dashed transition-colors ${
              isDragOver ? "border-neon-blue bg-neon-blue/10" : "border-white/20 bg-white/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Drop files here or click to upload</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Images and videos up to {Math.round(maxFileSize / 1024 / 1024)}MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedTypes.join(",")}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-neon-blue hover:bg-neon-blue/90 rounded-xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              <p className="text-xs text-gray-500 mt-2">Maximum {maxFiles} files</p>
            </CardContent>
          </Card>

          {/* Media Selector */}
          <MediaSelector
            onSelect={(items) => addMediaItems(items)}
            multiple={true}
            trigger={
              <Button className="bg-neon-blue hover:bg-neon-blue/90 rounded-xl">
                <Upload className="h-4 w-4 mr-2" />
                Select from Media Library
              </Button>
            }
          />

          {/* Upload Queue */}
          {uploadFiles.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-white">Upload Queue ({uploadFiles.length})</h4>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-400 hover:text-white">
                    Clear All
                  </Button>
                </div>
                <div className="space-y-3">
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        {uploadFile.preview ? (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file?.name || "selected media"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {(uploadFile.file?.type || "").startsWith("image/") ? (
                              <FileImage className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FileVideo className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-white truncate">
                            {uploadFile.file?.name || "Selected media"}
                          </p>
                          <Badge
                            variant={
                              uploadFile.status === "success"
                                ? "default"
                                : uploadFile.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {uploadFile.status}
                          </Badge>
                        </div>
                        {uploadFile.file && (
                          <p className="text-xs text-gray-400">{formatFileSize(uploadFile.file.size)}</p>
                        )}
                        {uploadFile.status === "uploading" && (
                          <Progress value={uploadFile.progress} className="mt-2 h-1" />
                        )}
                        {uploadFile.error && (
                          <p className="text-xs text-red-400 mt-1">{uploadFile.error}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {uploadFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
                        {uploadFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                        {uploadFile.status === "uploading" && (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-blue" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* YouTube Tab */
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Youtube className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Add YouTube Video</p>
                <p className="text-xs text-gray-500">Paste a YouTube link to embed it in your portfolio</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                YouTube URL *
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  value={youtubeUrl}
                  onChange={(e) => { setYoutubeUrl(e.target.value); setYoutubeStatus("idle"); setYoutubeError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddYouTube()}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="pl-9 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                Title (optional)
              </label>
              <Input
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                placeholder="My video title"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>

            {/* Preview thumbnail */}
            {extractYouTubeId(youtubeUrl) && (
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-video relative">
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(youtubeUrl)}/mqdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                  </div>
                </div>
              </div>
            )}

            {youtubeError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {youtubeError}
              </p>
            )}
            {youtubeStatus === "success" && (
              <p className="text-xs text-green-400 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                YouTube video added to media library
              </p>
            )}

            <Button
              onClick={handleAddYouTube}
              disabled={!youtubeUrl.trim() || youtubeStatus === "loading"}
              className="w-full bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {youtubeStatus === "loading" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding…
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4 mr-2" />
                  Add to Media Library
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
