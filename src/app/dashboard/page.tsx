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
  title: "Dashboard de Administración - BarberBook SaaS",
  description: "Administra citas, inventario, caja de ventas (POS) y estadísticas financieras en tiempo real."
}

export default async function DashboardPage() {
  // 1. Enforce Authentication and check Roles on the Server
  const supabase = await createServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Note: For zero-config local testing and mock support:
  // If Supabase credentials are not filled, we allow local bypass to show the dashboard.
  // In production, the Next.js middleware blocks access before reaching this page.
  const hasSupabaseEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (hasSupabaseEnv && !session) {
    redirect("/login")
  }

  // 2. Fetch all necessary data collections
  const services = await BarberShopService.getServices()
  const categories = await BarberShopService.getCategories()
  const employees = await BarberShopService.getEmployees()
  const blockedDates = await AppointmentsService.getBlockedDates()
  const appointments = await AppointmentsService.getAppointments()
  const customers = await AppointmentsService.getCustomers()
  const products = await ProductsService.getProducts()
  
  const cashRegisters = await SalesService.getCashRegistersHistory()
  const cashMovements = await SalesService.getCashMovements()
  const sales = await SalesService.getSales()
  const expenses = await SalesService.getExpenses()
  const gallery = await BarberShopService.getGallery()
  const promotions = await BarberShopService.getPromotions()
  const barbershop = await BarberShopService.getBarbershop("barberbook-studio")

  // 3. Retrieve daily metrics and financial analytics
  const metrics = await AnalyticsService.getDailyDashboardMetrics()
  const analytics = await AnalyticsService.getFullAnalytics()

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
    analytics
  }

  return (
    <DashboardLayout initialData={initialData} />
  )
}
