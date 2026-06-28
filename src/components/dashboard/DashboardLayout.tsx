"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Scissors, BarChart3, Calendar, Users, Package,
  Wallet, Settings as SettingsIcon, LogOut, Menu, X, Sun, Moon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import OverviewTab from "./OverviewTab"
import AppointmentsTab from "./AppointmentsTab"
import CustomersTab from "./CustomersTab"
import InventoryTab from "./InventoryTab"
import CajaTab from "./CajaTab"
import SettingsTab from "./SettingsTab"
import { createClient } from "@/lib/supabase"

interface DashboardLayoutProps {
  initialData: {
    services: any[]
    categories: any[]
    employees: any[]
    blockedDates: any[]
    appointments: any[]
    customers: any[]
    products: any[]
    cashRegisters: any[]
    cashMovements: any[]
    sales: any[]
    expenses: any[]
    gallery: any[]
    metrics: any
    analytics: any
  }
}

export default function DashboardLayout({ initialData }: DashboardLayoutProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<string>("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false)
  const [theme, setTheme] = React.useState<"light" | "dark">("dark")

  // Local state copy of data to allow instantaneous refetches / state changes
  const [data, setData] = React.useState(initialData)

  const handleRefreshData = async () => {
    // Perform a router.refresh() to get latest server props
    router.refresh()
  }

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  React.useEffect(() => {
    // Enforce dark mode by default on dashboard
    document.documentElement.classList.add("dark")
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menuItems = [
    { id: "overview", label: "Resumen General", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "appointments", label: "Agenda y Citas", icon: <Calendar className="h-5 w-5" /> },
    { id: "caja", label: "Caja y POS", icon: <Wallet className="h-5 w-5" /> },
    { id: "customers", label: "Clientes (CRM)", icon: <Users className="h-5 w-5" /> },
    { id: "inventory", label: "Inventario", icon: <Package className="h-5 w-5" /> },
    { id: "settings", label: "Configuración", icon: <SettingsIcon className="h-5 w-5" /> }
  ]

  return (
    <div className={`min-h-screen flex bg-zinc-950 text-white font-sans ${theme === "light" ? "bg-zinc-50 text-zinc-900" : ""}`}>
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-900 bg-black py-6 px-4 justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 mb-10">
            <Scissors className="h-6 w-6 rotate-90 text-amber-500" />
            <span className="font-sans text-xl font-bold tracking-tight text-white">
              BARBER<span className="text-amber-500">BOOK</span>
            </span>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const isAct = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                    isAct
                      ? "bg-zinc-900 text-amber-500 shadow-sm border border-zinc-800"
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="space-y-4 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
              AD
            </div>
            <div>
              <h5 className="text-sm font-bold text-white leading-tight">Administrador</h5>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sucursal Juárez</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-950/20 transition"
          >
            <LogOut className="h-4.5 w-4.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. Main Page Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-6 border-b border-zinc-900 bg-black">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 rotate-90 text-amber-500" />
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              BARBER<span className="text-amber-500">BOOK</span>
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-zinc-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex justify-end"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="w-80 h-full bg-zinc-950 border-l border-zinc-900 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-sans text-lg font-bold text-white">Menú Dashboard</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map(item => {
                      const isAct = activeTab === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id)
                            setMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                            isAct ? "bg-zinc-900 text-amber-500" : "text-zinc-400"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                      AD
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">Administrador</h5>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Sucursal Principal</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-950/10 transition"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black md:text-3xl text-zinc-900 dark:text-white capitalize">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">Panel de control de BarberBook Studio</p>
            </div>
            
            {/* Quick configuration buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition"
              >
                {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
              </button>
              <button
                onClick={handleRefreshData}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 transition active:scale-95 shadow-lg shadow-amber-500/10"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Active Tab Router */}
          <div className="transition-all duration-300">
            {activeTab === "overview" && (
              <OverviewTab
                metrics={data.metrics}
                analytics={data.analytics}
                appointments={data.appointments}
                onSwitchTab={setActiveTab}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentsTab
                appointments={data.appointments}
                onRefresh={handleRefreshData}
              />
            )}

            {activeTab === "caja" && (
              <CajaTab
                activeRegister={data.cashRegisters.find(r => r.status === "open") || null}
                cashMovements={data.cashMovements}
                sales={data.sales}
                expenses={data.expenses}
                onRefresh={handleRefreshData}
              />
            )}

            {activeTab === "customers" && (
              <CustomersTab
                customers={data.customers}
                onRefresh={handleRefreshData}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryTab
                products={data.products}
                onRefresh={handleRefreshData}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                services={data.services}
                blockedDates={data.blockedDates}
                gallery={data.gallery}
                onRefresh={handleRefreshData}
              />
            )}
          </div>
        </main>

      </div>

    </div>
  )
}
