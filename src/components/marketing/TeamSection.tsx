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
  { label: "Años de Exp.", key: "exp" as const },
  { label: "Clientes", key: "clients" as const },
  { label: "Calificación", key: "rating" as const },
]

export default function TeamSection({ employees }: TeamSectionProps) {
  const barber = employees.find(e => e.is_active) || employees[0]
  if (!barber) return null

  const statValues = {
    exp: `${barber.experience_years}+`,
    clients: "500+",
    rating: `${Number(barber.rating_avg).toFixed(1)}/5`,
  }

  return (
    <section id="equipo" className="w-full bg-[#111111] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Section Header ─────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]"
        >
          <span className="h-px w-8 bg-[#D89B2B]" />
          El Barbero
        </motion.p>

        {/* ── Editorial layout split ──────────────────────────────────── */}
        <div className="grid gap-0 overflow-hidden rounded-3xl border border-white/5 lg:grid-cols-12 shadow-2xl">

          {/* Photo panel — 5/12 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[460px] overflow-hidden bg-[#15171A] lg:col-span-5"
          >
            <Image
              src={barber.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}
              alt={barber.name}
              fill
              className="object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            {/* Subtle cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#15171A] via-transparent to-transparent" />
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent to-[#15171A]" />

            {/* Rating floating chip */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
              <Star className="h-3.5 w-3.5 fill-[#D89B2B] text-[#D89B2B]" />
              <span className="text-sm font-bold text-[#F3EDE2]">{Number(barber.rating_avg).toFixed(1)}</span>
            </div>

            {/* Mobile label */}
            <div className="absolute bottom-6 left-6 lg:hidden">
              <h3 className="text-2xl font-bold font-serif text-[#F3EDE2]">{barber.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-[#D89B2B] mt-0.5">Maestro Barbero</p>
            </div>
          </motion.div>

          {/* Bio + Details panel — 7/12 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center bg-[#15171A] p-8 lg:col-span-7 lg:p-14"
          >
            {/* Desktop titles */}
            <div className="hidden lg:block">
              <h3 className="font-serif text-4.5xl font-bold text-[#F3EDE2]">{barber.name}</h3>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
                Maestro Barbero · {barber.experience_years} Años de Experiencia
              </p>
            </div>

            {/* Biography */}
            <p className="mt-6 text-[14.5px] leading-[1.8] text-[#A1A1AA] max-w-xl">
              {barber.bio || "Especializado en técnicas clásicas europeas y cortes modernos de precisión. Entiende cada corte como un proceso personalizado adaptado a las características únicas de cada caballero."}
            </p>

            {/* Stats list */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-white/5 py-8">
              {stats.map(stat => (
                <div key={stat.key} className="text-center sm:text-left">
                  <div className="text-2.5xl font-bold font-serif text-[#F3EDE2]">{statValues[stat.key]}</div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Specialties */}
            {barber.specialties?.length > 0 && (
              <div className="mt-8">
                <p className="mb-3.5 text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">Especialidades de Autor</p>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.map(spec => (
                    <span
                      key={spec}
                      className="flex items-center gap-1.5 rounded-full border border-white/5 bg-[#1B1D21] px-3.5 py-1.5 text-xs font-semibold text-[#F3EDE2] transition-colors hover:border-[#D89B2B]/20"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-[#D89B2B]" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-10 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href={`/b/barberbook-studio/book?barber=${barber.id}`}
                className="group flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#D89B2B] py-4 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition-all hover:bg-[#e0a835] active:scale-[0.97]"
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
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A1A1AA] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B]"
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
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-600/20 bg-emerald-600/5 text-emerald-400 transition hover:bg-emerald-600/10 active:scale-95"
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
