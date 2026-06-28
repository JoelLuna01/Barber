"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { GalleryItem } from "@/types"

interface GalleryGridProps {
  items: GalleryItem[]
}

const FILTERS = ["Todos", "Cortes", "Barba", "Antes/Después"]

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = React.useState("Todos")
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  
  // Before/After slider state
  const [sliderPosition, setSliderPosition] = React.useState(50)
  const sliderRef = React.useRef<HTMLDivElement>(null)

  const filteredItems = filter === "Todos" ? items : items

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : filteredItems.length - 1))
  const nextImage = () => setLightboxIndex(i => (i !== null && i < filteredItems.length - 1 ? i + 1 : 0))

  // Keyboard nav for lightbox
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex])

  // Before/After slider drag handler
  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const position = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.min(95, Math.max(5, position)))
  }

  // Sample before/after pair (first two gallery items)
  const beforeItem = items[0]
  const afterItem = items[1] || items[0]

  return (
    <section id="galeria" className="w-full bg-[#0B0B0C] py-28 lg:py-36 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
            <span className="h-px w-8 bg-[#D89B2B]" />
            Galería de Trabajos
          </p>
          <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] sm:text-5xl">
            Nuestros resultados.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-[#A1A1AA]">
            La precisión no es un accidente, es el resultado de la dedicación constante.
          </p>
        </motion.div>

        {/* ── Before / After Slider ───────────────────────────────────── */}
        {beforeItem && afterItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 mx-auto max-w-2xl"
          >
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#A1A1AA] mb-4">
              ← Arrastra para ver la transformación →
            </p>
            <div
              ref={sliderRef}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 cursor-col-resize select-none shadow-2xl"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              {/* After image (bottom layer) */}
              <Image
                src={afterItem.image_url}
                alt="Después"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              {/* Before image (clipped top layer) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <Image
                  src={beforeItem.image_url}
                  alt="Antes"
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] backdrop-blur-sm">
                Antes
              </div>
              <div className="absolute top-4 right-4 rounded-full bg-[#D89B2B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0B0B0C]">
                Después
              </div>

              {/* Slider handle bar */}
              <div
                className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
              >
                <div className="h-full w-[1.5px] bg-[#D89B2B]/85" />
                <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-[#D89B2B] text-[#0B0B0C] shadow-2xl">
                  <div className="flex gap-0.5">
                    <ChevronLeft className="h-3 w-3" />
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Filter pills ────────────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-wider transition ${
                filter === f
                  ? "bg-[#D89B2B] text-[#0B0B0C]"
                  : "border border-white/10 text-[#A1A1AA] hover:border-white/20 hover:text-[#F3EDE2]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Gallery Grid ────────────────────────────────────────────── */}
        <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (index % 8) * 0.05 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/5 bg-[#17181B] focus:outline-none"
            >
              <Image
                src={item.image_url}
                alt={item.caption || "Trabajo BarberBook"}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                  <ZoomIn className="h-4.5 w-4.5 text-[#F3EDE2]" />
                </div>
              </div>
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-[11px] font-bold text-[#F3EDE2] truncate uppercase tracking-widest">{item.caption}</p>
                </div>
              )}
            </motion.button>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-16 text-center text-[#A1A1AA]/50">
              <Images className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay imágenes en la galería por el momento.</p>
            </div>
          )}
        </div>

      </div>

      {/* ── Lightbox Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="relative max-h-[80vh] max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5">
                <Image
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].caption || ""}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              {filteredItems[lightboxIndex].caption && (
                <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
                  {filteredItems[lightboxIndex].caption}
                </p>
              )}

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#F3EDE2] border border-white/10 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute -left-16 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Counter */}
              <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]/50">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
