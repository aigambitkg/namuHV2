"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "react-hot-toast"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean().optional(),
  role: z.enum(["applicant", "recruiter"]),
  honeypot: z.string().max(0).optional()
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState<"applicant" | "recruiter">("applicant")
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "applicant" }
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError("")
    try {
      // CSRF/Honeypot check
      if (data.honeypot) return
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })
      if (error) throw error
      toast.success("Login erfolgreich!")
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message || "Login fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider: "google" | "linkedin") => {
    setLoading(true)
    setError("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) throw error
    } catch (e: any) {
      setError(e.message || "Social Login fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-md mx-auto">
        <div className="mb-8 flex items-center gap-2">
          <Image src="/logo.svg" alt="namuH Logo" width={40} height={40} />
          <span className="font-bold text-2xl text-blue-500">namuH</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Anmelden</h1>
        <p className="text-gray-500 mb-6">Willkommen zurück! Bitte melde dich an.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" className="hidden" autoComplete="off" tabIndex={-1} {...register("honeypot")} />
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setRole("applicant")}
              className={`flex-1 py-2 rounded ${role === "applicant" ? "bg-blue-500 text-white" : "bg-gray-100"}`}>Bewerber</button>
            <button type="button" onClick={() => setRole("recruiter")}
              className={`flex-1 py-2 rounded ${role === "recruiter" ? "bg-blue-500 text-white" : "bg-gray-100"}`}>Unternehmen</button>
          </div>
          <input type="hidden" value={role} {...register("role")} />
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input type="email" autoComplete="email" {...register("email")} className="w-full border rounded px-3 py-2" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input type="password" autoComplete="current-password" {...register("password")} className="w-full border rounded px-3 py-2" />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("remember")} /> Angemeldet bleiben
            </label>
            <Link href="/reset-password" className="text-blue-500 text-sm hover:underline">Passwort vergessen?</Link>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50" disabled={loading}>
            {loading ? "Lädt..." : "Anmelden"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">oder</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => handleSocial("google")}
            className="w-full flex items-center justify-center gap-2 border rounded py-2 hover:bg-gray-50">
            <Image src="/google.svg" alt="Google" width={20} height={20} /> Google Login
          </button>
          <button onClick={() => handleSocial("linkedin")}
            className="w-full flex items-center justify-center gap-2 border rounded py-2 hover:bg-gray-50">
            <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} /> LinkedIn Login
          </button>
        </div>
        <div className="mt-6 text-center text-sm">
          Noch kein Account? <Link href="/register" className="text-blue-500 hover:underline">Jetzt registrieren</Link>
        </div>
      </div>
      {/* Right: Image/Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 to-blue-200 items-center justify-center">
        <div className="max-w-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Fairness, Humanity and Transparency</h2>
          <ul className="space-y-3 text-blue-900">
            <li>✓ Einfache, schnelle Bewerbung</li>
            <li>✓ KI-gestützte Karriereberatung</li>
            <li>✓ Datenschutz &amp; Sicherheit</li>
            <li>✓ Für Bewerber &amp; Unternehmen</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 