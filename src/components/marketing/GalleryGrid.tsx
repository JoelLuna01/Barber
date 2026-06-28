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
    <section id="galeria" className="w-full bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/40 bg-amber-900/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-400">
            <Images className="h-3 w-3" />
            Galería
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Nuestro trabajo <span className="text-amber-500">habla por sí solo</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-400">
            Cada foto es la prueba de nuestra dedicación. Desliza para ver las transformaciones.
          </p>
        </motion.div>

        {/* Before / After Slider */}
        {beforeItem && afterItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 mx-auto max-w-2xl"
          >
            <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              ← Desliza para ver la transformación →
            </p>
            <div
              ref={sliderRef}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 cursor-col-resize select-none"
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
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
              {/* Labels */}
              <div className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">ANTES</div>
              <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-950">DESPUÉS</div>
              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 flex items-center justify-center"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
              >
                <div className="h-full w-0.5 bg-white/80" />
                <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xl">
                  <div className="flex gap-0.5 text-zinc-950">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                filter === f
                  ? "bg-white text-zinc-950"
                  : "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (index % 8) * 0.05 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900"
            >
              <Image
                src={item.image_url}
                alt={item.caption || "Trabajo BarberBook"}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-semibold text-white truncate">{item.caption}</p>
                </div>
              )}
            </motion.button>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-600">
              <Images className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay imágenes en la galería por el momento.</p>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].caption || ""}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              {filteredItems[lightboxIndex].caption && (
                <p className="mt-3 text-center text-sm text-zinc-400">{filteredItems[lightboxIndex].caption}</p>
              )}
              {/* Controls */}
              <button onClick={closeLightbox} className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-200">
                <X className="h-5 w-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); prevImage() }} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage() }} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black">
                <ChevronRight className="h-6 w-6" />
              </button>
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-zinc-600">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
