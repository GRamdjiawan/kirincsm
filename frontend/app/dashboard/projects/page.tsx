"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useDomain } from "@/context/DomainContext"

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
  // local only — used before saving
  _tempId?: string
  _definitionName?: string
}

interface Project {
  id: number
  title: string
  description: string
  domain_id: number
  fields?: ProjectField[]
}

const emptyForm = { title: "", description: "" }
const emptyFieldInput = { definitionId: "", value: "" }

export default function ProjectsPage() {
  const { selectedDomain } = useDomain()
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [fieldDefinitions, setFieldDefinitions] = useState<FieldDefinition[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  // Staged fields in the dialog (not yet saved to backend)
  const [stagedFields, setStagedFields] = useState<ProjectField[]>([])
  const [removedFieldIds, setRemovedFieldIds] = useState<number[]>([])
  const [fieldInput, setFieldInput] = useState(emptyFieldInput)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // ── Fetch projects for selected domain ────────────────────────────────────────
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`https://api.kirin-cms.nl/api/domains/${selectedDomain?.id}/projects`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          setProjects([])
        } else {
          const data = await res.json()
          setProjects(data)
        }
      } catch (err) {
        console.error(err)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedDomain?.id) {
      fetchProjects()
    }
  }, [selectedDomain?.id])

  // Fetch field definitions once
  useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        const res = await fetch("https://api.kirin-cms.nl/api/project-field-definitions", {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setFieldDefinitions(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDefinitions()
  }, [])

  // ── Filter + sort ────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...projects]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      )
    }

    result.sort((a, b) => {
      const va = a.title.toLowerCase()
      const vb = b.title.toLowerCase()
      return sortAsc ? (va < vb ? -1 : 1) : va > vb ? -1 : 1
    })

    setFiltered(result)
  }, [projects, searchQuery, sortAsc])

  // ── Dialog helpers ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditProject(null)
    setFormData(emptyForm)
    setStagedFields([])
    setRemovedFieldIds([])
    setFieldInput(emptyFieldInput)
    setShowForm(true)
  }

  const openEdit = (project: Project) => {
    setEditProject(project)
    setFormData({ title: project.title, description: project.description })
    // Map existing fields with their definition name for display
    const existing: ProjectField[] = (project.fields ?? []).map((f) => ({
      ...f,
      _tempId: String(f.id ?? Math.random()),
      _definitionName:
        fieldDefinitions.find((d) => d.key_name === f.field_key)?.name ?? f.field_key,
    }))
    setStagedFields(existing)
    setRemovedFieldIds([])
    setFieldInput(emptyFieldInput)
    setShowForm(true)
  }

  // Add a field to the staged list (not yet saved)
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
      const fieldToRemove = prev.find((f) => f._tempId === tempId)
      if (fieldToRemove?.id) {
        setRemovedFieldIds((ids) => [...ids, fieldToRemove.id as number])
      }
      return prev.filter((f) => f._tempId !== tempId)
    })
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.title.trim() || !selectedDomain?.id) return
    setIsSaving(true)
    try {
      let projectId: number

      if (editProject) {
        const res = await fetch(`https://api.kirin-cms.nl/api/projects/${editProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Update failed")
        projectId = editProject.id
      } else {
        const res = await fetch("https://api.kirin-cms.nl/api/projects/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, domain_id: selectedDomain.id }),
        })
        if (!res.ok) throw new Error("Create failed")
        const created = await res.json()
        projectId = created.id
      }

      // Delete fields removed in the editor
      for (const fieldId of removedFieldIds) {
        const deleteRes = await fetch(`https://api.kirin-cms.nl/api/project-fields/${fieldId}`, {
          method: "DELETE",
          credentials: "include",
        })
        if (!deleteRes.ok) throw new Error("Field delete failed")
      }

      // Immediately remove deleted fields from the projects state
      setProjects((prev) =>
        prev.map((p) => {
          if (editProject && p.id === editProject.id) {
            return {
              ...p,
              fields: (p.fields ?? []).filter((f) => !removedFieldIds.includes(f.id!)),
            }
          }
          return p
        }),
      )

      // Save staged fields
      for (const field of stagedFields) {
        if (field.id) {
          // Existing field — update
          const fieldRes = await fetch(`https://api.kirin-cms.nl/api/project-fields/${field.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ field_value: field.field_value }),
          })
          if (!fieldRes.ok) throw new Error("Field update failed")
        } else {
          // New field — create
          const fieldRes = await fetch(`https://api.kirin-cms.nl/api/project-fields`, {
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
          if (!fieldRes.ok) throw new Error("Field create failed")
        }
      }

      // Refetch this project to get updated fields
      const refreshed = await fetch(`https://api.kirin-cms.nl/api/projects/${projectId}`, {
        credentials: "include",
      })
      if (refreshed.ok) {
        const updatedProject = await refreshed.json()
        setProjects((prev) =>
          editProject
            ? prev.map((p) => (p.id === projectId ? updatedProject : p))
            : [updatedProject, ...prev],
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

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://api.kirin-cms.nl/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteConfirm(null)
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  // Collect all unique field keys that appear across visible projects for table headers
  const allFieldKeys = Array.from(
    new Set(filtered.flatMap((p) => (p.fields ?? []).map((f) => f.field_key))),
  )

  const truncateDescription = (desc: string | undefined, maxWords: number = 6): string => {
    if (!desc) return ""
    const words = desc.split(" ")
    if (words.length <= maxWords) return desc
    return words.slice(0, maxWords).join(" ") + "..."
  }

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  )

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen from-gray-900 via-gray-800 to-gray-900">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Project saved successfully!</span>
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your projects • {projects.length} total
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
                    {/* Dynamic field columns */}
                    {allFieldKeys.map((key) => (
                      <th key={key} className="text-left px-4 py-3 hidden lg:table-cell capitalize whitespace-nowrap">
                        {fieldDefinitions.find((d) => d.key_name === key)?.name ?? key}
                      </th>
                    ))}
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((project) => (
                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{project.title}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell max-w-xs truncate">
                        {truncateDescription(project.description) || (
                          <span className="text-white/20 italic text-xs">No description</span>
                        )}
                      </td>
                      {/* Dynamic field values per row */}
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
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) setShowForm(false) }}>
        <DialogContent className="max-w-lg backdrop-blur-md bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="My awesome project"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of the project"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>

            {/* Dynamic field input row */}
            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">Add Field</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={fieldInput.definitionId}
                  onChange={(e) => setFieldInput((p) => ({ ...p, definitionId: e.target.value }))}
                  className="w-full sm:w-40 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neon-blue"
                >
                  <option value="" disabled className="bg-gray-900">
                    Select field...
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
                  placeholder="Value..."
                  className="flex-1 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                />

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddField}
                  disabled={!fieldInput.definitionId || !fieldInput.value.trim()}
                  className="h-10 px-3 sm:flex-shrink-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl disabled:opacity-30"
                >
                  Confirm
                </Button>
              </div>
            </div>

            {/* Staged fields list */}
            {stagedFields.length > 0 && (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                {stagedFields.map((field) => (
                  <div
                    key={field._tempId}
                    className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                        {field._definitionName ?? field.field_key}
                      </span>
                      <span className="text-sm text-white truncate">{field.field_value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStagedField(field._tempId!)}
                      className="ml-2 flex-shrink-0 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Save button */}
            <Button
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl"
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim()}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
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
            Are you sure? This action cannot be undone.
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