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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingButton } from "@/components/ui/loading-button"
import { Camera, Save, User, Shield, Globe } from "lucide-react"
import { WebsiteAssignment } from "./website-assignment"

interface UserEditModalProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditModal({ user, open, onOpenChange }: UserEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    websites: user.websites,
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

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleWebsitesChange = (websites: string[]) => {
    setFormData((prev) => ({ ...prev, websites }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-black/60 border-white/10 rounded-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information, permissions, and website assignments.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl">
            <TabsTrigger value="details" className="rounded-xl">
              <User className="h-4 w-4 mr-2" />
              User Details
            </TabsTrigger>
            <TabsTrigger value="permissions" className="rounded-xl">
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="websites" className="rounded-xl">
              <Globe className="h-4 w-4 mr-2" />
              Websites
            </TabsTrigger>
          </TabsList>

          {/* User Details Tab */}
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-2 border-white/10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-neon-blue hover:bg-neon-blue/90"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change avatar</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Account Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? "User can log in and access the system"
                    : "User is deactivated and cannot log in"}
                </p>
              </div>
              <Switch checked={formData.isActive} onCheckedChange={handleStatusChange} />
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4 py-4">
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

            <div className="space-y-4 mt-6">
              <h4 className="text-sm font-medium">Additional Permissions</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Media Upload</Label>
                  <p className="text-sm text-muted-foreground">Allow user to upload media files</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Access</Label>
                  <p className="text-sm text-muted-foreground">Allow user to view analytics data</p>
                </div>
                <Switch defaultChecked={formData.role === "Administrator" || formData.role === "Editor"} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground">Allow user to use API endpoints</p>
                </div>
                <Switch defaultChecked={formData.role === "Administrator"} />
              </div>
            </div>
          </TabsContent>

          {/* Websites Tab */}
          <TabsContent value="websites" className="py-4">
            <WebsiteAssignment selectedWebsites={formData.websites} onChange={handleWebsitesChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 hover:bg-white/5">
            Cancel
          </Button>
          <LoadingButton
            isLoading={isLoading}
            loadingText="Saving..."
            onClick={handleSave}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
