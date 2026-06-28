"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ArrowRight, ExternalLink } from "lucide-react"

const hours = [
  { day: "Lunes", hours: "09:00 – 18:00", open: true },
  { day: "Martes", hours: "09:00 – 18:00", open: true },
  { day: "Miércoles", hours: "09:00 – 18:00", open: true },
  { day: "Jueves", hours: "09:00 – 18:00", open: true },
  { day: "Viernes", hours: "09:00 – 18:00", open: true },
  { day: "Sábado", hours: "09:00 – 18:00", open: true },
  { day: "Domingo", hours: "Cerrado", open: false },
]

// Detect today's day
const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const contactItems = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Av. de la Reforma 450, Col. Juárez, CDMX",
    href: "https://maps.google.com/?q=Av.+Paseo+de+la+Reforma+450+CDMX"
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+52 55 1234 5678",
    href: "https://wa.me/525512345678"
  },
  {
    icon: Mail,
    label: "Email",
    value: "contacto@barberbookstudio.com",
    href: "mailto:contacto@barberbookstudio.com"
  },
]

export default function ContactMap() {
  const today = DAYS[new Date().getDay()]

  return (
    <section id="ubicacion" className="w-full bg-[#111111] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B]">
            <span className="h-px w-8 bg-[#D89B2B]" />
            Encuéntranos
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] sm:text-5xl max-w-md">
              Visítanos cuando<br />gustes.
            </h2>
            <Link
              href="/b/barberbook-studio/book"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#D89B2B] px-7 py-3.5 text-sm font-bold text-[#0B0B0C] transition-all hover:bg-[#e0a835] active:scale-[0.97]"
            >
              Reservar Cita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* ── Content grid ───────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">

          {/* Left column: contact + hours */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 lg:col-span-4"
          >
            {/* Contact items */}
            <div className="rounded-2xl border border-white/5 bg-[#17181B] p-6 space-y-5">
              {contactItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D89B2B]/20 bg-[#D89B2B]/10 text-[#D89B2B] transition group-hover:bg-[#D89B2B]/20">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#F3EDE2] group-hover:text-[#D89B2B] transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-white/5 bg-[#17181B] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#D89B2B]" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#F3EDE2]">Horarios</span>
              </div>
              <div className="space-y-2.5">
                {hours.map(h => {
                  const isToday = h.day === today
                  return (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between text-[13px] rounded-lg px-3 py-2 transition ${
                        isToday ? "bg-[#D89B2B]/10 border border-[#D89B2B]/20" : ""
                      }`}
                    >
                      <span className={`font-semibold ${isToday ? "text-[#D89B2B]" : "text-[#A1A1AA]"}`}>
                        {h.day}
                        {isToday && <span className="ml-2 text-[9px] font-bold uppercase tracking-widest">Hoy</span>}
                      </span>
                      <span className={h.open ? "text-[#F3EDE2]" : "text-[#A1A1AA]/50"}>
                        {h.hours}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right column: map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#17181B] lg:col-span-8 min-h-[360px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.668700204759!2d-99.1691232850934!3d19.426725386887556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5ca1207%3A0x6d11f67f6ee6a74c!2sAv.%20Paseo%20de%20la%20Reforma%20450%2C%20Ju%C3%A1rez%2C%20Cuauht%C3%A9moc%2C%2006600%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1680000000000!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-75 opacity-70"
            />
            {/* Open in maps CTA */}
            <a
              href="https://maps.google.com/?q=Av.+Paseo+de+la+Reforma+450+CDMX"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0B0C]/80 px-4 py-2 text-xs font-bold text-[#F3EDE2] backdrop-blur-sm transition hover:border-[#D89B2B]/40 hover:text-[#D89B2B]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir en Google Maps
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
