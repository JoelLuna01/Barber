"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Scissors, Calendar } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Servicios", href: "#servicios" },
    { name: "El Barbero", href: "#equipo" },
    { name: "Galería", href: "#galeria" },
    { name: "Opiniones", href: "#opiniones" },
    { name: "Ubicación", href: "#ubicacion" },
    { name: "FAQs", href: "#faqs" }
  ]

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "border-b border-zinc-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-zinc-800/50 dark:bg-black/90" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <Scissors className="h-6 w-6 rotate-90 text-amber-500 transition-transform duration-500 hover:rotate-180" />
          <span className="font-sans text-xl font-bold tracking-tight">
            BARBER<span className="text-amber-500">BOOK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/b/barberbook-studio/book"
            className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 active:scale-95 shadow-lg shadow-zinc-950/10 dark:shadow-white/5"
          >
            Reservar Ahora
          </Link>
        </div>

        {/* Mobile Elements: Booking Button + Burger Menu */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/b/barberbook-studio/book"
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-zinc-950 active:scale-95 shadow-md shadow-amber-500/20"
          >
            <Calendar className="h-3.5 w-3.5" />
            Reservar
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="border-b border-zinc-200 bg-white px-6 py-6 dark:border-zinc-850 dark:bg-zinc-950 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-800 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2 border-zinc-200 dark:border-zinc-905" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/b/barberbook-studio/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-zinc-950 py-3 text-base font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 active:scale-95"
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
