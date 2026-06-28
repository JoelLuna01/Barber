"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MessageCircle, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden bg-black text-white">
      {/* 1. Background image with warm filter and brightness control */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-10000"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80')",
          filter: "brightness(0.35) contrast(1.05)"
        }}
      />

      {/* 2. Warm lighting gradient overlays for elegant depth */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 z-2 h-32 bg-gradient-to-t from-zinc-950 to-transparent dark:from-black" />

      {/* 3. Main content wrapper */}
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:px-8 z-10 flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-amber-400 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Ritual Tradicional & Estilo Premium</span>
        </motion.div>

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex items-center gap-1.5 bg-black/40 border border-zinc-800/80 px-3.5 py-1 rounded-full text-xs text-zinc-300 font-semibold backdrop-blur-sm"
        >
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span>5.0 (120+ opiniones)</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mt-6 font-sans text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1] max-w-3xl"
        >
          Tu estilo en manos de un <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Maestro Barbero
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-sm text-zinc-350 sm:text-base md:text-lg leading-relaxed"
        >
          Experimenta un corte de cabello icónico, toallas calientes y afeitado tradicional con navaja libre. Servicio premium de agendamiento inmediato sin registros.
        </motion.p>

        {/* Primary and Secondary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col w-full max-w-xs sm:max-w-none sm:flex-row justify-center gap-4"
        >
          <Link
            href="/b/barberbook-studio/book"
            className="flex items-center justify-center gap-2.5 rounded-full bg-amber-500 hover:bg-amber-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-zinc-950 transition duration-300 active:scale-95 shadow-xl shadow-amber-500/20"
          >
            <Calendar className="h-4.5 w-4.5" />
            Reservar Cita Ahora
          </Link>
          <a
            href="https://wa.me/525512345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-full border border-zinc-800 bg-black/60 px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:border-zinc-700 hover:bg-zinc-900 active:scale-95 backdrop-blur-sm"
          >
            <MessageCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/10" />
            Escríbenos por WhatsApp
          </a>
        </motion.div>

        {/* Quick details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-widest"
        >
          <div>🕒 1 Minuto para Reservar</div>
          <div>📍 Col. Juárez, CDMX</div>
          <div>✂️ Atendido por Joel Luna</div>
        </motion.div>
      </div>
    </section>
  )
}
