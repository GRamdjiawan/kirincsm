"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingButton } from "@/components/ui/loading-button"
import { PlusIcon, Mail } from "lucide-react"
import { WebsiteAssignment } from "./website-assignment"
import { Switch } from "@/components/ui/switch"

interface UserCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateModal({ open, onOpenChange }: UserCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [sendInvite, setSendInvite] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Contributor",
    websites: [],
  })

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleWebsitesChange = (websites: string[]) => {
    setFormData((prev) => ({ ...prev, websites }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-black/60 border-white/10 rounded-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new user account and assign websites and permissions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Author">Author</SelectItem>
                <SelectItem value="Contributor">Contributor</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {formData.role === "Administrator" && "Full access to all features and settings"}
              {formData.role === "Editor" && "Can edit and publish all content, but cannot manage users or settings"}
              {formData.role === "Author" && "Can create and edit their own content, but cannot publish"}
              {formData.role === "Contributor" && "Can only create draft content for review"}
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Website Assignment</Label>
            <p className="text-sm text-muted-foreground mb-4">Select which websites this user can access and manage</p>
            <WebsiteAssignment selectedWebsites={formData.websites} onChange={handleWebsitesChange} />
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="space-y-0.5">
              <Label>Send Invitation Email</Label>
              <p className="text-sm text-muted-foreground">Send an email invitation with account setup instructions</p>
            </div>
            <Switch checked={sendInvite} onCheckedChange={setSendInvite} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 hover:bg-white/5">
            Cancel
          </Button>
          <LoadingButton
            isLoading={isLoading}
            loadingText="Creating..."
            onClick={handleSave}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white"
          >
            {sendInvite ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Create & Send Invite
              </>
            ) : (
              <>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create User
              </>
            )}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
