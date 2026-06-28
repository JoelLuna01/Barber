"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Scissors, Mail, Lock, User, Phone, AlertCircle, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = React.useState<"login" | "signup">("login")
  
  // Form State
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [phone, setPhone] = React.useState("")

  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [successMsg, setSuccessMsg] = React.useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    const supabase = createClient()
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
      if (tab === "login") {
        if (isMock) {
          // Mock login bypass for local testing (no real Supabase)
          if (email === "admin@barberbook.com" || email === "barbero@barberbook.com") {
            setSuccessMsg("¡Sesión iniciada (Modo Sandbox)!")
            setTimeout(() => router.push("/dashboard"), 1000)
          } else {
            setSuccessMsg("¡Sesión iniciada como cliente (Modo Sandbox)!")
            setTimeout(() => router.push("/"), 1000)
          }
        } else {
          // ── 1. Authenticate with Supabase ──────────────────────────────
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
          if (signInError) throw signInError

          // ── 2. Fetch the user's role from the profiles table ───────────
          const userId = signInData.user?.id
          let role = "client"

          if (userId) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", userId)
              .single()

            if (profile?.role) role = profile.role
          }

          // ── 3. Redirect based on role ──────────────────────────────────
          setSuccessMsg("¡Sesión iniciada con éxito!")
          setTimeout(() => {
            if (role === "admin" || role === "barber") {
              router.push("/dashboard")
            } else {
              router.push("/")
            }
          }, 900)
        }
      } else {
        // ── Sign-up flow ─────────────────────────────────────────────────
        if (isMock) {
          setSuccessMsg("¡Cuenta creada (Modo Sandbox)! Inicia sesión ahora.")
          setTab("login")
        } else {
          // 1. Create the auth user
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
                role: "client"
              }
            }
          })
          if (signUpError) throw signUpError

          // 2. Upsert profile row as a safety fallback
          //    (the DB trigger does this automatically, but this covers
          //    edge cases like email-confirmation flows where the trigger
          //    fires later than expected).
          const userId = signUpData.user?.id
          if (userId) {
            await supabase.from("profiles").upsert({
              id: userId,
              email,
              full_name: fullName || email.split("@")[0],
              role: "client",
              barbershop_id: null
            }, { onConflict: "id", ignoreDuplicates: true })
          }

          setSuccessMsg("¡Cuenta creada! Verifica tu correo electrónico y luego inicia sesión.")
          setTab("login")
        }
      }
    } catch (err: any) {
      // Translate common Supabase error messages to Spanish
      const msg: string = err.message || ""
      if (msg.includes("Invalid login credentials")) {
        setErrorMsg("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.")
      } else if (msg.includes("Email not confirmed")) {
        setErrorMsg("Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.")
      } else if (msg.includes("User already registered")) {
        setErrorMsg("Ya existe una cuenta con ese correo. Inicia sesión en su lugar.")
      } else if (msg.includes("Password should be at least")) {
        setErrorMsg("La contraseña debe tener al menos 6 caracteres.")
      } else {
        setErrorMsg(msg || "Ocurrió un error al procesar tu solicitud.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-white font-sans relative overflow-hidden">
      
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition text-sm">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-500 mb-4">
              <Scissors className="h-7 w-7 rotate-90" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              BARBER<span className="text-amber-500">BOOK</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed max-w-xs">
              {tab === "login"
                ? "Inicia sesión para administrar tu barbería"
                : "Crea tu cuenta para reservar citas en línea"}
            </p>
          </div>

          {/* Sandbox Notice — only shown when env vars are missing */}
          {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400/90 leading-relaxed">
              <strong className="text-amber-500">Modo Sandbox:</strong> Usa{" "}
              <strong className="font-mono">admin@barberbook.com</strong> (cualquier contraseña) para explorar el panel de administración sin base de datos real.
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex border-b border-zinc-800 pb-0 mb-6">
            {[
              { id: "login", label: "Iniciar Sesión" },
              { id: "signup", label: "Crear Cuenta" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id as any); setErrorMsg(""); setSuccessMsg("") }}
                className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
                  tab === t.id
                    ? "text-amber-500 border-amber-500"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 p-3.5 text-xs text-rose-400 font-medium mb-5 leading-relaxed"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-px" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-3.5 text-xs text-emerald-400 font-medium mb-5 leading-relaxed"
            >
              {/* Inline checkmark SVG so we don't need a new import */}
              <svg className="h-4 w-4 shrink-0 mt-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">
            
            {tab === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-3 text-sm focus:border-amber-500/70 focus:outline-none placeholder-zinc-600 transition"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="WhatsApp / Celular"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-3 text-sm focus:border-amber-500/70 focus:outline-none placeholder-zinc-600 transition"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-3 text-sm focus:border-amber-500/70 focus:outline-none placeholder-zinc-600 transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "Contraseña (mín. 6 caracteres)" : "Contraseña"}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-3 text-sm focus:border-amber-500/70 focus:outline-none placeholder-zinc-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-400 active:scale-[0.98] disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  {/* Inline SVG spinner */}
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"
              )}
            </button>

            {tab === "login" && (
              <p className="text-center text-xs text-zinc-600 pt-1">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("signup"); setErrorMsg(""); setSuccessMsg("") }}
                  className="text-amber-500 hover:text-amber-400 font-semibold transition"
                >
                  Regístrate gratis
                </button>
              </p>
            )}
          </form>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-700">
        BarberBook Platform © {new Date().getFullYear()}. Todos los derechos reservados.
      </footer>

    </div>
  )
}
