"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search, Filter } from "lucide-react"
import { UserTable } from "@/components/users/user-table"
import { UserEditModal } from "@/components/users/user-edit-modal"
import { UserCreateModal } from "@/components/users/user-create-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock user data
import { users } from "@/components/users/mock-data"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === null || user.role === filterRole

    return matchesSearch && matchesRole
  })

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, assign websites, and control permissions</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              {filterRole || "All Roles"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
            <DropdownMenuItem onClick={() => setFilterRole(null)}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRole("Administrator")}>Administrator</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRole("Editor")}>Editor</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRole("Author")}>Author</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRole("Contributor")}>Contributor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UserTable users={filteredUsers} onEditUser={handleEditUser} />

      {isCreateModalOpen && <UserCreateModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />}

      {isEditModalOpen && selectedUser && (
        <UserEditModal user={selectedUser} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
      )}
    </div>
  )
}
