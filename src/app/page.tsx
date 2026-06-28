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
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans scroll-smooth">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <ServicesGrid services={services} categories={categories} />

      {/* Team Section */}
      <TeamSection employees={employees} />

      {/* Gallery Section */}
      <GalleryGrid items={gallery} />

      {/* Reviews Section */}
      <ReviewsCarousel reviews={reviews} />

      {/* Contact & Map Section */}
      <ContactMap />

      {/* FAQs Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="w-full bg-zinc-950 text-zinc-500 py-12 border-t border-zinc-900/60 dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">BARBER<span className="text-amber-500">BOOK</span></span>
            <span className="text-xs text-zinc-600">| © {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#servicios" className="hover:text-white transition">Servicios</a>
            <a href="#equipo" className="hover:text-white transition">Equipo</a>
            <a href="#ubicacion" className="hover:text-white transition">Ubicación</a>
            <a href="/login" className="hover:text-white transition font-medium text-amber-500">Acceso Barberos</a>
          </div>
        </div>
      </footer>

      {/* Persistent Floating WhatsApp widget */}
      <FloatingWhatsApp phone={shop.whatsapp || "+525512345678"} shopName={shop.name} />
    </div>
  )
}
