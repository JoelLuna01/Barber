import * as React from "react"
import { BarberShopService } from "@/services/barber-shop.service"
import { AppointmentsService } from "@/services/appointments.service"
import BookingFlow from "@/components/booking/BookingFlow"
import Link from "next/link"
import { Scissors } from "lucide-react"

interface BookingPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params

  // 1. Fetch data on server
  const shop = await BarberShopService.getBarbershop(slug)
  const services = await BarberShopService.getServices()
  const categories = await BarberShopService.getCategories()
  const employees = await BarberShopService.getEmployees()
  const blockedDates = await AppointmentsService.getBlockedDates()
  const appointments = await AppointmentsService.getAppointments()

  return (
    <div className="min-h-screen bg-zinc-50 py-10 dark:bg-black flex flex-col justify-between">
      
      {/* Top Navbar Header */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-white">
            <Scissors className="h-6 w-6 rotate-90 text-amber-500" />
            <span className="font-sans text-xl font-bold tracking-tight">
              BARBER<span className="text-amber-500">BOOK</span>
            </span>
          </Link>
          
          <div className="text-xs font-semibold text-zinc-400">
            Sucursal: <span className="text-zinc-800 dark:text-zinc-200">{shop.name}</span>
          </div>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <main className="flex-1 flex items-center justify-center px-4">
        <BookingFlow
          services={services}
          categories={categories}
          employees={employees}
          blockedDates={blockedDates}
          appointments={appointments}
          shopName={shop.name}
          shopAddress={shop.address || "Dirección de Barbería"}
          shopWhatsapp={shop.whatsapp || "+525512345678"}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {shop.name} • Reservas rápidas y seguras.
      </footer>

    </div>
  )
}
