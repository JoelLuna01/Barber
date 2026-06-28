import * as React from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { BarberShopService } from "@/services/barber-shop.service"
import { AppointmentsService } from "@/services/appointments.service"
import { ProductsService } from "@/services/products.service"
import { SalesService } from "@/services/sales.service"
import { AnalyticsService } from "@/services/analytics.service"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export const metadata = {
  title: "Dashboard de Administración - BarberBook",
  description: "Administra citas, inventario, caja de ventas y estadísticas en tiempo real.",
}

export default async function DashboardPage() {
  const hasSupabaseEnv =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let userRole: "admin" | "barber" | "client" = "admin" // default for sandbox

  if (hasSupabaseEnv) {
    const supabase = await createServerComponentClient()

    // Use getUser() for secure server-side auth validation
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile) {
      // Profile missing — redirect to login to re-authenticate
      redirect("/login")
    }

    const role = profile.role as "admin" | "barber" | "client"

    // Only admin and barber can access /dashboard
    if (role === "client") {
      redirect("/")
    }

    userRole = role
  }

  // Fetch all necessary data for the dashboard
  const [
    services,
    categories,
    employees,
    blockedDates,
    appointments,
    customers,
    products,
    cashRegisters,
    cashMovements,
    sales,
    expenses,
    gallery,
    promotions,
    barbershop,
    metrics,
    analytics,
  ] = await Promise.all([
    BarberShopService.getServices(),
    BarberShopService.getCategories(),
    BarberShopService.getEmployees(),
    AppointmentsService.getBlockedDates(),
    AppointmentsService.getAppointments(),
    AppointmentsService.getCustomers(),
    ProductsService.getProducts(),
    SalesService.getCashRegistersHistory(),
    SalesService.getCashMovements(),
    SalesService.getSales(),
    SalesService.getExpenses(),
    BarberShopService.getGallery(),
    BarberShopService.getPromotions(),
    BarberShopService.getBarbershop("barberbook-studio"),
    AnalyticsService.getDailyDashboardMetrics(),
    AnalyticsService.getFullAnalytics(),
  ])

  const initialData = {
    services,
    categories,
    employees,
    blockedDates,
    appointments,
    customers,
    products,
    cashRegisters,
    cashMovements,
    sales,
    expenses,
    gallery,
    promotions,
    barbershop,
    metrics,
    analytics,
    userRole,
  }

  return <DashboardLayout initialData={initialData} />
}
