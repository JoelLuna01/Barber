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
          // Mock login bypass for testing
          if (email === "admin@barberbook.com" || email === "barbero@barberbook.com") {
            setSuccessMsg("¡Sesión iniciada (Modo Sandbox)!")
            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          } else {
            // Register a dummy client for testing
            setSuccessMsg("¡Sesión iniciada como cliente (Modo Sandbox)!")
            setTimeout(() => {
              router.push("/")
            }, 1000)
          }
        } else {
          // Real Supabase login
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          
          setSuccessMsg("¡Sesión iniciada con éxito!")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      } else {
        // Sign up flow
        if (isMock) {
          setSuccessMsg("¡Cuenta creada (Modo Sandbox)! Inicia sesión ahora.")
          setTab("login")
        } else {
          // Real Supabase signup
          const { error } = await supabase.auth.signUp({
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
          if (error) throw error

          setSuccessMsg("¡Cuenta creada! Verifica tu correo electrónico para activarla.")
          setTab("login")
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error al procesar tu solicitud.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-white font-sans relative overflow-hidden">
      
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-3">
              <Scissors className="h-6 w-6 rotate-90" />
            </div>
            <h2 className="text-2xl font-black">
              BARBER<span className="text-amber-500">BOOK</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Ingresa para administrar tus citas y el negocio</p>
          </div>

          {/* Sandbox Notice (If env is missing) */}
          {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500/90 leading-relaxed">
              <strong>Modo Sandbox Activado:</strong> Puedes ingresar usando <strong>admin@barberbook.com</strong> para explorar el dashboard de administrador sin base de datos real.
            </div>
          )}

          {/* Form Tabs selectors */}
          <div className="flex border-b border-zinc-800 pb-3 mb-6">
            <button
              onClick={() => { setTab("login"); setErrorMsg(""); }}
              className={`flex-1 text-center pb-2 text-sm font-semibold transition ${
                tab === "login" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setTab("signup"); setErrorMsg(""); }}
              className={`flex-1 text-center pb-2 text-sm font-semibold transition ${
                tab === "signup" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Status Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-950/20 border border-rose-900/30 p-3 text-xs text-rose-400 font-semibold mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/20 border border-emerald-900/30 p-3 text-xs text-emerald-400 font-semibold mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Inputs Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {tab === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="WhatsApp / Celular"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 active:scale-95 disabled:opacity-50 mt-6"
            >
              {loading ? "Procesando..." : tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-600">
        BarberBook Platform. Todos los derechos reservados.
      </footer>

    </div>
  )
}
