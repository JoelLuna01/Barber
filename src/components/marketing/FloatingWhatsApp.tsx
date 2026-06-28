"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"

interface FloatingWhatsAppProps {
  phone: string
  shopName: string
}

export default function FloatingWhatsApp({ phone, shopName }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenChat = () => {
    const message = encodeURIComponent(`Hola ${shopName}, me gustaría agendar una cita o hacer una consulta sobre sus servicios.`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 text-white dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500"></span>
                </span>
                <div>
                  <h4 className="text-sm font-semibold">{shopName}</h4>
                  <p className="text-[10px] text-zinc-300">En línea • Respuesta rápida</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                ¡Hola! 👋 ¿En qué podemos ayudarte hoy? Escríbenos para aclarar dudas, reagendar o preguntar por disponibilidad especial.
              </div>
              <button
                onClick={handleOpenChat}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-95"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.218h.004c5.502 0 9.981-4.478 9.983-9.985a9.957 9.957 0 00-2.925-7.064A9.9 9.9 0 0012.012 2zm5.72 13.917c-.244.69-1.21 1.258-1.666 1.306-.453.048-.902.222-2.909-.575-2.008-.797-3.298-2.845-3.398-2.977-.1-.133-.807-1.077-.807-2.052 0-.974.509-1.452.689-1.636.182-.185.398-.231.531-.231h.378c.121 0 .285-.046.444.34.167.404.57 1.393.62 1.494.05.101.084.22.017.355-.067.135-.1.22-.201.34-.101.12-.211.267-.3.355-.1.1-.205.21-.088.41.117.2 5.2 8.448 5.753.864.06.1.1.22.183.27.083.05.22.017.3-.067.084-.084.57-.69.72-.924.15-.235.3-.2.508-.117.206.084 1.308.614 1.532.723.224.11.373.165.428.261.055.096.055.556-.19 1.246z" />
                </svg>
                Iniciar Chat de WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
