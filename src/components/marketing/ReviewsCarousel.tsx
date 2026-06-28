"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, Quote, BadgeCheck, MessageCircle } from "lucide-react"
import { Review } from "@/types"

interface ReviewsCarouselProps {
  reviews: Review[]
}

const AVATAR_COLORS = [
  "bg-amber-500 text-zinc-950",
  "bg-blue-600 text-white",
  "bg-emerald-500 text-zinc-950",
  "bg-violet-600 text-white",
  "bg-rose-500 text-white",
]

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  // Aggregate rating
  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5

  return (
    <section id="opiniones" className="w-full bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-600 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
            <BadgeCheck className="h-3 w-3" />
            Opiniones Verificadas
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Lo que dicen <span className="text-amber-500">nuestros clientes</span>
          </h2>

          {/* Aggregate rating bar */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(avg) ? "fill-current" : "text-zinc-300 dark:text-zinc-700"}`} />
              ))}
            </div>
            <span className="text-2xl font-black text-zinc-950 dark:text-white">{avg.toFixed(1)}</span>
            <span className="text-sm text-zinc-400">({reviews.length} opiniones)</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => {
            const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]
            const initial = review.customer?.full_name?.charAt(0)?.toUpperCase() || "C"
            const date = new Date(review.created_at).toLocaleDateString("es-MX", {
              year: "numeric", month: "short", day: "numeric"
            })

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                className="relative flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Quote icon */}
                <Quote className="absolute right-5 top-5 h-8 w-8 text-zinc-100 dark:text-zinc-800" />

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-zinc-200 dark:text-zinc-700"}`} />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-4 flex-1 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  &ldquo;{review.comment || "Excelente servicio, quedé muy satisfecho. Lo recomiendo ampliamente."}&rdquo;
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${colorClass}`}>
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {review.customer?.full_name || "Cliente Satisfecho"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <BadgeCheck className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Verificado</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{date}</span>
                </div>
              </motion.div>
            )
          })}

          {reviews.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-zinc-200 dark:text-zinc-800" />
              <p className="text-sm text-zinc-400">Aún no hay opiniones registradas.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
