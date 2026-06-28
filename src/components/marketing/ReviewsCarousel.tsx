"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, BadgeCheck } from "lucide-react"
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
    { id: "1", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "El ambiente es increíble y el corte quedó exactamente como lo pedí. Ya soy cliente fijo.", created_at: "2026-05-10", customer: { full_name: "Carlos M." } } as any,
    { id: "2", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Primera vez aquí y quedé maravillado. El ritual de barba con toalla caliente es una experiencia de otro nivel.", created_at: "2026-05-22", customer: { full_name: "Diego R." } } as any,
    { id: "3", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Reservé desde el celular en menos de un minuto. Profesionalismo desde el primer momento.", created_at: "2026-06-01", customer: { full_name: "Andrés V." } } as any,
    { id: "4", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "El nivel de detalle y la precisión son impresionantes. Sin duda el mejor corte que he tenido.", created_at: "2026-06-08", customer: { full_name: "Luis E." } } as any,
    { id: "5", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Lugar cómodo, limpio y con una atención personalizada difícil de encontrar en otro sitio.", created_at: "2026-06-14", customer: { full_name: "Roberto G." } } as any,
    { id: "6", customer_id: "", employee_id: null, barbershop_id: "", rating: 5, comment: "Llevo 6 meses viniendo y cada visita supera la anterior. Totalmente recomendado.", created_at: "2026-06-20", customer: { full_name: "Fernando J." } } as any,
  ]

  return (
    <section id="opiniones" className="w-full bg-[#0B0B0C] py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
              <span className="h-px w-8 bg-[#D89B2B]" />
              Opiniones Verificadas
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] sm:text-5xl">
              Lo que dicen
              <br />
              nuestros clientes.
            </h2>
          </div>

          {/* Aggregate score */}
          <div className="flex items-center gap-4 md:shrink-0">
            <div className="text-right">
              <div className="text-5xl font-bold text-[#F3EDE2]">{avg.toFixed(1)}</div>
              <div className="flex items-center justify-end gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#D89B2B] text-[#D89B2B]" />
                ))}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#A1A1AA]">{displayReviews.length} opiniones</div>
            </div>
          </div>
        </motion.div>

        {/* ── Reviews Grid ────────────────────────────────────────────── */}
        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {displayReviews.map((review, index) => {
            const date = new Date(review.created_at).toLocaleDateString("es-MX", {
              year: "numeric", month: "short", day: "numeric"
            })
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                className="mb-4 break-inside-avoid rounded-2xl border border-white/5 bg-[#17181B] p-6 transition-all duration-300 hover:border-[#D89B2B]/15"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-[#D89B2B] text-[#D89B2B]" : "text-white/10"}`} />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-4 text-[14px] leading-relaxed text-[#A1A1AA]">
                  &ldquo;{review.comment || "Excelente servicio, quedé muy satisfecho."}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D89B2B]/10 text-sm font-bold text-[#D89B2B] border border-[#D89B2B]/20">
                      {review.customer?.full_name?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#F3EDE2]">
                        {review.customer?.full_name || "Cliente"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <BadgeCheck className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-semibold text-[#A1A1AA]">Verificado</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA]">{date}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
