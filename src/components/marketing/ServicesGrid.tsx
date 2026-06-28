"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Tag, ArrowRight } from "lucide-react"
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
    <section id="servicios" className="w-full bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Cortes limpios, rituales relajantes de afeitado y paquetes exclusivos diseñados especialmente para ti.
          </p>
        </div>

        {/* Categories Tabs Filter */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === "all"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            Todos
          </button>
          {serviceCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === cat.id
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid layout */}
        <motion.div 
          layout
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map(service => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {/* Service image / decorative color line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-2" 
                  style={{ backgroundColor: service.color || "#F59E0B" }}
                />

                <div className="mt-4">
                  {/* Category Tag */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                    <Tag className="h-3.5 w-3.5" />
                    {serviceCategories.find(c => c.id === service.category_id)?.name || "Barbería"}
                  </span>
                  
                  {/* Name */}
                  <h3 className="mt-3 text-xl font-bold text-zinc-900 group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Precio</span>
                    <span className="text-2xl font-black text-zinc-950 dark:text-white">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">Duración</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-zinc-800 dark:text-zinc-300">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                </div>

                {/* Hover CTA Link */}
                <Link
                  href={`/b/barberbook-studio/book?service=${service.id}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white transition group-hover:bg-amber-600 dark:bg-zinc-800 dark:group-hover:bg-amber-500 active:scale-95"
                >
                  Agendar Servicio
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
