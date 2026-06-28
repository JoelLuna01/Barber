"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, MessageCircle } from "lucide-react"
import { Employee } from "@/types"

interface TeamSectionProps {
  employees: Employee[]
}

export default function TeamSection({ employees }: TeamSectionProps) {
  return (
    <section id="equipo" className="w-full bg-zinc-50 py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Nuestros Barberos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Conoce a nuestro equipo de artesanos del estilo. Profesionales apasionados dedicados a perfeccionar tu imagen.
          </p>
        </div>

        {/* Members Cards Grid */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:max-w-none">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-6 transition hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 md:flex-row md:items-center"
            >
              {/* Profile Image Wrapper */}
              <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl mx-auto md:mx-0">
                <Image
                  src={employee.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                  alt={employee.name}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  sizes="176px"
                />
              </div>

              {/* Bio and metadata */}
              <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {employee.name}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{Number(employee.rating_avg).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
                    {employee.experience_years} años de experiencia
                  </p>

                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {employee.bio}
                  </p>

                  {/* Specialties tag badges */}
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-1.5">
                    {employee.specialties.map(spec => (
                      <span
                        key={spec}
                        className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-center md:justify-between gap-4">
                  {/* Social Handles */}
                  <div className="flex items-center gap-3">
                    {employee.social_instagram && (
                      <a
                        href={employee.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 transition hover:text-zinc-950 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </a>
                    )}
                    <a
                      href={`https://wa.me/525512345678?text=${encodeURIComponent(`Hola, me gustaría agendar una cita específicamente con ${employee.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 transition hover:text-zinc-950 dark:hover:text-white"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>

                  {/* Direct booking CTA */}
                  <Link
                    href={`/b/barberbook-studio/book?barber=${employee.id}`}
                    className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 dark:bg-zinc-800 dark:hover:bg-amber-500 active:scale-95"
                  >
                    Agendar con él
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
