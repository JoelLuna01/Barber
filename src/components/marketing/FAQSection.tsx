"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "¿Es necesario registrarse para agendar una cita?",
    answer: "No, en absoluto. Puedes agendar como invitado ingresando únicamente tu nombre y teléfono. Sin embargo, al finalizar tu reserva te daremos la opción de crear una contraseña por si deseas guardar tu historial de cortes, acumular puntos de fidelidad y ver tus próximas citas en un panel exclusivo."
  },
  {
    question: "¿Cómo puedo cancelar o reagendar mi cita?",
    answer: "Puedes hacerlo directamente desde tu panel de cliente si te registraste, o bien, haciendo clic en el enlace que te llegará en tu correo de confirmación. Te pedimos realizar cualquier modificación con al menos 2 horas de anticipación por respeto al tiempo de nuestros barberos."
  },
  {
    question: "¿Qué pasa si llego tarde a mi cita?",
    answer: "Tenemos una tolerancia máxima de 10 minutos. Transcurrido ese tiempo, es posible que debamos acortar tu servicio o reprogramarlo para no afectar a los clientes que agendaron en los horarios siguientes."
  },
  {
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos pagos en efectivo, tarjetas de débito/crédito, transferencias bancarias y pagos en línea mediante Mercado Pago y Stripe directamente en nuestro mostrador o al confirmar tu cita."
  },
  {
    question: "¿Ofrecen servicios para niños y corte de barba detallado?",
    answer: "Sí, contamos con barberos especializados en cortes infantiles pacientes y dinámicos, así como rituales clásicos de afeitado con toalla caliente, perfilados al milímetro y mascarillas hidratantes para la piel de la cara."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section id="faqs" className="w-full bg-zinc-50 py-24 dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Todo lo que necesitas saber sobre nuestro sistema de reservas y servicios en BarberBook Studio.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-950"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-zinc-900 dark:text-white focus:outline-none"
                >
                  <span className="pr-4 text-base md:text-lg">{faq.question}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-zinc-100 px-6 py-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
