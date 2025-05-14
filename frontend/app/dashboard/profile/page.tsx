"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { LoadingButton } from "@/components/ui/loading-button"
import { Camera, Key, Bell, Shield, Save, User, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 border-2 border-white/10">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xl">
                    A
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

              <h2 className="text-xl font-bold mt-2">Admin User</h2>
              <p className="text-muted-foreground text-sm">admin@example.com</p>

              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1" />
                <span>Administrator</span>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="w-full text-left">
                <h3 className="text-sm font-medium mb-3">Account Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Email Verified</span>
                    <span className="text-xs text-green-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">2FA</span>
                    <span className="text-xs text-amber-400">Not Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Last Login</span>
                    <span className="text-xs">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile tabs */}
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-t-xl">
              <TabsTrigger value="personal" className="rounded-xl">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Personal</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Security</span>
                <span className="sm:hidden">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-xl">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-4 md:p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue="Admin User"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      defaultValue="admin@example.com"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue="Administrator"
                      disabled
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      defaultValue="UTC+01:00"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                </div>

                <LoadingButton
                  isLoading={isLoading}
                  loadingText="Saving..."
                  onClick={handleSave}
                  className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </LoadingButton>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-4 md:p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                </div>

                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>

              <Separator className="my-6 bg-white/10" />

              <CardHeader className="p-0">
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Protect your account with 2FA.</p>
                </div>
                <Switch />
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="p-4 md:p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and offers.</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about suspicious activity.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
