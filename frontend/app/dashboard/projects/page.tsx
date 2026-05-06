"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  CheckCircle,
  FolderOpen,
  Save,
  ChevronUp,
  ChevronDown,
  X,
  Image as ImageIcon,
  Settings2,
  Tag,
  ChevronDown as ChevronDownSm,
  Check,
} from "lucide-react"
import { useDomain } from "@/context/DomainContext"
import { API_URL } from "@/lib/config"
import Image from "next/image"

// ── Types ─────────────────────────────────────────────────────────────────────

interface FieldDefinition {
  id: number
  name: string
  key_name: string
  field_type: string
}

interface ProjectField {
  id?: number
  field_key: string
  field_value: string
  field_type: string
  field_definition_id?: number | null
  _tempId?: string
  _definitionName?: string
}

interface MediaItem {
  id: number
  file_url: string
  title: string
  type: string
  aspect_ratio?: number | null
}

interface Project {
  id: number
  title: string
  description: string
  domain_id: number
  thumbnail_id?: number | null
  fields?: ProjectField[]
  media_items?: MediaItem[]
}

const emptyForm = { title: "", description: "" }
const emptyFieldInput = { definitionId: "", value: "" }

// ── Thumbnail Picker Popover ──────────────────────────────────────────────────

function ThumbnailPicker({
  project,
  onSelect,
}: {
  project: Project
  onSelect: (mediaId: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const images = (project.media_items ?? []).filter((m) => m.type === "image")

  const currentThumb =
    images.find((m) => m.id === project.thumbnail_id) ?? images[0]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (images.length === 0) {
    return (
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <ImageIcon className="h-4 w-4 text-white/20" />
      </div>
    )
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => images.length > 1 && setOpen((o) => !o)}
        className="group relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-blue"
        title={images.length > 1 ? "Change cover image" : undefined}
      >
        <Image
          src={`${API_URL}${currentThumb.file_url}`}
          alt={currentThumb.title}
          fill
          className="object-cover"
          sizes="40px"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ChevronDownSm className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-12 z-50 bg-gray-900 border border-white/10 rounded-xl p-2 shadow-xl"
            style={{ width: images.length > 4 ? 176 : Math.max(images.length * 40 + (images.length - 1) * 4 + 16, 88) }}
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider px-1 mb-2">
              Select cover
            </p>
            <div className="grid grid-cols-4 gap-1">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    onSelect(img.id)
                    setOpen(false)
                  }}
                  className="relative w-9 h-9 rounded-md overflow-hidden border-2 transition-colors focus:outline-none"
                  style={{
                    borderColor:
                      img.id === (project.thumbnail_id ?? images[0]?.id)
                        ? "rgb(99 102 241)"
                        : "transparent",
                  }}
                >
                  <Image
                    src={`${API_URL}${img.file_url}`}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                  {img.id === (project.thumbnail_id ?? images[0]?.id) && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Cover Image Selector (in dialog) ─────────────────────────────────────────

function CoverImageSelector({
  images,
  selectedId,
  onSelect,
}: {
  images: MediaItem[]
  selectedId?: number | null
  onSelect: (id: number | null) => void
}) {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
        <ImageIcon className="h-6 w-6 text-white/20 mx-auto mb-1" />
        <p className="text-xs text-gray-500">No images linked to this project yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {images.map((img) => {
        const active = img.id === (selectedId ?? images[0]?.id)
        return (
          <button
            key={img.id}
            onClick={() => onSelect(img.id)}
            className="relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-blue"
            style={{ borderColor: active ? "rgb(99 102 241)" : "transparent" }}
          >
            <Image
              src={`${API_URL}${img.file_url}`}
              alt={img.title}
              fill
              className="object-cover"
              sizes="80px"
            />
            {active && (
              <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Field Row ─────────────────────────────────────────────────────────────────

function FieldRow({
  field,
  onRemove,
  onChange,
}: {
  field: ProjectField
  onRemove: (tempId: string) => void
  onChange: (tempId: string, value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(field.field_value)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 group"
    >
      <span className="text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0">
        {field._definitionName ?? field.field_key}
      </span>
      {editing ? (
        <input
          autoFocus
          className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neon-blue"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            onChange(field._tempId!, val)
            setEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              onChange(field._tempId!, val)
              setEditing(false)
            }
          }}
        />
      ) : (
        <button
          className="flex-1 text-sm text-white text-left truncate hover:text-white/80 transition-colors"
          onClick={() => setEditing(true)}
        >
          {field.field_value || <span className="text-white/30 italic">empty</span>}
        </button>
      )}
      <button
        type="button"
        onClick={() => onRemove(field._tempId!)}
        className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

// ── Dialog Tabs ───────────────────────────────────────────────────────────────

type Tab = "details" | "fields"

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { selectedDomain } = useDomain()
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [fieldDefinitions, setFieldDefinitions] = useState<FieldDefinition[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("details")
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formThumbnailId, setFormThumbnailId] = useState<number | null>(null)
  const [stagedFields, setStagedFields] = useState<ProjectField[]>([])
  const [removedFieldIds, setRemovedFieldIds] = useState<number[]>([])
  const [fieldInput, setFieldInput] = useState(emptyFieldInput)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/domains/${selectedDomain?.id}/projects`, {
          credentials: "include",
        })
        if (res.ok) {
          setProjects(await res.json())
        } else {
          setProjects([])
        }
      } catch {
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    if (selectedDomain?.id) fetchProjects()
  }, [selectedDomain?.id])

  useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/project-field-definitions`, {
          credentials: "include",
        })
        if (res.ok) setFieldDefinitions(await res.json())
      } catch {}
    }
    fetchDefinitions()
  }, [])

  // ── Filter + Sort ──────────────────────────────────────────────────────────

  useEffect(() => {
    let result = [...projects]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
      )
    }
    result.sort((a, b) => {
      const va = a.title.toLowerCase()
      const vb = b.title.toLowerCase()
      return sortAsc ? (va < vb ? -1 : 1) : va > vb ? -1 : 1
    })
    setFiltered(result)
  }, [projects, searchQuery, sortAsc])

  // ── Dialog helpers ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditProject(null)
    setFormData(emptyForm)
    setFormThumbnailId(null)
    setStagedFields([])
    setRemovedFieldIds([])
    setFieldInput(emptyFieldInput)
    setActiveTab("details")
    setShowForm(true)
  }

  const openEdit = (project: Project) => {
    setEditProject(project)
    setFormData({ title: project.title, description: project.description })
    setFormThumbnailId(project.thumbnail_id ?? null)
    const existing: ProjectField[] = (project.fields ?? []).map((f) => ({
      ...f,
      _tempId: String(f.id ?? Math.random()),
      _definitionName:
        fieldDefinitions.find((d) => d.key_name === f.field_key)?.name ?? f.field_key,
    }))
    setStagedFields(existing)
    setRemovedFieldIds([])
    setFieldInput(emptyFieldInput)
    setActiveTab("details")
    setShowForm(true)
  }

  const handleAddField = () => {
    if (!fieldInput.definitionId || !fieldInput.value.trim()) return
    const def = fieldDefinitions.find((d) => String(d.id) === fieldInput.definitionId)
    if (!def) return
    setStagedFields((prev) => [
      ...prev,
      {
        field_key: def.key_name,
        field_value: fieldInput.value.trim(),
        field_type: def.field_type,
        field_definition_id: def.id,
        _tempId: String(Math.random()),
        _definitionName: def.name,
      },
    ])
    setFieldInput(emptyFieldInput)
  }

  const handleRemoveStagedField = (tempId: string) => {
    setStagedFields((prev) => {
      const f = prev.find((f) => f._tempId === tempId)
      if (f?.id) setRemovedFieldIds((ids) => [...ids, f.id as number])
      return prev.filter((f) => f._tempId !== tempId)
    })
  }

  const handleFieldValueChange = (tempId: string, value: string) => {
    setStagedFields((prev) =>
      prev.map((f) => (f._tempId === tempId ? { ...f, field_value: value } : f)),
    )
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!formData.title.trim() || !selectedDomain?.id) return
    setIsSaving(true)
    try {
      let projectId: number

      if (editProject) {
        const res = await fetch(`${API_URL}/api/projects/${editProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, thumbnail_id: formThumbnailId }),
        })
        if (!res.ok) throw new Error("Update failed")
        projectId = editProject.id
      } else {
        const res = await fetch(`${API_URL}/api/projects/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            domain_id: selectedDomain.id,
            thumbnail_id: formThumbnailId,
          }),
        })
        if (!res.ok) throw new Error("Create failed")
        const created = await res.json()
        projectId = created.id
      }

      for (const fieldId of removedFieldIds) {
        await fetch(`${API_URL}/api/project-fields/${fieldId}`, {
          method: "DELETE",
          credentials: "include",
        })
      }

      setProjects((prev) =>
        prev.map((p) => {
          if (editProject && p.id === editProject.id) {
            return { ...p, fields: (p.fields ?? []).filter((f) => !removedFieldIds.includes(f.id!)) }
          }
          return p
        }),
      )

      for (const field of stagedFields) {
        if (field.id) {
          await fetch(`${API_URL}/api/project-fields/${field.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ field_value: field.field_value }),
          })
        } else {
          await fetch(`${API_URL}/api/project-fields`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              project_id: projectId,
              field_key: field.field_key,
              field_value: field.field_value,
              field_type: field.field_type,
              field_definition_id: field.field_definition_id ?? null,
            }),
          })
        }
      }

      const refreshed = await fetch(`${API_URL}/api/projects/${projectId}`, {
        credentials: "include",
      })
      if (refreshed.ok) {
        const updated = await refreshed.json()
        setProjects((prev) =>
          editProject
            ? prev.map((p) => (p.id === projectId ? updated : p))
            : [updated, ...prev],
        )
      }

      setShowForm(false)
      setRemovedFieldIds([])
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // ── Inline thumbnail update ────────────────────────────────────────────────

  const handleThumbnailSelect = async (projectId: number, mediaId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ thumbnail_id: mediaId }),
      })
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, thumbnail_id: mediaId } : p)),
        )
      }
    } catch {}
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
    } finally {
      setDeleteConfirm(null)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const allFieldKeys = Array.from(
    new Set(filtered.flatMap((p) => (p.fields ?? []).map((f) => f.field_key))),
  )

  const truncate = (s: string | undefined, max = 8) => {
    if (!s) return ""
    const words = s.split(" ")
    return words.length <= max ? s : words.slice(0, max).join(" ") + "…"
  }

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  )

  // Current project's images (for cover picker in dialog)
  const dialogImages = (editProject?.media_items ?? []).filter((m) => m.type === "image")

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Project saved</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 text-sm">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="sm:w-auto bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl h-10"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <Card className="bg-white/5 border-white/10 border-dashed">
            <CardContent className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery ? "Try adjusting your search" : "Create your first project to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={openCreate}
                  className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3 w-10" />
                    <th
                      className="text-left px-4 py-3 cursor-pointer hover:text-white select-none whitespace-nowrap"
                      onClick={() => setSortAsc((prev) => !prev)}
                    >
                      Title{" "}
                      {sortAsc ? (
                        <ChevronUp className="h-3 w-3 ml-1 inline" />
                      ) : (
                        <ChevronDown className="h-3 w-3 ml-1 inline" />
                      )}
                    </th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Description</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                      Images
                    </th>
                    {allFieldKeys.map((key) => (
                      <th
                        key={key}
                        className="text-left px-4 py-3 hidden lg:table-cell capitalize whitespace-nowrap"
                      >
                        {fieldDefinitions.find((d) => d.key_name === key)?.name ?? key}
                      </th>
                    ))}
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((project) => {
                    const images = (project.media_items ?? []).filter((m) => m.type === "image")
                    return (
                      <tr key={project.id} className="hover:bg-white/5 transition-colors">
                        {/* Thumbnail cell */}
                        <td className="pl-4 pr-2 py-3">
                          <ThumbnailPicker
                            project={project}
                            onSelect={(mediaId) => handleThumbnailSelect(project.id, mediaId)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-white">{project.title}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell max-w-xs">
                          {truncate(project.description) || (
                            <span className="text-white/20 italic text-xs">No description</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {images.length > 0 ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              {images.length}
                            </span>
                          ) : (
                            <span className="text-white/20 italic text-xs">—</span>
                          )}
                        </td>
                        {allFieldKeys.map((key) => {
                          const field = (project.fields ?? []).find((f) => f.field_key === key)
                          return (
                            <td key={key} className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                              {field?.field_value || (
                                <span className="text-white/20 italic text-xs">—</span>
                              )}
                            </td>
                          )
                        })}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-white/10"
                              onClick={() => openEdit(project)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-gray-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10"
                              onClick={() => setDeleteConfirm(project.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) setShowForm(false) }}>
        <DialogContent className="max-w-2xl backdrop-blur-md bg-black/90 border-white/10 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-white text-lg">
              {editProject ? "Project Settings" : "New Project"}
            </DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-0 px-6 pt-4 border-b border-white/10">
            {(["details", "fields"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? "border-neon-blue text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "details" ? (
                  <Settings2 className="h-3.5 w-3.5" />
                ) : (
                  <Tag className="h-3.5 w-3.5" />
                )}
                {tab === "details" ? "Details" : "Fields"}
                {tab === "fields" && stagedFields.length > 0 && (
                  <span className="ml-1 text-[10px] bg-neon-blue/20 text-neon-blue px-1.5 py-0.5 rounded-full">
                    {stagedFields.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-6 py-5 space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Title */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      placeholder="My awesome project"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Short description of the project…"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neon-blue resize-none placeholder:text-gray-600"
                    />
                  </div>

                  {/* Cover image (edit mode only) */}
                  {editProject && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                        Cover Image
                      </label>
                      <CoverImageSelector
                        images={dialogImages}
                        selectedId={formThumbnailId}
                        onSelect={setFormThumbnailId}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "fields" && (
                <motion.div
                  key="fields"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Add field row */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                      Add Field
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={fieldInput.definitionId}
                        onChange={(e) => setFieldInput((p) => ({ ...p, definitionId: e.target.value }))}
                        className="w-40 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neon-blue flex-shrink-0"
                      >
                        <option value="" disabled className="bg-gray-900">
                          Field type…
                        </option>
                        {fieldDefinitions.map((def) => (
                          <option key={def.id} value={String(def.id)} className="bg-gray-900">
                            {def.name}
                          </option>
                        ))}
                      </select>

                      <Input
                        value={fieldInput.value}
                        onChange={(e) => setFieldInput((p) => ({ ...p, value: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleAddField()}
                        placeholder="Value…"
                        className="flex-1 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                      />

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddField}
                        disabled={!fieldInput.definitionId || !fieldInput.value.trim()}
                        className="h-10 px-4 flex-shrink-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl disabled:opacity-30"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Fields list */}
                  {stagedFields.length > 0 ? (
                    <div className="rounded-xl border border-white/10 overflow-hidden">
                      <AnimatePresence>
                        {stagedFields.map((field) => (
                          <FieldRow
                            key={field._tempId}
                            field={field}
                            onRemove={handleRemoveStagedField}
                            onChange={handleFieldValueChange}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                      <Tag className="h-5 w-5 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No fields added yet</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Select a field type and enter a value above
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save */}
            <Button
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl"
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim()}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editProject ? "Save Changes" : "Create Project"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm backdrop-blur-md bg-black/90 border-white/10 [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm py-2">
            This will permanently delete the project and all its fields. This cannot be undone.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="destructive"
              className="flex-1 rounded-xl"
              onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/10 hover:bg-white/5"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
