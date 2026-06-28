"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Phone } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-zinc-950 py-20 text-white dark:bg-black">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_60%)]" />

      {/* Background decorative grids */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-8 z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-semibold text-amber-500 backdrop-blur-md"
        >
          <span>✂️ Corte clásico • Estilo moderno • Experiencia Premium</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-none"
        >
          Tu estilo en manos de <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            verdaderos profesionales
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg md:text-xl leading-relaxed"
        >
          Vive la experiencia de un ritual de barbería de primer nivel. Cortes precisos, afeitados con navaja libre, toallas calientes y atención al detalle sin esperas molestas.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/b/barberbook-studio/book"
            className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-zinc-950 transition hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5"
          >
            <Calendar className="h-5 w-5 text-amber-600" />
            Reservar Cita Ahora
          </Link>
          <a
            href="https://wa.me/525512345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-8 py-4 text-base font-bold text-white transition hover:border-zinc-700 hover:bg-zinc-900 active:scale-95"
          >
            <Phone className="h-5 w-5 text-emerald-500" />
            Consultar por WhatsApp
          </a>
        </motion.div>

        {/* Floating Card UI Mockups */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 backdrop-blur-md"
        >
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80 aspect-[16/9] md:aspect-[21/9] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center p-6">
              <span className="text-xs uppercase font-semibold text-amber-400 tracking-widest">Ritual y Tradición</span>
              <h2 className="text-xl md:text-3xl font-bold">Reserva en menos de 1 minuto</h2>
              <p className="text-xs md:text-sm text-zinc-400 max-w-md">Olvídate de las llamadas. Elige a tu barbero, servicio, fecha y listo. Recibe confirmación instantánea.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
