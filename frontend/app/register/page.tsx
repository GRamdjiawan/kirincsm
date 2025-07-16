import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register | Kirin CMS",
  description: "Create a new Kirin CMS account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full flex items-center justify-center">
        {/* Glow effects */}
        <div className="absolute -top-40 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <RegisterForm />
      </div>
    </div>
  )
}
