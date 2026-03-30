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
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  domain_id: number
}

type SortKey = "title"

const emptyForm = { title: "", description: "" }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [domainId, setDomainId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortKey] = useState<SortKey>("title")
  const [sortAsc, setSortAsc] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    const fetchProjects = async (domainId: number) => {
      setIsLoading(true)
      try {
        const res = await fetch(`http://localhost:8000/api/domains/${domainId}/projects`, {
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

    const fetchDomainId = async (userId: number) => {
      try {
        const res = await fetch(`http://localhost:8000/api/domains/${userId}`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch domain")
        const data = await res.json()
        setDomainId(data.id)
        fetchProjects(data.id)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/me", {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          fetchDomainId(data.id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserId()
  }, [])

  // Filter + sort
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

  const openCreate = () => {
    setEditProject(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const openEdit = (project: Project) => {
    setEditProject(project)
    setFormData({ title: project.title, description: project.description })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !domainId) return
    setIsSaving(true)
    try {
      if (editProject) {
        const res = await fetch(`http://localhost:8000/api/projects/${editProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Update failed")
        const updated = await res.json()
        setProjects((prev) => prev.map((p) => (p.id === editProject.id ? { ...p, ...updated } : p)))
      } else {
        const res = await fetch("http://localhost:8000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, domain_id: domainId }),
        })
        if (!res.ok) throw new Error("Create failed")
        const created = await res.json()
        setProjects((prev) => [created, ...prev])
      }
      setShowForm(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${id}`, {
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

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  )

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
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first project to get started"}
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
                        {project.description || (
                          <span className="text-white/20 italic text-xs">No description</span>
                        )}
                      </td>
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

      {/* Create / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) setShowForm(false) }}>
        <DialogContent className="max-w-lg backdrop-blur-md bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="My awesome project"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of the project"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 rounded-xl"
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
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