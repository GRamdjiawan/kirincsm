"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash, Key, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserTableProps {
  users: any[]
  onEditUser: (user: any) => void
}

export function UserTable({ users, onEditUser }: UserTableProps) {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleAction = (action: string, user: any) => {
    setSelectedUser(user)

    if (action === "edit") {
      onEditUser(user)
    } else if (action === "reset-password") {
      setIsResetPasswordOpen(true)
    } else if (action === "delete") {
      setIsDeleteDialogOpen(true)
    }
  }

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Administrator":
        return "border-purple-500/50 text-purple-400 bg-purple-500/10"
      case "Editor":
        return "border-blue-500/50 text-blue-400 bg-blue-500/10"
      case "Author":
        return "border-green-500/50 text-green-400 bg-green-500/10"
      case "Contributor":
        return "border-amber-500/50 text-amber-400 bg-amber-500/10"
      default:
        return "border-gray-500/50 text-gray-400 bg-gray-500/10"
    }
  }

  return (
    <>
      <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5">
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Websites</TableHead>
                <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No users found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/5 border-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="sm:hidden mt-1">
                            <Badge variant="outline" className={getRoleBadgeStyles(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={getRoleBadgeStyles(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.websites.map((website: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-white/10 bg-white/5">
                            {website}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleAction("edit", user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
                            <DropdownMenuItem onClick={() => handleAction("edit", user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("reset-password", user)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("delete", user)} className="text-red-500">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="backdrop-blur-xl bg-black/60 border-white/10 rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to {selectedUser?.email}. The user will need to create a new
              password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordOpen(false)}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle password reset logic here
                setIsResetPasswordOpen(false)
              }}
              className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="backdrop-blur-xl bg-black/60 border-white/10 rounded-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {selectedUser?.name} ({selectedUser?.email}). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // Handle delete user logic here
                setIsDeleteDialogOpen(false)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
