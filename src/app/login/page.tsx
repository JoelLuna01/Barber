"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Scissors, Mail, Lock, User, Phone, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

type Role = "admin" | "barber" | "client"

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err || "")
}

function getRoleDestination(role: Role): string {
  if (role === "admin" || role === "barber") return "/dashboard"
  return "/"
}

function getRoleLabel(role: Role): string {
  if (role === "admin") return "Administrador"
  if (role === "barber") return "Barbero"
  return "Cliente"
}

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
  const [detectedRole, setDetectedRole] = React.useState<Role | null>(null)

  const isSandbox = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setDetectedRole(null)
    setLoading(true)

    try {
      if (isSandbox) {
        // ── SANDBOX MODE (no Supabase configured) ─────────────────────────
        if (tab === "login") {
          let role: Role = "client"
          if (email.includes("admin")) role = "admin"
          else if (email.includes("barber") || email.includes("barbero")) role = "barber"

          setDetectedRole(role)
          setSuccessMsg(`¡Sesión iniciada como ${getRoleLabel(role)} (Sandbox)!`)
          setTimeout(() => router.push(getRoleDestination(role)), 1200)
        } else {
          setSuccessMsg("¡Cuenta creada en modo Sandbox! Ahora inicia sesión.")
          setTab("login")
        }
        return
      }

      const supabase = createClient()

      if (tab === "login") {
        // ── 1. Authenticate ───────────────────────────────────────────────
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError

        const userId = signInData.user?.id
        if (!userId) throw new Error("No se pudo identificar al usuario.")

        // ── 2. Fetch role from profiles table ─────────────────────────────
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", userId)
          .single()

        if (profileError || !profile) {
          // Profile might not exist yet (edge case: trigger didn't fire)
          // Create it as client and redirect home
          await supabase.from("profiles").upsert({
            id: userId,
            email,
            full_name: email.split("@")[0],
            role: "client",
            barbershop_id: null,
          }, { onConflict: "id" })

          setDetectedRole("client")
          setSuccessMsg("¡Sesión iniciada! Bienvenido.")
          setTimeout(() => router.push("/"), 1200)
          return
        }

        const role = profile.role as Role

        // ── 3. Redirect based on role ──────────────────────────────────────
        setDetectedRole(role)
        setSuccessMsg(`¡Bienvenido, ${profile.full_name || getRoleLabel(role)}! Redirigiendo...`)

        setTimeout(() => {
          router.push(getRoleDestination(role))
          router.refresh() // Force Next.js to re-evaluate server state
        }, 900)

      } else {
        // ── SIGN-UP FLOW ───────────────────────────────────────────────────
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              role: "client",
            },
          },
        })
        if (signUpError) throw signUpError

        // Safety fallback: create profile row in case trigger is delayed
        const userId = signUpData.user?.id
        if (userId) {
          await supabase.from("profiles").upsert(
            {
              id: userId,
              email,
              full_name: fullName || email.split("@")[0],
              role: "client",
              barbershop_id: null,
            },
            { onConflict: "id", ignoreDuplicates: true }
          )
        }

        setSuccessMsg(
          signUpData.session
            ? "¡Cuenta creada! Iniciando sesión..."
            : "¡Cuenta creada! Verifica tu correo electrónico y luego inicia sesión."
        )

        if (signUpData.session) {
          // Email confirmation is disabled — session already active
          setTimeout(() => router.push("/"), 1500)
        } else {
          setTab("login")
        }
      }
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.includes("Invalid login credentials")) {
        setErrorMsg("Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.")
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

  const roleColors: Record<Role, string> = {
    admin: "text-[#D89B2B]",
    barber: "text-emerald-400",
    client: "text-blue-400",
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0B0C] text-[#F3EDE2] font-sans relative overflow-hidden">

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(216,155,43,0.10),transparent_70%)]" />
      {/* Subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#F3EDE2] transition text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-3xl border border-white/5 bg-[#15171A] p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D89B2B]/10 ring-1 ring-[#D89B2B]/20 text-[#D89B2B] mb-4">
              <Scissors className="h-7 w-7 rotate-90" />
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight">
              BARBER<span className="text-[#D89B2B]">BOOK</span>
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed max-w-xs">
              {tab === "login"
                ? "Inicia sesión para gestionar tu barbería o consultar tus citas"
                : "Crea tu cuenta gratuita para reservar citas en línea"}
            </p>
          </div>

          {/* Sandbox Notice */}
          {isSandbox && (
            <div className="mb-6 rounded-2xl border border-[#D89B2B]/20 bg-[#D89B2B]/5 p-4 text-xs text-[#D89B2B]/90 leading-relaxed">
              <strong className="text-[#D89B2B]">Modo Sandbox activo.</strong> Usa:
              <ul className="mt-2 space-y-0.5 ml-3">
                <li><code className="font-mono">admin@barberbook.com</code> → Panel de Admin</li>
                <li><code className="font-mono">barbero@barberbook.com</code> → Panel de Barbero</li>
                <li>Cualquier otro correo → Perfil de Cliente</li>
              </ul>
              <p className="mt-1.5 text-[#A1A1AA]">(Cualquier contraseña funciona en Sandbox)</p>
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex border-b border-white/5 mb-6">
            {[
              { id: "login", label: "Iniciar Sesión" },
              { id: "signup", label: "Crear Cuenta" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id as "login" | "signup")
                  setErrorMsg("")
                  setSuccessMsg("")
                  setDetectedRole(null)
                }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                  tab === t.id
                    ? "text-[#D89B2B] border-[#D89B2B]"
                    : "text-[#A1A1AA] border-transparent hover:text-[#F3EDE2]"
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
              className="flex items-start gap-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30 p-3.5 text-xs text-rose-400 font-medium mb-5 leading-relaxed"
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
              className="flex items-start gap-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 p-3.5 text-xs text-emerald-400 font-medium mb-5 leading-relaxed"
            >
              <CheckCircle className="h-4 w-4 shrink-0 mt-px" />
              <div>
                <span>{successMsg}</span>
                {detectedRole && (
                  <span className={`ml-1.5 font-bold ${roleColors[detectedRole]}`}>
                    ({getRoleLabel(detectedRole)})
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">

            {tab === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] pl-10 pr-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B]/60 focus:outline-none transition"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp / Celular (opcional)"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] pl-10 pr-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B]/60 focus:outline-none transition"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-xl border border-white/5 bg-[#1B1D21] pl-10 pr-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B]/60 focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
              <input
                type="password"
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "Contraseña (mín. 6 caracteres)" : "Contraseña"}
                className="w-full rounded-xl border border-white/5 bg-[#1B1D21] pl-10 pr-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B]/60 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D89B2B] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] active:scale-[0.98] disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                tab === "login" ? "Iniciar Sesión" : "Crear Cuenta Gratis"
              )}
            </button>

            {tab === "login" && (
              <p className="text-center text-xs text-[#A1A1AA] pt-1">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup")
                    setErrorMsg("")
                    setSuccessMsg("")
                  }}
                  className="text-[#D89B2B] hover:text-[#e0a835] font-bold transition"
                >
                  Regístrate gratis
                </button>
              </p>
            )}
          </form>

          {/* Role legend */}
          <div className="mt-8 border-t border-white/5 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-3 text-center">Niveles de Acceso</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { role: "admin", label: "Admin", color: "text-[#D89B2B]", bg: "bg-[#D89B2B]/10 border-[#D89B2B]/20", desc: "Gestión total" },
                { role: "barber", label: "Barbero", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", desc: "Su agenda" },
                { role: "client", label: "Cliente", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", desc: "Sus citas" },
              ].map((r) => (
                <div key={r.role} className={`rounded-xl border ${r.bg} px-2 py-2.5`}>
                  <div className={`text-xs font-bold ${r.color}`}>{r.label}</div>
                  <div className="text-[9px] text-[#A1A1AA] mt-0.5">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]/40">
        BarberBook Platform © {new Date().getFullYear()}
      </footer>

    </div>
  )
}
