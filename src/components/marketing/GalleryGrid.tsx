"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { GalleryItem } from "@/types"

interface GalleryGridProps {
  items: GalleryItem[]
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <section id="galeria" className="w-full bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Nuestros Cortes y Trabajos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Una muestra de nuestro arte y precisión. Inspiración para tu próximo cambio de estilo.
          </p>
        </div>

        {/* Gallery Image Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 shadow-sm"
            >
              <Image
                src={item.image_url}
                alt={item.caption || "Corte de cabello BarberBook"}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
              />

              {/* Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end">
                <p className="text-xs uppercase font-semibold text-amber-400 tracking-wider">Corte Realizado</p>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {item.caption || "Estilo personalizado BarberBook"}
                </p>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No hay imágenes en la galería por el momento.
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
