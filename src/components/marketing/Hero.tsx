"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MessageCircle, Star, ArrowRight, ShieldCheck } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-end overflow-hidden bg-[#0B0B0C]">

      {/* ── Background image with premium filter treatment ────────────── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&q=85')",
          filter: "brightness(0.24) contrast(1.15) saturate(0.7)"
        }}
      />

      {/* ── Vignette overlays for extreme legibility of the copy ─────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/85 to-[#0B0B0C]/30" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
      {/* Editorial warm amber light leak at top-right */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_55%_45%_at_80%_15%,rgba(216,155,43,0.08)_0%,transparent_75%)]" />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-40 md:px-12 lg:pb-32 lg:pt-48">
        <div className="max-w-xl lg:max-w-2xl">

          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D89B2B]"
          >
            <span className="h-px w-8 bg-[#D89B2B]" />
            Experiencia de Autor · Ciudad de México
          </motion.p>

          {/* Main headline — serif editorial */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl font-bold leading-[1.07] tracking-tight text-[#F3EDE2] sm:text-6xl lg:text-7.5xl"
          >
            El arte del
            <br />
            <em className="not-italic text-[#D89B2B]">corte perfecto</em>
            <br />
            hecho ritual.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7 max-w-md text-[14.5px] leading-relaxed text-[#A1A1AA]"
          >
            Cortes de autor a la medida, afeitado tradicional con navaja libre y toalla caliente. Reserva tu espacio al instante.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="mt-10 flex flex-col gap-3.5 sm:flex-row"
          >
            <Link
              href="/b/barberbook-studio/book"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D89B2B] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition-all duration-200 hover:bg-[#e0a835] active:scale-[0.97] shadow-lg shadow-[#D89B2B]/20"
            >
              <Calendar className="h-4 w-4" />
              Reservar Cita
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://wa.me/525512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#F3EDE2] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 active:scale-[0.97]"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              WhatsApp
            </a>
          </motion.div>

          {/* Premium Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/5 pt-8"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["1", "2", "3"].map((id) => (
                  <div
                    key={id}
                    className="h-8 w-8 rounded-full border-2 border-[#0B0B0C] bg-[#15171A] flex items-center justify-center text-[10px] font-bold text-[#F3EDE2]"
                  >
                    {id === "1" ? "A" : id === "2" ? "J" : "M"}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#F3EDE2]">5.0</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#D89B2B] text-[#D89B2B]" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">120+ Reseñas de 5 estrellas</p>
              </div>
            </div>

            <span className="hidden sm:block h-6 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#D89B2B]" />
              <div>
                <p className="text-xs font-bold text-[#F3EDE2]">Garantía de Satisfacción</p>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Servicio o ajuste sin costo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom scroll hint ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-10 right-12 z-10 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A1A1AA] [writing-mode:vertical-lr]">Deslizar</span>
        <div className="h-12 w-px bg-gradient-to-b from-[#A1A1AA]/40 to-transparent" />
      </motion.div>
    </section>
  )
}
