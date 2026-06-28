"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowRight, Star } from "lucide-react"
import { Service, Category } from "@/types"

interface ServicesGridProps {
  services: Service[]
  categories: Category[]
}

export default function ServicesGrid({ services, categories }: ServicesGridProps) {
  const serviceCategories = categories.filter(c => c.type === "service")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.category_id === selectedCategory)

  return (
    <section id="servicios" className="w-full bg-[#0B0B0C] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Section Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
              <span className="h-px w-8 bg-[#D89B2B]" />
              Nuestros Servicios
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-[#F3EDE2] sm:text-5xl">
              Rituales diseñados
              <br />
              para el caballero moderno.
            </h2>
          </div>
          <Link
            href="/b/barberbook-studio/book"
            className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-[#F3EDE2] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B] active:scale-95"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* ── Category Pills ──────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap gap-2">
          {[{ id: "all", name: "Todos" }, ...serviceCategories].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-[#D89B2B] text-[#0B0B0C] shadow-lg shadow-[#D89B2B]/20"
                  : "border border-white/10 text-[#A1A1AA] hover:border-white/20 hover:text-[#F3EDE2]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Services Grid ───────────────────────────────────────────── */}
        <motion.div layout className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#17181B] transition-all duration-300 hover:border-[#D89B2B]/20 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-[#1E2024]">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">✂</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17181B] via-transparent to-transparent" />

                  {/* Featured badge */}
                  {service.is_featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#D89B2B] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#0B0B0C]">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Destacado
                    </div>
                  )}

                  {/* Duration pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-[#A1A1AA]" />
                    <span className="text-[10px] font-bold text-[#A1A1AA]">{service.duration_minutes} min</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#D89B2B]">
                    {serviceCategories.find(c => c.id === service.category_id)?.name || "Barbería"}
                  </p>
                  <h3 className="mt-1.5 text-base font-bold text-[#F3EDE2] transition-colors group-hover:text-[#D89B2B]">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#A1A1AA] line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price + CTA */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Desde</span>
                      <div className="text-xl font-bold text-[#F3EDE2]">
                        ${Number(service.price).toFixed(0)}<span className="text-sm font-normal text-[#A1A1AA]"> MXN</span>
                      </div>
                    </div>
                    <Link
                      href={`/b/barberbook-studio/book?service=${service.id}`}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-[#F3EDE2] transition-all hover:bg-[#D89B2B] hover:text-[#0B0B0C] hover:border-[#D89B2B] active:scale-95"
                    >
                      Reservar
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/b/barberbook-studio/book"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-bold text-[#F3EDE2] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B]"
          >
            Reservar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
