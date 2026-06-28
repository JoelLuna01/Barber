import * as React from "react"
import Navbar from "@/components/marketing/Navbar"
import Hero from "@/components/marketing/Hero"
import ServicesGrid from "@/components/marketing/ServicesGrid"
import TeamSection from "@/components/marketing/TeamSection"
import GalleryGrid from "@/components/marketing/GalleryGrid"
import ReviewsCarousel from "@/components/marketing/ReviewsCarousel"
import ContactMap from "@/components/marketing/ContactMap"
import FAQSection from "@/components/marketing/FAQSection"
import FloatingWhatsApp from "@/components/marketing/FloatingWhatsApp"
import { BarberShopService } from "@/services/barber-shop.service"

export const metadata = {
  title: "BarberBook Studio - Reserva Online de Barbería Premium",
  description: "Agenda tu corte de cabello, degradado o ritual de barba en segundos. Barbería de primer nivel con reserva online sin registros obligatorios.",
  keywords: ["barberia", "barbero", "reserva cita", "corte cabello", "barba ritual", "ciudad de mexico"],
  openGraph: {
    title: "BarberBook Studio",
    description: "Cortes icónicos y afeitados incomparables. Reserva tu horario favorito online hoy mismo.",
    images: ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80"]
  }
}

export default async function Home() {
  // Fetch landing page content on the server (SSR / ISR ready)
  const services = await BarberShopService.getServices()
  const categories = await BarberShopService.getCategories()
  const employees = await BarberShopService.getEmployees()
  const gallery = await BarberShopService.getGallery()
  const reviews = await BarberShopService.getReviews()
  const shop = await BarberShopService.getBarbershop("barberbook-studio")

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0C] font-sans scroll-smooth">
      {/* Navigation — fixed, sits on top of hero */}
      <Navbar />

      {/* Hero — full screen */}
      <Hero />

      {/* Services */}
      <ServicesGrid services={services} categories={categories} />

      {/* Team */}
      <TeamSection employees={employees} />

      {/* Gallery */}
      <GalleryGrid items={gallery} />

      {/* Reviews */}
      <ReviewsCarousel reviews={reviews} />

      {/* Contact & Map */}
      <ContactMap />

      {/* FAQs */}
      <FAQSection />

      {/* ── Premium Footer ─────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/5 bg-[#0B0B0C]">
        {/* Final CTA banner */}
        <div className="border-b border-white/5 py-16">
          <div className="mx-auto max-w-4xl px-6 md:px-12 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D89B2B] mb-4">Reserva tu ritual</p>
            <h2 className="font-serif text-4xl font-bold text-[#F3EDE2] md:text-5xl">
              Tu mejor versión<br />empieza aquí.
            </h2>
            <p className="mt-4 text-[#A1A1AA] text-base max-w-md mx-auto">
              Sin esperas, sin complicaciones. Elige tu servicio, elige tu hora y preséntate listo.
            </p>
            <a
              href="/b/barberbook-studio/book"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D89B2B] px-8 py-4 text-sm font-bold text-[#0B0B0C] transition-all hover:bg-[#e0a835] active:scale-[0.97] shadow-lg shadow-[#D89B2B]/20"
            >
              Reservar Ahora — Es Gratis
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-lg font-bold text-[#F3EDE2]">
              BARBER<span className="text-[#D89B2B]">BOOK</span>
            </span>
            <span className="text-xs text-[#A1A1AA]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-[13px]">
            <a href="#servicios" className="text-[#A1A1AA] transition hover:text-[#F3EDE2]">Servicios</a>
            <a href="#equipo" className="text-[#A1A1AA] transition hover:text-[#F3EDE2]">El Barbero</a>
            <a href="#ubicacion" className="text-[#A1A1AA] transition hover:text-[#F3EDE2]">Ubicación</a>
            <a href="/login" className="text-[#D89B2B] font-semibold transition hover:text-[#e0a835]">Acceso Admin</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp widget */}
      <FloatingWhatsApp phone={shop.whatsapp || "+525512345678"} shopName={shop.name} />
    </div>
  )
}
