"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "¿Es necesario registrarse para agendar?",
    answer: "No es necesario. Puedes reservar como invitado con solo tu nombre y número de teléfono. Si creas una cuenta, podrás consultar tu historial de cortes, acumular puntos de fidelidad y gestionar tus citas futuras desde tu panel."
  },
  {
    question: "¿Cómo cancelo o reagendo mi cita?",
    answer: "Desde tu panel de cliente o haciendo clic en el enlace del correo de confirmación. Te pedimos hacerlo con al menos 2 horas de anticipación por respeto al tiempo de nuestros barberos."
  },
  {
    question: "¿Qué pasa si llego tarde?",
    answer: "Tenemos una tolerancia máxima de 10 minutos. Pasado ese tiempo, el servicio puede acortarse o reprogramarse para no afectar a los clientes siguientes."
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer: "Efectivo, tarjetas de débito y crédito, transferencias bancarias, y Mercado Pago. También puedes pagar al confirmar tu cita en línea."
  },
  {
    question: "¿Atienden a niños y hacen rituales de barba detallados?",
    answer: "Sí. Contamos con barberos especializados en cortes infantiles, así como rituales clásicos de afeitado con toalla caliente, perfilado al milímetro y mascarillas hidratantes."
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section id="faqs" className="w-full bg-[#0B0B0C] py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 md:px-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
            <span className="h-px w-8 bg-[#D89B2B]" />
            Preguntas Frecuentes
          </p>
          <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] sm:text-5xl">
            Todo lo que<br />necesitas saber.
          </h2>
        </motion.div>

        {/* ── Accordion ──────────────────────────────────────────────── */}
        <div className="space-y-1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#D89B2B]/20 bg-[#17181B]"
                    : "border-white/5 bg-[#17181B]/60 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`pr-6 text-[15px] font-semibold transition-colors ${
                    isOpen ? "text-[#F3EDE2]" : "text-[#A1A1AA]"
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-[#D89B2B]/30 bg-[#D89B2B]/10 text-[#D89B2B]"
                      : "border-white/10 bg-white/5 text-[#A1A1AA]"
                  }`}>
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/5 px-6 pb-6 pt-4 text-[14px] leading-[1.8] text-[#A1A1AA]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
