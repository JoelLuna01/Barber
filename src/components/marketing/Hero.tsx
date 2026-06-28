"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MessageCircle, Star, ArrowRight, ShieldCheck } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-end overflow-hidden bg-[#0B0B0C]">

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&q=85')",
          filter: "brightness(0.22) contrast(1.1) saturate(0.6)"
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/80 to-[#0B0B0C]/20" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 md:px-12 lg:pb-32 lg:pt-48">
        <div className="max-w-lg lg:max-w-2xl">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D89B2B] sm:mb-6 sm:text-[11px]"
          >
            <span className="h-px w-6 bg-[#D89B2B] sm:w-8" />
            Experiencia de Autor · CDMX
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#F3EDE2] sm:text-5xl lg:text-6xl xl:text-7xl"
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
            className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#A1A1AA] sm:mt-7 sm:text-[14.5px] sm:max-w-md"
          >
            Cortes de autor, afeitado con navaja libre y toalla caliente. Reserva al instante, sin filas ni llamadas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row"
          >
            <Link
              href="/b/barberbook-studio/book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#D89B2B] px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#0B0B0C] shadow-lg shadow-[#D89B2B]/20 transition-all hover:bg-[#e0a835] active:scale-[0.97] sm:px-8 sm:py-4 sm:text-xs"
            >
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Reservar Cita
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
            </Link>
            <a
              href="https://wa.me/525512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#F3EDE2] backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
              WhatsApp
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6 sm:mt-12 sm:gap-6 sm:pt-8"
          >
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {["A", "J", "M"].map((init) => (
                  <div
                    key={init}
                    className="h-7 w-7 rounded-full border-2 border-[#0B0B0C] bg-[#15171A] flex items-center justify-center text-[9px] font-bold text-[#F3EDE2] sm:h-8 sm:w-8 sm:text-[10px]"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#F3EDE2] sm:text-sm">5.0</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-[#D89B2B] text-[#D89B2B] sm:h-3 sm:w-3" />
                    ))}
                  </div>
                </div>
                <p className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider sm:text-[10px]">120+ reseñas</p>
              </div>
            </div>

            <span className="hidden h-5 w-px bg-white/10 sm:block" />

            {/* Guarantee */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#D89B2B] shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-[#F3EDE2]">Garantía de Satisfacción</p>
                <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Ajuste sin costo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 right-10 z-10 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A1A1AA] [writing-mode:vertical-lr]">Deslizar</span>
        <div className="h-10 w-px bg-gradient-to-b from-[#A1A1AA]/40 to-transparent" />
      </motion.div>
    </section>
  )
}
