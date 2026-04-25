"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { API_URL } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Globe,
  Mail,
  Search,
  Trash2,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  Pencil,
  RefreshCw,
  ChevronDown,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

interface User {
  id: number
  name: string | null
  email: string
  role: "admin" | "editor" | "client"
}

interface Domain {
  id: number
  name: string
  user_id: number
  owner_email: string | null
  owner_name: string | null
}

interface EmailLog {
  id: number
  to_email: string
  subject: string
  body: string
  status: "sent" | "failed"
  error: string | null
  sent_at: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  editor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  client: "bg-white/10 text-gray-300 border-white/20",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
        active
          ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/30"
          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-md ${active ? "bg-neon-blue/20 text-neon-blue" : "bg-white/10 text-gray-400"}`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500/90 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {message}
    </div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editRole, setEditRole] = useState<User["role"]>("client")
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = search ? `?email=${encodeURIComponent(search)}` : ""
    const res = await fetch(`${API_URL}/api/admin/users${params}`, { credentials: "include" })
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [fetchUsers])

  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (res.ok) {
      setUsers((p) => p.filter((u) => u.id !== id))
      showToast("User deleted", "success")
    } else {
      showToast("Failed to delete user", "error")
    }
    setDeleteConfirm(null)
  }

  const handleRoleUpdate = async () => {
    if (!editingUser) return
    const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: editRole }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers((p) => p.map((u) => (u.id === updated.id ? updated : u)))
      showToast("Role updated", "success")
    } else {
      showToast("Failed to update role", "error")
    }
    setEditingUser(null)
  }

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-blue rounded-xl h-10"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchUsers}
          className="text-gray-400 hover:text-white rounded-xl h-10 w-10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={4} className="px-4 py-3">
                    <div className="h-5 bg-white/5 rounded animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{u.name || "—"}</p>
                      <p className="text-gray-400 text-xs sm:hidden">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-medium ${ROLE_COLORS[u.role] ?? ROLE_COLORS.client}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== currentUser?.id && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white rounded-lg"
                            onClick={() => {
                              setEditingUser(u)
                              setEditRole(u.role)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {deleteConfirm === u.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                                onClick={() => handleDelete(u.id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 rounded-lg text-xs text-gray-400"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 rounded-lg"
                              onClick={() => setDeleteConfirm(u.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                      {u.id === currentUser?.id && (
                        <span className="text-xs text-gray-500 pr-2">You</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Change Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-400">{editingUser?.email}</p>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "editor", "client"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setEditRole(role)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                    editRole === role
                      ? "border-neon-blue bg-neon-blue/15 text-neon-blue"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-neon-blue hover:bg-neon-blue/90 rounded-xl"
                onClick={handleRoleUpdate}
              >
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/10 rounded-xl text-gray-300"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Domains Tab ─────────────────────────────────────────────────────────────

const selectClass =
  "w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neon-blue appearance-none"

function DomainsTab() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", user_id: "" })

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchDomains = async () => {
    setLoading(true)
    const res = await fetch(`${API_URL}/api/admin/domains`, { credentials: "include" })
    if (res.ok) setDomains(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchDomains()
    fetch(`${API_URL}/api/admin/users`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: User[]) => Array.isArray(data) && setClients(data.filter((u) => u.role === "client")))
  }, [])

  const handleCreate = async () => {
    if (!form.name || !form.user_id) return
    const res = await fetch(`${API_URL}/api/admin/domains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: form.name, user_id: Number(form.user_id) }),
    })
    if (res.ok) {
      showToast("Domain created", "success")
      setShowCreate(false)
      setForm({ name: "", user_id: "" })
      fetchDomains()
    } else {
      const err = await res.json()
      showToast(err.detail || "Failed to create domain", "error")
    }
  }

  const handleUpdate = async () => {
    if (!editingDomain) return
    const res = await fetch(`${API_URL}/api/admin/domains/${editingDomain.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: editingDomain.name, user_id: editingDomain.user_id }),
    })
    if (res.ok) {
      showToast("Domain updated", "success")
      setEditingDomain(null)
      fetchDomains()
    } else {
      showToast("Failed to update domain", "error")
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_URL}/api/admin/domains/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (res.ok) {
      setDomains((p) => p.filter((d) => d.id !== id))
      showToast("Domain deleted", "success")
    } else {
      showToast("Failed to delete domain", "error")
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{domains.length} domains</p>
        <Button
          size="sm"
          className="bg-neon-blue hover:bg-neon-blue/90 rounded-xl h-9"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Domain
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-xl border border-neon-blue/30 bg-neon-blue/5 p-4 space-y-3 animate-in slide-in-from-top-2">
          <p className="text-sm font-medium text-white">Create Domain</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Name (e.g. My Site)"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-neon-blue"
            />
            <select
              value={form.user_id}
              onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
              className={selectClass}
            >
              <option value="" disabled>Select client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900">
                  {c.name ? `${c.name} (${c.email})` : c.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-neon-blue hover:bg-neon-blue/90 rounded-xl"
              onClick={handleCreate}
              disabled={!form.name || !form.user_id}
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 rounded-xl"
              onClick={() => { setShowCreate(false); setForm({ name: "", user_id: "" }) }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Domain</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Owner</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={3} className="px-4 py-3">
                    <div className="h-5 bg-white/5 rounded animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : domains.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No domains yet
                </td>
              </tr>
            ) : (
              domains.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-neon-blue flex-shrink-0" />
                      <span className="text-white font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div>
                      <p className="text-gray-300">{d.owner_name || "—"}</p>
                      <p className="text-xs text-gray-500">{d.owner_email || `user_id: ${d.user_id}`}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white rounded-lg"
                        onClick={() => setEditingDomain({ ...d })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {deleteConfirm === d.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                            onClick={() => handleDelete(d.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 rounded-lg text-xs text-gray-400"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 rounded-lg"
                          onClick={() => setDeleteConfirm(d.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDomain} onOpenChange={() => setEditingDomain(null)}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Domain</DialogTitle>
          </DialogHeader>
          {editingDomain && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Domain name</label>
                <Input
                  value={editingDomain.name}
                  onChange={(e) => setEditingDomain((d) => d ? { ...d, name: e.target.value } : d)}
                  className="bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-neon-blue"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Client</label>
                <select
                  value={editingDomain.user_id}
                  onChange={(e) => setEditingDomain((d) => d ? { ...d, user_id: Number(e.target.value) } : d)}
                  className={selectClass}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-gray-900">
                      {c.name ? `${c.name} (${c.email})` : c.email}
                    </option>
                  ))}
                  {!clients.find((c) => c.id === editingDomain.user_id) && (
                    <option value={editingDomain.user_id} className="bg-gray-900">
                      {editingDomain.owner_name || editingDomain.owner_email || `User #${editingDomain.user_id}`}
                    </option>
                  )}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1 bg-neon-blue hover:bg-neon-blue/90 rounded-xl" onClick={handleUpdate}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 rounded-xl text-gray-300"
                  onClick={() => setEditingDomain(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Email Tab ────────────────────────────────────────────────────────────────

function EmailTab() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLogs = async () => {
    setLoadingLogs(true)
    const res = await fetch(`${API_URL}/api/admin/email/logs`, { credentials: "include" })
    if (res.ok) setLogs(await res.json())
    setLoadingLogs(false)
  }

  useEffect(() => { fetchLogs() }, [])

  const handleSend = async () => {
    if (!to || !subject || !body) return
    setSending(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ to_email: to, subject, body }),
      })
      if (res.ok) {
        showToast(`Email sent to ${to}`, "success")
        setTo("")
        setSubject("")
        setBody("")
        fetchLogs()
      } else {
        const err = await res.json()
        showToast(err.detail || "Failed to send email", "error")
      }
    } finally {
      setSending(false)
    }
  }

  const formatDate = (iso: string | null) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}

      {/* Compose */}
      <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
        <p className="text-sm font-semibold text-white">Compose</p>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">To</label>
          <Input
            type="email"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-blue rounded-xl"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Subject</label>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-blue rounded-xl"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">
            Message{" "}
            <span className="text-gray-600">— HTML supported</span>
          </label>
          <textarea
            placeholder="Write your message here. HTML tags like <b>, <a href>, <p> are supported."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neon-blue resize-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Sent via SMTP from <span className="text-gray-400">SMTP_FROM</span> env var
          </p>
          <Button
            className="bg-neon-blue hover:bg-neon-blue/90 rounded-xl"
            onClick={handleSend}
            disabled={sending || !to || !subject || !body}
          >
            {sending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Sent Emails</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            className="text-gray-400 hover:text-white rounded-xl h-8"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {loadingLogs ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-3 border-b border-white/5">
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
              </div>
            ))
          ) : logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">No emails sent yet</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border-b border-white/5 last:border-0">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-white/3 transition-colors"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${log.status === "sent" ? "bg-green-400" : "bg-red-400"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate font-medium">{log.subject}</p>
                      <p className="text-xs text-gray-400">
                        → {log.to_email} · {formatDate(log.sent_at)}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 flex-shrink-0 transition-transform ${expandedLog === log.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {expandedLog === log.id && (
                  <div className="px-4 pb-4 pt-1 bg-white/3">
                    {log.status === "failed" && log.error && (
                      <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300">
                        {log.error}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
                      {log.body}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "users" | "domains" | "email"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("users")
  const [userCount, setUserCount] = useState<number | undefined>()
  const [domainCount, setDomainCount] = useState<number | undefined>()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role !== "admin") return
    fetch(`${API_URL}/api/admin/users`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setUserCount(d.length))
    fetch(`${API_URL}/api/admin/domains`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setDomainCount(d.length))
  }, [user])

  if (loading || !user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Manage users, domains, and outgoing email</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <TabButton
            active={tab === "users"}
            onClick={() => setTab("users")}
            icon={Users}
            label="Users"
            count={userCount}
          />
          <TabButton
            active={tab === "domains"}
            onClick={() => setTab("domains")}
            icon={Globe}
            label="Domains"
            count={domainCount}
          />
          <TabButton
            active={tab === "email"}
            onClick={() => setTab("email")}
            icon={Mail}
            label="Email"
          />
        </div>

        {/* Tab content */}
        <div>
          {tab === "users" && <UsersTab />}
          {tab === "domains" && <DomainsTab />}
          {tab === "email" && <EmailTab />}
        </div>
      </div>
    </div>
  )
}
