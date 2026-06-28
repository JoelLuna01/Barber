"use client"

import * as React from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactMap() {
  const hours = [
    { day: "Lunes", hours: "09:00 - 18:00" },
    { day: "Martes", hours: "09:00 - 18:00" },
    { day: "Miércoles", hours: "09:00 - 18:00" },
    { day: "Jueves", hours: "09:00 - 18:00" },
    { day: "Viernes", hours: "09:00 - 18:00" },
    { day: "Sábado", hours: "09:00 - 18:00" },
    { day: "Domingo", hours: "Cerrado" }
  ]

  return (
    <section id="ubicacion" className="w-full bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch">
          
          {/* Column 1: Info and Schedules */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                ¿Dónde encontrarnos?
              </h2>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Te esperamos en nuestra sucursal con café de cortesía, cerveza fría y la mejor música para que disfrutes de tu espera o tu servicio.
              </p>

              {/* Details card list */}
              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-zinc-900 dark:text-amber-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Dirección</h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Av. de la Reforma 450, Col. Juárez, Ciudad de México, CP 06600
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-zinc-900 dark:text-amber-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Teléfono / WhatsApp</h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      +52 55 1234 5678
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-zinc-900 dark:text-amber-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Correo electrónico</h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      contacto@barberbookstudio.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours list */}
            <div className="mt-12 rounded-2xl border border-zinc-150 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white mb-4">
                <Clock className="h-4.5 w-4.5 text-amber-500" />
                Horarios de Atención
              </h4>
              <div className="space-y-2">
                {hours.map(h => (
                  <div key={h.day} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{h.day}</span>
                    <span className="text-zinc-600 dark:text-zinc-400">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Map Block */}
          <div className="lg:col-span-7 h-[350px] lg:h-auto rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900">
            {/* Embedded maps mock (uses a high-quality stylized iframe or static placeholder) */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.668700204759!2d-99.1691232850934!3d19.426725386887556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5ca1207%3A0x6d11f67f6ee6a74c!2sAv.%20Paseo%20de%20la%20Reforma%20450%2C%20Ju%C3%A1rez%2C%20Cuauht%C3%A9moc%2C%2006600%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1680000000000!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale dark:invert dark:contrast-90"
            />
          </div>

        </div>

      </div>
    </section>
  )
}
