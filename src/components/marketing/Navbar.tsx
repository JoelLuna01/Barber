"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Scissors, Calendar, Menu, X, LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Servicios", href: "#servicios" },
    { name: "El Barbero", href: "#equipo" },
    { name: "Galería", href: "#galeria" },
    { name: "Opiniones", href: "#opiniones" },
    { name: "Ubicación", href: "#ubicacion" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "border-b border-white/5 bg-[#0B0B0C]/95 backdrop-blur-xl shadow-xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D89B2B]/30 bg-[#D89B2B]/10">
            <Scissors className="h-3.5 w-3.5 rotate-90 text-[#D89B2B] transition-transform duration-500 group-hover:rotate-[270deg]" />
          </div>
          <span className="font-serif text-base font-bold tracking-tight text-[#F3EDE2] sm:text-lg">
            BARBER<span className="text-[#D89B2B]">BOOK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[12px] font-semibold text-[#A1A1AA] transition-colors duration-200 hover:text-[#F3EDE2] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#D89B2B] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] transition hover:border-white/15 hover:text-[#F3EDE2]"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Panel
          </Link>
          <Link
            href="/b/barberbook-studio/book"
            className="rounded-full bg-[#D89B2B] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#0B0B0C] shadow-lg shadow-[#D89B2B]/20 transition-all hover:bg-[#e0a835] active:scale-[0.97]"
          >
            Reservar
          </Link>
        </div>

        {/* Mobile CTAs */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/b/barberbook-studio/book"
            className="flex items-center gap-1.5 rounded-full bg-[#D89B2B] px-3.5 py-2 text-[11px] font-bold text-[#0B0B0C] active:scale-95 transition"
          >
            <Calendar className="h-3.5 w-3.5" />
            Reservar
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-[#F3EDE2] hover:bg-white/10 transition"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5 bg-[#0B0B0C]/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col px-5 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-[#A1A1AA] transition hover:bg-white/5 hover:text-[#F3EDE2]"
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-white/5 my-3" />

              {/* Admin access — visible in mobile menu */}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm font-bold text-[#A1A1AA] transition hover:text-[#F3EDE2]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#D89B2B]" />
                <span>Panel Admin / Barbero</span>
              </Link>

              <Link
                href="/b/barberbook-studio/book"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 flex w-full items-center justify-center rounded-2xl bg-[#D89B2B] py-4 text-sm font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] active:scale-95"
              >
                Reservar Ahora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
