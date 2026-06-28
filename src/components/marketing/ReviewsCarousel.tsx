"use client"

import * as React from "react"
import { Star, Quote } from "lucide-react"
import { Review } from "@/types"

interface ReviewsCarouselProps {
  reviews: Review[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  return (
    <section id="opiniones" className="w-full bg-zinc-950 py-24 text-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Section title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            La Opinión de Nuestros Clientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Nuestros clientes avalan la calidad de nuestro trabajo. Su satisfacción es nuestra prioridad.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md"
            >
              <Quote className="absolute right-8 top-8 h-10 w-10 text-zinc-800/80" />

              <div>
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < review.rating ? "fill-current" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment text */}
                <p className="mt-6 text-base md:text-lg leading-relaxed text-zinc-300 italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Details */}
              <div className="mt-8 flex items-center gap-3 border-t border-zinc-800/60 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 font-bold text-amber-400 text-sm">
                  {review.customer?.full_name?.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {review.customer?.full_name || "Cliente Satisfecho"}
                  </h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Cliente Verificado</p>
                </div>
              </div>

            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No hay opiniones registradas todavía.
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
