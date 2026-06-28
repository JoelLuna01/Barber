"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scissors, Calendar, Menu, X } from "lucide-react"
import { AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
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
          ? "border-b border-white/5 bg-[#0B0B0C]/90 backdrop-blur-xl shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D89B2B]/30 bg-[#D89B2B]/10">
            <Scissors className="h-4 w-4 rotate-90 text-[#D89B2B] transition-transform duration-500 group-hover:rotate-[270deg]" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-[#F3EDE2]">
            BARBER<span className="text-[#D89B2B]">BOOK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[13px] font-semibold text-[#A1A1AA] transition-colors duration-200 hover:text-[#F3EDE2] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#D89B2B] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-[#A1A1AA] transition hover:text-[#F3EDE2]"
          >
            Acceso
          </Link>
          <Link
            href="/b/barberbook-studio/book"
            className="rounded-full bg-[#D89B2B] px-5 py-2.5 text-[13px] font-bold text-[#0B0B0C] transition-all duration-200 hover:bg-[#e0a835] active:scale-[0.97] shadow-lg shadow-[#D89B2B]/20"
          >
            Reservar Ahora
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/b/barberbook-studio/book"
            className="flex items-center gap-1.5 rounded-full bg-[#D89B2B] px-4 py-2 text-[12px] font-bold text-[#0B0B0C] active:scale-95"
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
            transition={{ duration: 0.22 }}
            className="border-t border-white/5 bg-[#0B0B0C]/95 backdrop-blur-xl px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#A1A1AA] transition hover:text-[#F3EDE2]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-1" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-[#A1A1AA] transition hover:text-[#F3EDE2]"
              >
                Acceso Barberos
              </Link>
              <Link
                href="/b/barberbook-studio/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-2xl bg-[#D89B2B] py-3.5 text-base font-bold text-[#0B0B0C] transition hover:bg-[#e0a835] active:scale-95"
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
