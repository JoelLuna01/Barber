"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Award, Calendar, MessageCircle, CheckCircle } from "lucide-react"
import { Employee } from "@/types"

interface TeamSectionProps {
  employees: Employee[]
}

export default function TeamSection({ employees }: TeamSectionProps) {
  const barber = employees.find(e => e.is_active) || employees[0]
  if (!barber) return null

  return (
    <section id="equipo" className="w-full bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-600 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
            <Award className="h-3 w-3" />
            Tu Barbero
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Arte y precisión en <span className="text-amber-500">cada corte</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 grid overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none lg:grid-cols-5"
        >
          {/* Photo Panel */}
          <div className="relative lg:col-span-2 min-h-[380px] bg-zinc-900 overflow-hidden">
            <Image
              src={barber.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}
              alt={barber.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black text-white">{Number(barber.rating_avg).toFixed(1)}</span>
            </div>
            <div className="absolute bottom-4 left-4 lg:hidden">
              <h3 className="text-2xl font-black text-white">{barber.name}</h3>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-0.5">Maestro Barbero</p>
            </div>
          </div>

          {/* Bio Panel */}
          <div className="flex flex-col justify-between p-8 lg:col-span-3 lg:p-10">
            <div className="hidden lg:block">
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{barber.name}</h3>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-amber-500">
                Maestro Barbero • {barber.experience_years} años de experiencia
              </p>
            </div>

            <p className="mt-4 lg:mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {barber.bio || "Apasionado del arte de la barbería tradicional con más de una década perfeccionando técnicas clásicas y modernas. Cada corte es una obra de precisión, cada cliente una historia única."}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Años exp.", value: `${barber.experience_years}+` },
                { label: "Clientes", value: "500+" },
                { label: "Rating", value: `${Number(barber.rating_avg).toFixed(1)}/5` },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl bg-zinc-50 p-3 text-center dark:bg-zinc-800/60">
                  <div className="text-2xl font-black text-zinc-950 dark:text-white">{stat.value}</div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {barber.specialties?.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.map(spec => (
                    <span key={spec} className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                      <CheckCircle className="h-3 w-3" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href={`/b/barberbook-studio/book?barber=${barber.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-zinc-950 active:scale-95 dark:bg-white dark:text-zinc-950"
              >
                <Calendar className="h-4 w-4" />
                Reservar con {barber.name.split(" ")[0]}
              </Link>
              <div className="flex gap-2">
                {barber.social_instagram && (
                  <a href={barber.social_instagram} target="_blank" rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                )}
                <a href={`https://wa.me/525512345678?text=${encodeURIComponent(`Hola, quiero agendar con ${barber.name}.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 active:scale-95">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
