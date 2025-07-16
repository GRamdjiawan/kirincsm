"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileImage, FileVideo, AlertCircle, CheckCircle } from "lucide-react"
import { MediaSelector } from "./media-selector"

interface UploadFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface ImageUploadProps {
  onUploadComplete?: (files: any[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedTypes?: string[]
  onAddMediaItems?: (items: MediaItem[]) => void // New prop

}

export function ImageUpload({
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "video/*"],
  onAddMediaItems,
}: ImageUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`
    }

    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", "/"))
      }
      return file.type === type
    })

    if (!isValidType) {
      return "File type not supported"
    }

    return null
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

    // Start uploading valid files
    newFiles
      .filter((f) => f.status === "pending")
      .forEach((uploadFile) => {
        uploadFile.status = "uploading"
        uploadFileToServer(uploadFile)
      })
  }

  const uploadFileToServer = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile.file)

    try {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
      }

      console.log(formData);
      

      const response = await fetch("https://api.kirin-cms.nl/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const uploadedFile = await response.json()

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "success", progress: 100, ...uploadedFile }
            : f
        )
      )

      onUploadComplete?.([uploadedFile])
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: "Upload failed" } : f)),
      )
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

      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files)
      }
    },
    [uploadFiles.length, maxFiles],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearAll = () => {
    setUploadFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const addMediaItems = (items: MediaItem[]) => {
    const newFiles = items.map((item) => ({
      id: item.id,
      file: null, // Media library items won't have a `File` object
      preview: item.file_url,
      progress: 100,
      status: "success",
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])
    onAddMediaItems?.(items)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
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
          <p className="text-gray-400 mb-4">
            Support for images and videos up to {Math.round(maxFileSize / 1024 / 1024)}MB
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
            className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
          <p className="text-xs text-gray-500 mt-2">Maximum {maxFiles} files</p>
        </CardContent>
      </Card>

      {/* Media Selector */}
      <MediaSelector
        onSelect={(items) => {
          addMediaItems(items)
        }}
        multiple={true}
        trigger={
          <Button className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl">
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
                  {/* File Preview */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {uploadFile.preview ? (
                      <img
                        src={uploadFile.preview || "/placeholder.svg"}
                        alt={uploadFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {uploadFile.file.type.startsWith("image/") ? (
                          <FileImage className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FileVideo className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{uploadFile.file.name}</p>
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
                    <p className="text-xs text-gray-400">{formatFileSize(uploadFile.file.size)}</p>

                    {/* Progress Bar */}
                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-2 h-1" />}

                    {/* Error Message */}
                    {uploadFile.error && <p className="text-xs text-red-400 mt-1">{uploadFile.error}</p>}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {uploadFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
                    {uploadFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                    {uploadFile.status === "uploading" && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-blue"></div>
                    )}
                  </div>

                  {/* Remove Button */}
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
    </div>
  )
}