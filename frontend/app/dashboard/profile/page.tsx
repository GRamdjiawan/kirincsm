"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { LoadingButton } from "@/components/ui/loading-button"
import { Camera, Key, Bell, Shield, Save, User, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"


export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { user, loading, setUser } = useAuth()
  const [initials, setInitials] = useState("JD")
  const [fullname, setFullName] = useState("John Doe")
  const [email, setEmail] = useState("example@email.com")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [role, setRole] = useState("")


  useEffect(() => {
    console.log("user", user);
    const fullName = user?.name || "John Doe"
    const capitalizeName = (name: string) => {
      return name
      .split(" ")
      .map((word) =>
        ["van", "van der", "van de"].includes(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ")
    }
    
    const formattedName = capitalizeName(fullName)
    const email = user?.email || "example@email.com"
    setInitials(fullName.split(" ").map((n) => n[0]).join("").toUpperCase() || "JD") 
    setFullName(formattedName)
    setEmail(email)
    setRole(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "User")
    


  }, [user])

  const handleChangePassword = async () => {
    setPasswordError("") // reset error on new attempt
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.")
      return
    }
  
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }
  
    setIsChangingPassword(true)
  
    try {
      const response = await fetch("https://api.kirin-cms.nl/api/users/change-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      })
  
      if (!response.ok) {
        const data = await response.json()
        console.log("Error response:", data);
        
        // const errorMessage = data?.detail || "Password update failed"
        setPasswordError("errorMessage")
        return
      } else{

        alert("Password changed successfully. You will be logged out.")
        try {
          const response = await fetch("https://api.kirin-cms.nl/api/logout", {
            method: "POST",
            credentials: "include",
          })
    
          if (!response.ok) {
            console.error("Failed to log out")
          } else {
            setShowTransition(true)
          }
        } catch (error) {
          console.error("An error occurred during logout:", error)
        }
      }
  
  
    } catch (err) {
      console.error(err)
      setPasswordError("An unexpected error occurred.")
    } finally {
      setIsChangingPassword(false)
    }
  }
  


    if (loading) {
      return <LoadingScreen message="Loading dashboard..." />
    }
    const handleTransitionComplete = () => {
      setUser(null)
    }
  
    if (showTransition) {
      return (
        <LoadingScreen
          message="Logging out..."
          timeout={1000}
          onComplete={handleTransitionComplete}
        />
      )
    }
  

  
  const handleSave = async () => {
    setIsLoading(true)
  
    try {
      const response = await fetch("https://api.kirin-cms.nl/api/users/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          name: fullname,
          email: email,
        }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update profile")
      } else{
        const result = await response.json()
        console.log("Updated user:", result)
        // Optionally show success toast or update UI state
      }
    } catch (error) {
      console.error(error)
      // Optionally show error toast
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex flex-col justify-center items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 text-2xl border-2 border-white/10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-semibold">
                {initials}
                </Avatar>
              </div>

              <h2 className="text-xl font-bold mt-2">{}</h2>
              <p className="text-muted-foreground text-sm">{email}</p>

              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1" />
                <span>{role}</span>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="w-full text-left">
                <h3 className="text-sm font-medium mb-3">Account Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Email Verified</span>
                    <span className="text-xs text-green-400">✓ Verified</span>
                  </div> 
                  {/* future feature */}
                  {/* <div className="flex justify-between items-center">
                    <span className="text-xs">2FA</span>
                    <span className="text-xs text-amber-400">Not Enabled</span>
                  </div> */}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile tabs */}
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-t-xl">
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
              {/* <TabsTrigger value="notifications" className="rounded-xl">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger> */}
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-4 md:p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                      />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500 font-medium">{passwordError}</p>
                )}


                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 rounded-xl"
                >
                  <Key className="mr-2 h-4 w-4" />
                  {isChangingPassword ? "Saving..." : "Change Password"}
                </Button>
              </div>

              {/* <Separator className="my-6 bg-white/10" />

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
              </div> */}
            </TabsContent>

            
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
