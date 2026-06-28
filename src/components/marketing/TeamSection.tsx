"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Calendar, MessageCircle, CheckCircle } from "lucide-react"
import { Employee } from "@/types"

interface TeamSectionProps {
  employees: Employee[]
}

const stats = [
  { label: "Años de\nexperiencia", key: "exp" as const },
  { label: "Clientes\natendidos", key: "clients" as const },
  { label: "Calificación\npromedio", key: "rating" as const },
]

export default function TeamSection({ employees }: TeamSectionProps) {
  const barber = employees.find(e => e.is_active) || employees[0]
  if (!barber) return null

  const statValues = {
    exp: `${barber.experience_years}+`,
    clients: "500+",
    rating: `${Number(barber.rating_avg).toFixed(1)}`,
  }

  return (
    <section id="equipo" className="w-full bg-[#111111] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Eyebrow label ───────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]"
        >
          <span className="h-px w-8 bg-[#D89B2B]" />
          Tu Maestro Barbero
        </motion.p>

        {/* ── Editorial split layout ──────────────────────────────────── */}
        <div className="grid gap-0 overflow-hidden rounded-3xl border border-white/5 lg:grid-cols-5">

          {/* Photo panel — takes 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] overflow-hidden bg-[#17181B] lg:col-span-2"
          >
            <Image
              src={barber.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}
              alt={barber.name}
              fill
              className="object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            {/* Gradient fade to content panel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#17181B] via-[#17181B]/20 to-transparent" />
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent to-[#17181B]" />

            {/* Rating chip */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
              <Star className="h-3.5 w-3.5 fill-[#D89B2B] text-[#D89B2B]" />
              <span className="text-sm font-bold text-[#F3EDE2]">{Number(barber.rating_avg).toFixed(1)}</span>
            </div>

            {/* Mobile name */}
            <div className="absolute bottom-5 left-5 lg:hidden">
              <h3 className="text-2xl font-bold text-[#F3EDE2]">{barber.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-[#D89B2B] mt-0.5">Maestro Barbero</p>
            </div>
          </motion.div>

          {/* Content panel — takes 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center bg-[#17181B] p-8 lg:col-span-3 lg:p-14"
          >
            {/* Desktop name */}
            <div className="hidden lg:block">
              <h3 className="font-serif text-4xl font-bold text-[#F3EDE2]">{barber.name}</h3>
              <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#D89B2B]">
                Maestro Barbero · {barber.experience_years} años de experiencia
              </p>
            </div>

            <p className="mt-6 text-[15px] leading-[1.75] text-[#A1A1AA] max-w-lg">
              {barber.bio || "Apasionado del arte de la barbería tradicional con más de una década perfeccionando técnicas clásicas y modernas. Cada corte es una obra de precisión, cada cliente una historia única."}
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map(stat => (
                <div key={stat.key} className="border-l-2 border-[#D89B2B]/20 pl-4">
                  <div className="text-3xl font-bold text-[#F3EDE2]">{statValues[stat.key]}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] leading-tight whitespace-pre-line">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Specialties */}
            {barber.specialties?.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A1A1AA]">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.map(spec => (
                    <span
                      key={spec}
                      className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[12px] font-semibold text-[#F3EDE2]"
                    >
                      <CheckCircle className="h-3 w-3 text-[#D89B2B]" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-8 sm:flex-row">
              <Link
                href={`/b/barberbook-studio/book?barber=${barber.id}`}
                className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-[#D89B2B] py-3.5 text-sm font-bold text-[#0B0B0C] transition-all hover:bg-[#e0a835] active:scale-[0.97]"
              >
                <Calendar className="h-4 w-4" />
                Reservar con {barber.name.split(" ")[0]}
              </Link>

              <div className="flex gap-2">
                {barber.social_instagram && (
                  <a
                    href={barber.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-[#A1A1AA] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B]"
                    aria-label="Instagram"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                )}
                <a
                  href={`https://wa.me/525512345678?text=${encodeURIComponent(`Hola, quiero agendar con ${barber.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-600/10 text-emerald-400 transition hover:bg-emerald-600/20 active:scale-95"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
