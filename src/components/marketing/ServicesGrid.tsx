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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
              <span className="h-px w-8 bg-[#D89B2B]" />
              Menú de Servicios
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-[#F3EDE2] sm:text-5xl">
              Corte y Cuidado
              <br />
              de nivel superior.
            </h2>
          </div>
          <Link
            href="/b/barberbook-studio/book"
            className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F3EDE2] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B] active:scale-95"
          >
            Ver todos los rituales
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* ── Category Pills ──────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[{ id: "all", name: "Todos" }, ...serviceCategories].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-[#D89B2B] text-[#0B0B0C] shadow-lg shadow-[#D89B2B]/20"
                  : "border border-white/5 bg-[#15171A] text-[#A1A1AA] hover:border-white/20 hover:text-[#F3EDE2]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Services Grid ───────────────────────────────────────────── */}
        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#15171A] transition-all duration-300 hover:border-[#D89B2B]/20 hover:bg-[#1B1D21] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#D89B2B]/5"
              >
                {/* Image panel */}
                <div className="relative h-60 w-full overflow-hidden bg-[#1E2024]">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-15 bg-[#15171A]">✂</div>
                  )}
                  {/* Subtle vignette overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15171A] via-transparent to-transparent group-hover:from-[#1B1D21] transition-colors duration-300" />

                  {/* Featured badge */}
                  {service.is_featured && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-[#D89B2B] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0B0B0C] shadow-lg shadow-black/30">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Recomendado
                    </div>
                  )}

                  {/* Duration pill */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 backdrop-blur-md border border-white/10">
                    <Clock className="h-3 w-3 text-[#A1A1AA]" />
                    <span className="text-[10px] font-bold tracking-wider text-[#F3EDE2]">{service.duration_minutes} min</span>
                  </div>
                </div>

                {/* Body panel */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#D89B2B]">
                    {serviceCategories.find(c => c.id === service.category_id)?.name || "Barbería de Autor"}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[#F3EDE2] transition-colors group-hover:text-[#D89B2B]">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#A1A1AA] line-clamp-3">
                    {service.description}
                  </p>

                  {/* Price + CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">Inversión</span>
                      <div className="text-2xl font-bold font-serif text-[#F3EDE2] mt-0.5">
                        ${Number(service.price).toFixed(0)}<span className="text-[11px] font-sans font-semibold text-[#A1A1AA] ml-1">MXN</span>
                      </div>
                    </div>
                    <Link
                      href={`/b/barberbook-studio/book?service=${service.id}`}
                      className="group/btn flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4.5 py-2.5 text-xs font-bold text-[#F3EDE2] tracking-wider transition-all hover:bg-[#D89B2B] hover:text-[#0B0B0C] hover:border-[#D89B2B] active:scale-95"
                    >
                      Reservar
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Mobile View All CTA */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/b/barberbook-studio/book"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#F3EDE2] transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B]"
          >
            Ver todos los rituales
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
