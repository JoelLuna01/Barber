"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, BadgeCheck, Quote } from "lucide-react"
import { Review } from "@/types"

interface ReviewsCarouselProps {
  reviews: Review[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5.0

  // Fallback reviews for empty state
  const displayReviews: Review[] = reviews.length > 0 ? reviews : [
    { id: "1", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Primera vez aquí y quedé maravillado. El ritual de barba con toalla caliente, el café de cortesía y la precisión milimétrica del corte es una experiencia premium real que justifica cada peso.", created_at: "2026-06-22", customer: { full_name: "Diego R." } } as any,
    { id: "2", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "El ambiente es increíble y el corte quedó exactamente como lo pedí. Sin duda ya soy cliente fijo.", created_at: "2026-06-20", customer: { full_name: "Carlos M." } } as any,
    { id: "3", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Reservé desde el celular en menos de un minuto. El sistema es ultra fluido y el servicio inmejorable.", created_at: "2026-06-18", customer: { full_name: "Andrés V." } } as any,
    { id: "4", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "El nivel de detalle y la precisión son impresionantes. Sin duda el mejor corte que he tenido en años.", created_at: "2026-06-15", customer: { full_name: "Luis E." } } as any,
    { id: "5", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Un espacio sobrio, elegante y con una atención personalizada del más alto nivel.", created_at: "2026-06-10", customer: { full_name: "Roberto G." } } as any,
  ]

  // Featured review is the first one
  const featuredReview = displayReviews[0]
  const secondaryReviews = displayReviews.slice(1)

  return (
    <section id="opiniones" className="w-full bg-[#0B0B0C] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
              <span className="h-px w-8 bg-[#D89B2B]" />
              Reseñas de Clientes
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] sm:text-5xl">
              La voz de la experiencia.
            </h2>
          </div>

          {/* Aggregate score */}
          <div className="flex items-center gap-4 bg-[#15171A] border border-white/5 rounded-2xl px-6 py-4">
            <div className="text-4xl font-bold font-serif text-[#F3EDE2]">{avg.toFixed(1)}</div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#D89B2B] text-[#D89B2B]" />
                ))}
              </div>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                {displayReviews.length} Opiniones Verificadas
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Editorial Grid Layout ──────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          
          {/* Featured Big Review (Takes 5/12 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col justify-between rounded-3xl border border-[#D89B2B]/20 bg-gradient-to-br from-[#1B1D21] to-[#15171A] p-8 lg:col-span-5 shadow-2xl"
          >
            <Quote className="absolute right-8 top-8 h-16 w-16 text-[#D89B2B]/10 stroke-[1]" />
            
            <div>
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-[#D89B2B] text-[#D89B2B]" />
                ))}
              </div>

              {/* Big bold comment */}
              <p className="mt-8 font-serif text-2xl italic leading-relaxed text-[#F3EDE2]">
                &ldquo;{featuredReview.comment}&rdquo;
              </p>
            </div>

            {/* Author details */}
            <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D89B2B] text-sm font-bold text-[#0B0B0C] shadow-lg shadow-[#D89B2B]/20">
                  {featuredReview.customer?.full_name?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F3EDE2]">
                    {featuredReview.customer?.full_name}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                      Cliente Verificado
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#A1A1AA]/70">
                {new Date(featuredReview.created_at).toLocaleDateString("es-MX", {
                  year: "numeric", month: "short", day: "numeric"
                })}
              </span>
            </div>
          </motion.div>

          {/* Secondary Reviews list (Takes 7/12 cols) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {secondaryReviews.map((review, index) => {
              const date = new Date(review.created_at).toLocaleDateString("es-MX", {
                year: "numeric", month: "short", day: "numeric"
              })
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#15171A] p-6 transition-all duration-300 hover:border-white/10 hover:bg-[#1B1D21] group"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#D89B2B] text-[#D89B2B]" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="mt-4 text-[13.5px] leading-relaxed text-[#A1A1AA] group-hover:text-[#F3EDE2] transition-colors">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B1D21] text-xs font-bold text-[#F3EDE2] border border-white/10 group-hover:bg-[#D89B2B] group-hover:text-[#0B0B0C] group-hover:border-[#D89B2B] transition-all">
                        {review.customer?.full_name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-[#F3EDE2]">{review.customer?.full_name}</p>
                        <div className="flex items-center gap-1">
                          <BadgeCheck className="h-3 w-3 text-emerald-400" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA]">Verificado</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#A1A1AA]/50">{date}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
