"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowRight, Sparkles } from "lucide-react"
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
    <section id="servicios" className="w-full bg-zinc-50 py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-600 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
            <Sparkles className="h-3 w-3" />
            Nuestros Servicios
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            Rituales de barbería <br className="hidden sm:inline" />
            <span className="text-amber-500">a tu medida</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-500 dark:text-zinc-400">
            Cortes precisos, rituales relajantes y paquetes exclusivos diseñados para que salgas sintiéndote increíble.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-zinc-950 text-white shadow-lg dark:bg-white dark:text-zinc-950"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:border-zinc-800"
            }`}
          >
            Todos
          </button>
          {serviceCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-zinc-950 text-white shadow-lg dark:bg-white dark:text-zinc-950"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:border-zinc-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-zinc-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Service Hero Image */}
                <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl">✂️</span>
                    </div>
                  )}
                  {/* Color accent top stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: service.color || "#F59E0B" }}
                  />
                  {/* Featured badge */}
                  {service.is_featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-950">
                      <Sparkles className="h-2.5 w-2.5" />
                      Destacado
                    </div>
                  )}
                  {/* Category label */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur-sm">
                      {serviceCategories.find(c => c.id === service.category_id)?.name || "Barbería"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-black text-zinc-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price & Duration row */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Desde</span>
                      <div className="text-2xl font-black text-zinc-950 dark:text-white">
                        ${Number(service.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-800">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {service.duration_minutes} min
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/b/barberbook-studio/book?service=${service.id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-bold text-white transition-all hover:bg-amber-500 hover:text-zinc-950 dark:bg-zinc-800 dark:hover:bg-amber-500 dark:hover:text-zinc-950 active:scale-95"
                  >
                    Reservar este servicio
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link
            href="/b/barberbook-studio/book"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-wider text-zinc-950 transition hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <ArrowRight className="h-4 w-4" />
            Ver todos los servicios y reservar
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
